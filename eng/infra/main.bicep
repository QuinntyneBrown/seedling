// Seedling production stack: everything the app needs, in one idempotent
// template. Deployed into the resource group by .github/workflows/deploy.yml
// on every push to main, and once by hand from eng/Bootstrap-Azure.ps1.
//
// Tiers are the cheapest ones that still carry an SLA and the features the app
// relies on (Always On for the triggered WebJobs, backups, TLS 1.2):
//
//   App Service plan   Linux Basic B1 (1 core, 1.75 GB)     ≈ US$13/month
//   Azure SQL          Basic (5 DTU, 2 GB, 7-day PITR)      ≈ US$5/month
//   Static Web Apps    Free ×3 (app, admin, design system)  US$0 (Standard = +US$9 each)
//   Log Analytics +    pay-as-you-go, first 5 GB/month free, capped at 0.5 GB/day
//   App Insights
//   Microsoft Foundry  Claude on Global Standard, billed per token
//
// Re-running converges on the same state; nothing here is destructive.

targetScope = 'resourceGroup'

// ───────────────────────────── naming ─────────────────────────────

@description('Short suffix shared by every resource name (sl-api-<suffix>, sl-sql-<suffix>, …). Web App and SQL server names are global.')
param suffix string

@description('Region for the plan, API, SQL and monitoring. Defaults to the resource group\'s.')
param location string = resourceGroup().location

@description('Static Web Apps are only offered in a few regions.')
param swaLocation string = 'eastus2'

@description('A region that offers the chosen Claude model on Global Standard.')
param foundryLocation string = 'eastus2'

param planName string = 'sl-plan-${suffix}'
param apiName string = 'sl-api-${suffix}'
param sqlServerName string = 'sl-sql-${suffix}'
param sqlDatabaseName string = 'seedling'
param webSwaName string = 'sl-web-${suffix}'
param adminSwaName string = 'sl-admin-${suffix}'
param designSwaName string = 'sl-design-${suffix}'
param foundryAccountName string = 'sl-ai-${suffix}'
param logAnalyticsName string = 'sl-logs-${suffix}'
param appInsightsName string = 'sl-insights-${suffix}'

// ───────────────────────────── sizing ─────────────────────────────

@description('App Service plan SKU. B1 is the cheapest tier with Always On (needed by the scheduled WebJobs) and an SLA.')
@allowed(['B1', 'B2', 'B3', 'S1', 'P0v3', 'P1v3'])
param apiSkuName string = 'B1'

@description('Azure SQL SKU. Basic is the cheapest tier with an SLA and point-in-time restore; S0 is the next step up.')
@allowed(['Basic', 'S0', 'S1', 'GP_S_Gen5_1'])
param sqlSkuName string = 'Basic'

@description('Max database size in bytes. Basic allows up to 2 GB.')
param sqlMaxSizeBytes int = 2147483648

@description('Static Web Apps tier. Free has no SLA; Standard (US$9/app/month) adds one plus more bandwidth and custom auth.')
@allowed(['Free', 'Standard'])
param swaSkuName string = 'Free'

@description('Daily Log Analytics ingestion cap in GB, so a log storm cannot run up the bill.')
param logDailyCapGb string = '0.5'

// ───────────────────────────── app config ─────────────────────────────

@description('Custom domain for the app. Blank skips the binding; the domain must already validate in DNS.')
param appCustomDomain string = ''

@description('Custom domain for the admin app. Blank skips the binding; the domain must already validate in DNS.')
param adminCustomDomain string = ''

@description('Extra origins allowed by CORS beside the Static Web Apps and the custom domains.')
param extraCorsOrigins array = []

@secure()
@description('SQL administrator login. Immutable once the server exists; pass the current one when re-deploying over an existing server.')
param sqlAdminLogin string

@secure()
param sqlAdminPassword string

@secure()
@minLength(32)
@description('HMAC key for the API\'s JWTs (SEEDLING_JWT_SIGNING_KEY). Rotating it signs everyone out.')
param jwtSigningKey string

// ───────────────────────────── Claude on Foundry ─────────────────────────────

param claudeDeploymentName string = 'claude-sonnet-5'
param claudeModelName string = 'claude-sonnet-5'
@description('Version 2 is the Azure-hosted build.')
param claudeModelVersion string = '2'
@description('Thousands of tokens per minute. Free to reserve; tokens are billed per use.')
param claudeCapacity int = 80

@description('Legal name of the organization using Claude: the Anthropic Marketplace attestation.')
param organizationName string
@minLength(2)
@maxLength(2)
param countryCode string = 'CA'
param industry string = 'technology'

// ───────────────────────────── agents ─────────────────────────────

@description('Turns the agents on. Off, every agent-backed feature falls back with a notice.')
param agentsEnabled bool = false

@description('Grants the Web App identity Cognitive Services User on the Foundry account. Needs a deploying principal that may write role assignments.')
param agentsGrantRole bool = false

@description('How the agents reach Foundry: ManagedIdentity (an Entra token for the Web App identity, no key) or Key.')
@allowed(['ManagedIdentity', 'Key'])
param agentsAuth string = 'ManagedIdentity'

@description('Agent spend allowed per calendar month, in US dollars.')
param agentsMonthlySpendCapUsd int = 25

@description('Agent runs allowed per UTC day.')
param agentsMaxRunsPerDay int = 60

// ───────────────────────────── guardrails ─────────────────────────────

@description('Monthly budget for the resource group, in the subscription\'s billing currency. Alerts fire at 80 % and 100 %.')
param budgetAmount int = 40

@description('Where budget alerts go. Blank disables the budget.')
param alertEmail string = ''

@description('Budgets must start on the first of a month; defaults to the current one.')
param budgetStartDate string = utcNow('yyyy-MM-01')

param tags object = {
  app: 'seedling'
  managedBy: 'bicep'
}

// ───────────────────────────── derived values ─────────────────────────────

var apiOrigin = 'https://${api.properties.defaultHostName}'
var webOrigin = 'https://${webSwa.properties.defaultHostname}'
var adminOrigin = 'https://${adminSwa.properties.defaultHostname}'
var appOrigin = empty(appCustomDomain) ? webOrigin : 'https://${appCustomDomain}'

var corsOrigins = union(
  concat(
    [webOrigin, adminOrigin],
    empty(appCustomDomain) ? [] : ['https://${appCustomDomain}'],
    empty(adminCustomDomain) ? [] : ['https://${adminCustomDomain}']
  ),
  extraCorsOrigins
)

// Cors__AllowedOrigins__0, __1, …: .NET's environment-variable array binding.
var corsSettings = toObject(
  range(0, length(corsOrigins)),
  i => 'Cors__AllowedOrigins__${i}',
  i => corsOrigins[i]
)

var sqlConnectionString = 'Server=tcp:${sqlServer.properties.fullyQualifiedDomainName},1433;Initial Catalog=${sqlDatabaseName};User ID=${sqlAdminLogin};Password=${sqlAdminPassword};Encrypt=True;TrustServerCertificate=False;MultipleActiveResultSets=False;Connection Timeout=30;'

// ───────────────────────────── monitoring ─────────────────────────────

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  tags: tags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
    workspaceCapping: { dailyQuotaGb: json(logDailyCapGb) }
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    IngestionMode: 'LogAnalytics'
    RetentionInDays: 30
  }
}

// ───────────────────────────── database ─────────────────────────────

resource sqlServer 'Microsoft.Sql/servers@2023-08-01-preview' = {
  name: sqlServerName
  location: location
  tags: tags
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    // The migration job connects from a GitHub runner through a firewall rule
    // it adds and removes around the run; private endpoints would cost more
    // than the database.
    publicNetworkAccess: 'Enabled'
  }

  // Lets the App Service reach the server without a per-outbound-IP rule.
  resource allowAzure 'firewallRules' = {
    name: 'AllowAllWindowsAzureIps'
    properties: {
      startIpAddress: '0.0.0.0'
      endIpAddress: '0.0.0.0'
    }
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-08-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  tags: tags
  sku: sqlSkuName == 'GP_S_Gen5_1'
    ? { name: 'GP_S_Gen5', tier: 'GeneralPurpose', family: 'Gen5', capacity: 1 }
    : { name: sqlSkuName, tier: sqlSkuName == 'Basic' ? 'Basic' : 'Standard' }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: sqlMaxSizeBytes
    zoneRedundant: false
    // Locally redundant backups are the cheapest option; PITR still covers 7 days.
    requestedBackupStorageRedundancy: 'Local'
  }
}

// ───────────────────────────── Claude on Foundry ─────────────────────────────

module foundry '../foundry/claude.bicep' = {
  name: 'foundry-claude'
  params: {
    accountName: foundryAccountName
    location: foundryLocation
    deploymentName: claudeDeploymentName
    modelName: claudeModelName
    modelVersion: claudeModelVersion
    capacity: claudeCapacity
    organizationName: organizationName
    countryCode: countryCode
    industry: industry
    tags: union(tags, { purpose: 'agents' })
  }
}

resource foundryAccount 'Microsoft.CognitiveServices/accounts@2025-10-01-preview' existing = {
  name: foundryAccountName
}

// ───────────────────────────── API ─────────────────────────────

resource plan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: planName
  location: location
  tags: tags
  kind: 'linux'
  sku: {
    name: apiSkuName
    capacity: 1
  }
  properties: {
    reserved: true // Linux
    zoneRedundant: false
  }
}

resource api 'Microsoft.Web/sites@2024-04-01' = {
  name: apiName
  location: location
  tags: tags
  kind: 'app,linux'
  identity: { type: 'SystemAssigned' }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    clientAffinityEnabled: false
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|10.0'
      // Keeps the worker warm so the triggered WebJobs fire on time.
      alwaysOn: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      http20Enabled: true
      use32BitWorkerProcess: false
      webSocketsEnabled: false
      // App settings live in the `appsettings` config resource below so they
      // can reference this site's own host name.
    }
  }
}

resource apiSettings 'Microsoft.Web/sites/config@2024-04-01' = {
  parent: api
  name: 'appsettings'
  properties: union(
    {
      ASPNETCORE_ENVIRONMENT: 'Production'
      // The workflow ships a ready-to-run publish folder; Oryx must not rebuild it.
      SCM_DO_BUILD_DURING_DEPLOYMENT: 'false'
      // A triggered WebJob that prints nothing for two minutes is killed by default.
      WEBJOBS_IDLE_TIMEOUT: '3600'
      // On Linux the Kudu agent that runs WebJobs is off unless asked for;
      // without this a job is shipped but never listed, scheduled or run.
      WEBSITE_SKIP_RUNNING_KUDUAGENT: 'false'

      // Codeless Application Insights for .NET on Linux.
      APPLICATIONINSIGHTS_CONNECTION_STRING: appInsights.properties.ConnectionString
      ApplicationInsightsAgent_EXTENSION_VERSION: '~3'
      XDT_MicrosoftApplicationInsights_Mode: 'recommended'

      // Database: the same variable the CLI (migrations, seeding) reads.
      SEEDLING_CONNECTION: sqlConnectionString

      // Secrets the API refuses to run on placeholders for.
      SEEDLING_JWT_SIGNING_KEY: jwtSigningKey

      // Uploads and key rings live outside wwwroot so a clean zip deploy never
      // deletes them; /home is the plan's persistent share.
      Seedling__Storage__Directory: '/home/data'
      Seedling__App__Origin: appOrigin

      // Agents on Claude in Microsoft Foundry. The runner calls Foundry with the
      // Web App's managed identity (Cognitive Services User, granted below); the
      // key is read straight from the account for local-auth runs, so a
      // rotation is one re-deploy away.
      Seedling__Agents__Enabled: string(agentsEnabled)
      Seedling__Agents__Auth: agentsAuth
      Seedling__Agents__FoundryResource: foundryAccount.name
      Seedling__Agents__Model: foundry.outputs.deploymentName
      Seedling__Agents__MonthlySpendCapUsd: string(agentsMonthlySpendCapUsd)
      Seedling__Agents__MaxRunsPerDay: string(agentsMaxRunsPerDay)
      ANTHROPIC_FOUNDRY_API_KEY: foundryAccount.listKeys().key1
    },
    corsSettings
  )
  // Ordering: `foundry.outputs.deploymentName` above makes this wait for the
  // module, so the account exists before its key is read.
}

// The Web App's identity may call the Foundry deployment for the agents:
// Cognitive Services User, scoped to the one account.
var cognitiveServicesUserRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'a97b65f3-24c7-4388-baec-2e87135dc908')

resource apiFoundryRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (agentsGrantRole) {
  name: guid(foundryAccount.id, api.id, cognitiveServicesUserRoleId)
  scope: foundryAccount
  properties: {
    roleDefinitionId: cognitiveServicesUserRoleId
    principalId: api.identity.principalId
    principalType: 'ServicePrincipal'
  }
  dependsOn: [foundry]
}

resource apiLogs 'Microsoft.Web/sites/config@2024-04-01' = {
  parent: api
  name: 'logs'
  properties: {
    applicationLogs: { fileSystem: { level: 'Warning' } }
    httpLogs: {
      fileSystem: {
        enabled: true
        retentionInDays: 3
        retentionInMb: 35
      }
    }
    detailedErrorMessages: { enabled: true }
    failedRequestsTracing: { enabled: false }
  }
}

// ───────────────────────────── Static Web Apps ─────────────────────────────

var swaProperties = {
  // Deployed by token from GitHub Actions, not by a linked repository.
  buildProperties: { skipGithubActionWorkflowGeneration: true }
  allowConfigFileUpdates: true
  stagingEnvironmentPolicy: 'Disabled'
  enterpriseGradeCdnStatus: 'Disabled'
}

resource webSwa 'Microsoft.Web/staticSites@2024-04-01' = {
  name: webSwaName
  location: swaLocation
  tags: union(tags, { role: 'app' })
  sku: { name: swaSkuName, tier: swaSkuName }
  properties: swaProperties
}

resource webSwaDomain 'Microsoft.Web/staticSites/customDomains@2024-04-01' = if (!empty(appCustomDomain)) {
  parent: webSwa
  name: appCustomDomain
  properties: {
    // TXT validation works for apex and sub-domains alike.
    validationMethod: 'dns-txt-token'
  }
}

resource adminSwa 'Microsoft.Web/staticSites@2024-04-01' = {
  name: adminSwaName
  location: swaLocation
  tags: union(tags, { role: 'admin-app' })
  sku: { name: swaSkuName, tier: swaSkuName }
  properties: swaProperties
}

resource adminSwaDomain 'Microsoft.Web/staticSites/customDomains@2024-04-01' = if (!empty(adminCustomDomain)) {
  parent: adminSwa
  name: adminCustomDomain
  properties: {
    validationMethod: 'dns-txt-token'
  }
}

resource designSwa 'Microsoft.Web/staticSites@2024-04-01' = {
  name: designSwaName
  location: swaLocation
  tags: union(tags, { role: 'design-system' })
  sku: { name: swaSkuName, tier: swaSkuName }
  properties: swaProperties
}

// ───────────────────────────── budget ─────────────────────────────

resource budget 'Microsoft.Consumption/budgets@2023-11-01' = if (!empty(alertEmail)) {
  name: 'seedling-monthly'
  properties: {
    category: 'Cost'
    amount: budgetAmount
    timeGrain: 'Monthly'
    timePeriod: { startDate: budgetStartDate }
    notifications: {
      actual80: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 80
        thresholdType: 'Actual'
        contactEmails: [alertEmail]
      }
      actual100: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 100
        thresholdType: 'Actual'
        contactEmails: [alertEmail]
      }
    }
  }
}

// ───────────────────────────── outputs (no secrets) ─────────────────────────────

output apiName string = api.name
output apiHostName string = api.properties.defaultHostName
output apiOrigin string = apiOrigin
output webSwaName string = webSwa.name
output webSwaHostName string = webSwa.properties.defaultHostname
output adminSwaName string = adminSwa.name
output adminSwaHostName string = adminSwa.properties.defaultHostname
output designSwaName string = designSwa.name
output designSwaHostName string = designSwa.properties.defaultHostname
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
output sqlDatabaseName string = sqlDatabase.name
output foundryAccountName string = foundry.outputs.accountName
output foundryBaseUrl string = foundry.outputs.baseUrl
output claudeDeploymentName string = foundry.outputs.deploymentName
output appInsightsName string = appInsights.name
output corsOrigins array = corsOrigins

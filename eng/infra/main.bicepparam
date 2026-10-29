// Parameters for eng/infra/main.bicep.
//
// Everything non-secret is set here and committed. Secrets and the Marketplace
// attestation come from the environment: GitHub Actions maps them from
// repository secrets and variables, eng/Bootstrap-Azure.ps1 sets them for the
// first deployment. Names must match what already exists in the resource
// group; Bicep converges onto a resource with the same name and creates one
// otherwise.
using 'main.bicep'

// Every resource name carries this suffix; Web App and SQL names are global.
param suffix = readEnvironmentVariable('AZURE_RESOURCE_SUFFIX', 'dev')
param swaLocation = 'eastus2'
param foundryLocation = 'eastus2'

// Cheapest SLA-backed tiers; bump here when the load grows.
param apiSkuName = 'B1'
param sqlSkuName = 'Basic'
param swaSkuName = 'Free'

// Custom domains, each once its DNS TXT validation record is in place.
param appCustomDomain = readEnvironmentVariable('APP_CUSTOM_DOMAIN', '')
param adminCustomDomain = readEnvironmentVariable('ADMIN_CUSTOM_DOMAIN', '')

// Secrets: never committed.
param sqlAdminLogin = readEnvironmentVariable('SQL_ADMIN_LOGIN')
param sqlAdminPassword = readEnvironmentVariable('SQL_ADMIN_PASSWORD')
param jwtSigningKey = readEnvironmentVariable('SEEDLING_JWT_SIGNING_KEY')

// Anthropic Marketplace attestation: the real legal name of the organization using Claude.
param organizationName = readEnvironmentVariable('FOUNDRY_ORGANIZATION_NAME')
param countryCode = readEnvironmentVariable('FOUNDRY_COUNTRY_CODE', 'CA')

// Cost guardrail; blank email disables the budget.
param budgetAmount = 40
param alertEmail = readEnvironmentVariable('BUDGET_ALERT_EMAIL', '')

// Agents. The grant needs a deploying principal allowed to write role
// assignments; the agents stay off until it is in place and the evaluation
// suite under evals/ has passed against the deployment.
param agentsGrantRole = bool(readEnvironmentVariable('AGENTS_GRANT_ROLE', 'false'))
param agentsEnabled = bool(readEnvironmentVariable('AGENTS_ENABLED', 'false'))

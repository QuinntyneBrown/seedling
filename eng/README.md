# eng

Engineering scripts and the Azure infrastructure.

| File                       | What it does                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| `Start-FreshStack.ps1`     | Packs the CLI, resets and seeds the database, publishes the API, builds the app, starts both       |
| `Start-E2eApi.ps1`         | The API on :5100 over a fresh, seeded SQLite file for Playwright                                   |
| `Test-Backend.ps1`         | Builds once, runs the test assemblies side by side (what CI runs)                                  |
| `Bootstrap-Azure.ps1`      | One-time: OIDC app registration, secrets, GitHub variables, first deployment                        |
| `infra/main.bicep`         | The whole Azure stack, idempotent: plan, API, SQL, three Static Web Apps, Foundry, monitoring, budget |
| `infra/main.bicepparam`    | Tiers and names; secrets read from the environment                                                  |
| `foundry/claude.bicep`     | The Microsoft Foundry account and Claude deployment the agents use                                  |

Every script needs PowerShell 7 (`pwsh`).

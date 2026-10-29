# Seedling.Infrastructure

Everything that touches the outside world: `Persistence/` (`AppDbContext`, entity
configurations, the design-time factory), `Migrations/`, `Authentication/`, and one folder per
external integration (an HTTP client, a message sender, the Foundry agent runner). Registered by
`DependencyInjection.AddInfrastructure`, which the API, the CLI and the Worker all call.

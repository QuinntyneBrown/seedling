# Seedling Backend

.NET 10 Clean Architecture backend. See `docs/adr/` for decisions.

## Layout

```text
backend/
  Seedling.sln
  Directory.Build.props          # shared compile settings (net10.0, nullable, warnings-as-errors)
  Directory.Packages.props       # central package management
  global.json                    # pins the SDK to 10.0.x
  deploy/webjobs/<job>/          # App Service triggered WebJobs (run.sh + settings.job)
  src/
    Seedling.Domain/             # entities, enums (no dependencies)
    Seedling.Application/        # MediatR handlers, validators, IAppDbContext, DTOs
    Seedling.Infrastructure/     # AppDbContext, EF migrations, external clients, auth services
    Seedling.Api/                # controllers, Program.cs, DI composition
    Seedling.Cli/                # `seedling migrate` / `seed` / `reset` (packaged dotnet tool)
    Seedling.Worker/             # scheduled background work (container or WebJob)
  tests/
    Seedling.Application.Tests/    # pure unit tests (handlers, validators)
    Seedling.Infrastructure.Tests/ # persistence on SQLite (SQL Server opt-in)
    Seedling.Api.Tests/            # WebApplicationFactory end-to-end on in-memory SQLite
    Seedling.Cli.Tests/            # migrate / seed / reset commands
```

## Local quickstart

```powershell
# 1. Restore + build
dotnet build backend/Seedling.sln

# 2. Apply migrations (set the connection string via env var or appsettings)
$env:SEEDLING_CONNECTION = "Server=(localdb)\MSSQLLocalDB;Database=Seedling;Trusted_Connection=True;TrustServerCertificate=True"
dotnet run --project backend/src/Seedling.Cli -- migrate

# 3. Seed (idempotent)
dotnet run --project backend/src/Seedling.Cli -- seed

# 4. Run the API
dotnet run --project backend/src/Seedling.Api
```

Swagger UI is served at `/swagger` outside Production.

## Test the whole stack

```powershell
dotnet test backend/Seedling.sln
```

No database server: the API and Infrastructure tests run on a per-fixture in-memory SQLite
database, the Application and CLI tests on EF Core InMemory. Tests of SQL Server-only behaviour
use `[SqlServerFact]` and are skipped unless `SEEDLING_TEST_SQLSERVER` is `localdb` or a server
connection string; run them with `dotnet test backend/Seedling.sln --filter Category=SqlServer`.
`pwsh eng/Test-Backend.ps1` runs the suite as CI does.

## Adding a feature

1. Requirement in `docs/specs/L2.md`, detailed design in `docs/detailed-designs/`, mock in `docs/mocks/`.
2. Entities in `Seedling.Domain`, mapping in `Seedling.Infrastructure/Persistence/Configurations`, a migration.
3. Commands, queries, handlers and validators in `Seedling.Application/<Feature>/`.
4. A controller in `Seedling.Api/Controllers/`, thin: it sends to MediatR and returns the DTO.
5. Acceptance tests in `Seedling.Api.Tests/<Feature>/` first, then the code that makes them pass.

## API surface

| Method | Route        | Purpose                                      |
| ------ | ------------ | -------------------------------------------- |
| GET    | `/api/_ping` | Pipeline smoke endpoint (deploy and tests)   |

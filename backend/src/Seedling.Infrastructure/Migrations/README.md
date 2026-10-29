# Migrations

EF Core migrations for SQL Server, generated with:

```sh
dotnet ef migrations add <Name> --project src/Seedling.Infrastructure --startup-project src/Seedling.Api
```

They are applied by `seedling migrate` (locally and from the deploy pipeline), never by the API on
startup. SQLite, used by the tests and `eng/Start-E2eApi.ps1`, creates its schema from the model.

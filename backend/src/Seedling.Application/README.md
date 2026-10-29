# Seedling.Application

Use cases. One folder per feature (`Auth/`, `Tenants/`, …) holding its MediatR commands and
queries, their handlers and validators, and the DTO contracts the API returns. Cross-cutting
pieces: `Abstractions/` (ports such as `IAppDbContext`), `Behaviors/` (the MediatR pipeline),
`Common/` (clock, options), `Exceptions/` (the errors the API middleware maps to status codes).
Business rules live here and in domain services, never in controllers.

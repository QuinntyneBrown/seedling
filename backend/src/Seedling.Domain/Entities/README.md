# Entities

One class per aggregate or entity, plain C# with no framework dependency. Identity is a `Guid`,
timestamps are `DateTimeOffset` in UTC with the `Utc` suffix, and invariants that need no
infrastructure live on the entity itself. Mapping and indexes belong to
`Seedling.Infrastructure/Persistence/Configurations`, never to attributes here.

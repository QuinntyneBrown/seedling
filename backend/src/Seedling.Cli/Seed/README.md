# Seed

`seedling seed`: idempotent seed data, safe to re-run. One `I<Entity>Seeder` per aggregate reads
`Seed/Data/<entity>.json` (bundled into the tool package) and upserts by natural key. The e2e
suite and the fresh-stack script depend on the seeded accounts.

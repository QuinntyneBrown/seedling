# Reset

`seedling reset`: drops and recreates the database, then migrates. A `ResetGuard` refuses to run
against anything that does not look like a local development database.

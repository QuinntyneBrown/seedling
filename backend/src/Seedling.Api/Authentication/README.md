# Authentication

The HTTP side of auth: the current-user accessor the handlers read claims from, and the JWT bearer
wiring `Program.cs` adds once the Auth feature lands. Endpoints require authentication by default
through a fallback policy; anonymous access is explicit with `[AllowAnonymous]`.

# api

Backend integration for every Seedling application: service contracts and injection tokens, the
HTTP implementations, view models, route guards, the auth interceptor and test doubles.

| Path                | What it is                                                    |
| ------------------- | ------------------------------------------------------------- |
| `src/public-api.ts` | The library's only entry point                                |
| `src/lib/api/`      | Pure helpers and the `API_BASE_URL` token                     |
| `src/lib/auth/`     | Guards, the auth interceptor, the session store               |
| `src/lib/models/`   | View models and DTOs, one barrel per screen                   |
| `src/lib/services/` | One interface + token + implementation per backend capability |
| `src/lib/testing/`  | Test doubles for the contracts                                |
| `SERVICE_API.md`    | The public API, kept current                                  |

Build with `npm run build -- api` from `frontend/`; test with `npm test -- --project api`.

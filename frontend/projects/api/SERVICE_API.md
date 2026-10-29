# api — Public API

Pages inject the `*_SERVICE` tokens and depend only on the contracts; the concrete classes are
bound in each application's `app.config.ts`. Every screen reads one reactive view model
(`Signal<…View>`) and calls plain methods to change it. Pure helpers (dates, formatting,
projections) are exported from `lib/api/` so every page shares one implementation.

Keep this file current: every exported helper, model barrel and service appears here.

## Helpers

| Module                 | Exports        | Description                                              |
| ---------------------- | -------------- | -------------------------------------------------------- |
| `lib/api/api-base-url` | `API_BASE_URL` | The backend origin, bound from `environment.apiBaseUrl`. |

## View models

One barrel per screen under `lib/models/`.

| Barrel | Types |
| ------ | ----- |
|        |       |

## Classes

### `<Name>Service`

_Implements: `I<Name>Service`_ · _Token: `<NAME>_SERVICE`_

| Method | Parameters | Returns | Description |
| ------ | ---------- | ------- | ----------- |
|        |            |         |             |

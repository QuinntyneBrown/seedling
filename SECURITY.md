# Security Policy

## Supported versions

Security fixes are applied to the default branch. If release branches or tagged versions are
introduced later, this file should be updated with the supported version matrix.

| Version | Supported |
| ------- | --------- |
| `main`  | Yes       |

## Reporting a vulnerability

Do not report suspected security vulnerabilities in public issues.

Report vulnerabilities privately to the project maintainers through GitHub's
[private vulnerability reporting](https://github.com/QuinntyneBrown/seedling/security/advisories/new).
Include as much detail as possible:

- affected component, route, command, package or commit;
- reproduction steps or proof of concept;
- expected and actual impact;
- affected configuration or environment;
- suggested mitigation, if known.

## Response expectations

Maintainers should acknowledge valid reports as soon as practical, investigate the issue, and
coordinate a fix before public disclosure when appropriate.

If the report is not accepted as a vulnerability, maintainers should explain why and, when
possible, suggest a more appropriate issue type.

## Security-sensitive areas

Changes in these areas should receive extra review:

- authentication and token handling;
- password hashing and credential validation;
- authorization guards and current-user resolution;
- tenant scoping of data;
- database migrations and seed data;
- environment variables, connection strings and the Bicep template's app settings;
- the service worker and what it caches;
- frontend session storage;
- CI/CD identity, secrets and deployment;
- agent prompts, tool access and the spend caps on Microsoft Foundry;
- third-party package upgrades with known advisories.

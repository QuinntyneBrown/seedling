## Summary

<!-- What changes and why. Link the issue, the L2 requirement and the detailed design. -->

Closes #

## Traceability

- Requirement: `L2-`
- Detailed design: `docs/detailed-designs/<subsystem>/<feature>/README.md`
- Mock: `docs/mocks/pages/<page>.html`
- ADR (if the architecture changed): `docs/adr/ADR-`

## Checklist

- [ ] Acceptance tests were written first and fail for the expected reason before the code
- [ ] Every Angular component is split into `.ts`, `.html` and `.scss` files (no inline templates or styles)
- [ ] Design-system components live in `frontend/projects/components` with a story folder and a perf-test scenario
- [ ] Backend business rules live in handlers or domain services, not controllers
- [ ] EF migrations are explicit and seed data stays idempotent
- [ ] Documentation is updated (`SERVICE_API.md`, README, specs, designs)
- [ ] UI changes include screenshots or Playwright evidence

## Commands run

```sh

```

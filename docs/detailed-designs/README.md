# Detailed designs

One design per feature: `docs/detailed-designs/<subsystem>/<feature>/README.md`, written with the
`writing-software-design-documents` skill from the L1/L2 requirements, before implementation.

```text
detailed-designs/
└── <subsystem>/                 # identity-and-access, administration, web-experience, operations, agents, …
    └── <feature>/
        ├── README.md            # Traces to L1/L2 + ADRs; structure, flows, data, API, tests, slices
        └── diagrams/            # PlantUML sources rendered by the skill
```

Each design names the vertical slices it will be implemented in, so the `implementing-incrementally`
skill can pick them up one at a time.

## Index

Thirty-seven feature designs cover all 49 L2 requirements in `docs/specs/L2.md`. Each row links to
the feature design and lists the L2 requirements it realizes.

| Subsystem | Feature | L2 requirements |
| --------- | ------- | --------------- |
| web-experience | [installable-pwa](web-experience/installable-pwa/README.md) | L2-001, L2-002 |
| web-experience | [offline-status-and-queue](web-experience/offline-status-and-queue/README.md) | L2-003 |
| web-experience | [responsive-layout](web-experience/responsive-layout/README.md) | L2-004, L2-005 |
| web-experience | [language-and-reading-level](web-experience/language-and-reading-level/README.md) | L2-027, L2-028 |
| web-experience | [accessible-screens](web-experience/accessible-screens/README.md) | L2-049 |
| web-experience | [performance-budget](web-experience/performance-budget/README.md) | L2-006, L2-048 |
| identity-and-access | [sign-up-and-verify](identity-and-access/sign-up-and-verify/README.md) | L2-007, L2-043 |
| identity-and-access | [sessions-and-devices](identity-and-access/sessions-and-devices/README.md) | L2-008, L2-044 |
| identity-and-access | [case-authorization](identity-and-access/case-authorization/README.md) | L2-045 |
| onboarding | [start-wizard](onboarding/start-wizard/README.md) | L2-036, L2-041, L2-042 |
| onboarding | [answer-wizard-question](onboarding/answer-wizard-question/README.md) | L2-037 |
| onboarding | [wizard-roadmap](onboarding/wizard-roadmap/README.md) | L2-038, L2-039 |
| onboarding | [stop-and-resume](onboarding/stop-and-resume/README.md) | L2-040 |
| eligibility | [add-child](eligibility/add-child/README.md) | L2-009 |
| eligibility | [check-eligibility](eligibility/check-eligibility/README.md) | L2-011, L2-012 |
| intake | [complete-intake-steps](intake/complete-intake-steps/README.md) | L2-013, L2-014 |
| intake | [give-consent](intake/give-consent/README.md) | L2-010 |
| intake | [capture-document](intake/capture-document/README.md) | L2-015, L2-016 |
| case-agent | [select-provider](case-agent/select-provider/README.md) | L2-017 |
| case-agent | [prefill-forms](case-agent/prefill-forms/README.md) | L2-018 |
| case-agent | [approve-and-submit](case-agent/approve-and-submit/README.md) | L2-020 |
| case-agent | [track-submission](case-agent/track-submission/README.md) | L2-019 |
| case-agent | [human-review-handoff](case-agent/human-review-handoff/README.md) | L2-022 |
| case-agent | [case-status-dashboard](case-agent/case-status-dashboard/README.md) | L2-021 |
| account-care | [confirm-deposits](account-care/confirm-deposits/README.md) | L2-023 |
| account-care | [contribution-room-reminder](account-care/contribution-room-reminder/README.md) | L2-024 |
| account-care | [report-life-change](account-care/report-life-change/README.md) | L2-025 |
| account-care | [notification-channels](account-care/notification-channels/README.md) | L2-026 |
| billing | [select-plan](billing/select-plan/README.md) | L2-029 |
| billing | [confirm-payment](billing/confirm-payment/README.md) | L2-030 |
| privacy-and-security | [transport-and-storage-encryption](privacy-and-security/transport-and-storage-encryption/README.md) | L2-031 |
| privacy-and-security | [sensitive-data-vault](privacy-and-security/sensitive-data-vault/README.md) | L2-032 |
| privacy-and-security | [document-retention](privacy-and-security/document-retention/README.md) | L2-033 |
| privacy-and-security | [data-export-and-deletion](privacy-and-security/data-export-and-deletion/README.md) | L2-034 |
| privacy-and-security | [audit-trail](privacy-and-security/audit-trail/README.md) | L2-035 |
| privacy-and-security | [input-validation](privacy-and-security/input-validation/README.md) | L2-046 |
| privacy-and-security | [log-redaction](privacy-and-security/log-redaction/README.md) | L2-047 |

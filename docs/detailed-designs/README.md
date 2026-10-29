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

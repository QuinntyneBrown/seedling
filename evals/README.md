# Agent evaluations

Behaviour evaluations for the agents that run on Claude in Microsoft Foundry. One folder per
suite, each with a written permissible boundary per behaviour and a sample size; a suite passes
only when every behaviour stays within its boundary.

```text
evals/
└── <suite>/
    ├── README.md               behaviours, boundaries, how to run
    ├── requirements.txt        pinned evaluation framework
    ├── .env.example            the Foundry resource and key (never committed)
    ├── behaviors/<id>/         one configuration per behaviour
    ├── run_evals.py            drives the real API against the real deployment
    └── check_boundaries.py     the hard rules that need no judgement
```

Evaluations drive the real workflow against the real Foundry deployment, so without a key every
behaviour is skipped and the command exits 0. No result is ever faked, and no test elsewhere in
the repository calls Foundry. Run a suite before turning the agents on in production
(`AGENTS_ENABLED`).

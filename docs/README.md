# docs

| Folder              | What lives there                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `specs/`            | Requirements: `L1.md` (capabilities) and `L2.md` (detailed, testable, Given/When/Then)          |
| `detailed-designs/` | One design per feature under `<subsystem>/<feature>/README.md`, traced to L1/L2 and ADRs        |
| `adr/`              | Architecture decision records, `ADR-NNN-kebab-title.md`                                        |
| `mocks/`            | The static HTML/CSS design reference: the source of truth for the UI and the visual baselines   |
| `design-system/`    | The design system extracted from the mocks: tokens, foundations, one page per component         |
| `estimates/`        | Effort and completion per subsystem, with the roadmap                                           |
| `prd/`              | Product requirement documents                                                                   |
| `prompts/`          | Saved feature prompts                                                                           |
| `videos/`           | Narrated slide-deck videos, one folder per video                                                |
| `assets/`           | Repository images                                                                               |

Requirements come before code, designs before implementation, mocks before pages. The skills under
`.claude/skills/` produce each of these artifacts in its expected shape.

# Mission Control

Custom Mission Control for persistent AI teammate orchestration.

## Purpose

This is a clean-slate build designed for Jordan's workflow:
- persistent teammates instead of disposable-only agents
- a tool-based left sidebar as the primary navigation surface
- project-centric orchestration
- inspectable memory, docs, cron jobs, and delivery workflows

## Core tools in v1

1. **Task Board** — Kanban workflow for tasks
2. **Team** — persistent teammates, org structure, role ownership, reporting lines
3. **Memory** — browse/search long-term memory and daily memory
4. **Cron & Calendar** — scheduled jobs, next run, history, ownership
5. **Docs** — generated and hand-authored documentation
6. **Projects** — project dashboards, milestones, deliverables, workstreams

Seed project:
- **optionsTaxHub**

## Team model

Initial permanent teammates:
- **Operator** — orchestrator and systems owner
- **Researcher** — discovery, analysis, summaries
- **Developer** — implementation and debugging
- **Reviewer** — QA, acceptance, testing

Model target for all teammates:
- `openai-codex/gpt-5.4`

## Design principles

- OpenClaw runtime is the source of truth for live sessions
- Mission Control database is the source of truth for UI state and work history
- persistent workers and one-off task workers are separate concepts
- project context should be visible and auditable
- important internals like memory and cron should have first-class UI

## Getting started

```bash
npm install
npm run dev
```

App runs on:
- <http://localhost:4000>

## Next docs

- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/INFORMATION_ARCHITECTURE.md`

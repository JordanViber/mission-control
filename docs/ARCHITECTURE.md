# Architecture

## Product direction

This Mission Control is a custom operating system for Jordan's AI work. It is not a generic task board with agents bolted on. The core model is:

- **Jordan** as owner and final approver
- **persistent teammates** with clear roles
- **projects** as the main business container
- **tools** in the left sidebar as stable operating surfaces
- **OpenClaw** as runtime for live agent sessions
- **local database** for state, history, and UI projections

## Core entities

### 1. Projects
Projects are the top-level business containers.

Examples:
- optionsTaxHub

Projects own:
- tasks
- docs
- memory slices
- cron jobs
- milestones
- deliverables
- team assignment defaults

### 2. Workers
Workers are role-based AI teammates.

Initial workers:
- Operator
- Researcher
- Developer
- Reviewer

Worker attributes:
- role
- primary model
- reporting line
- skills/capabilities
- persistent session health
- current workload
- project assignments

### 3. Sessions
There are three session classes:

1. **persistent_worker**
   - long-lived teammate sessions
   - one per worker, optionally one per project+worker later
2. **task_worker**
   - disposable specialists for one-off work
3. **planning_session**
   - structured spec / clarification flows

## Source of truth

### Live truth
OpenClaw runtime is the source of truth for:
- whether a session is actually alive
- live conversation/session state
- active execution

### Product truth
Mission Control DB is the source of truth for:
- tasks
- projects
- docs index
- cron registry
- memory index
- org structure
- UI read models

### Reconciler
A reconciler service is required to heal drift between DB and runtime.

Responsibilities:
- mark missing persistent sessions unhealthy
- recreate persistent sessions when policy allows
- mark dead task workers complete/failed
- refresh next-run and last-run cron metadata
- detect orphaned UI state

## Left sidebar tool system

The sidebar is the core navigation model.

### Workspace group
- Dashboard
- Task Board
- Projects
- Docs

### Operations group
- Team
- Memory
- Cron & Calendar

### System group
- Sessions
- Events
- Settings

This structure should remain stable even as sub-pages grow.

## Team board

The Team tool should support:
- org chart view
- table view
- health status
- session linkage
- reports-to relationships
- default project assignments
- current task load

Initial reporting model:
- Jordan
  - Operator
    - Researcher
    - Developer
    - Reviewer

## Memory tool

The Memory tool should expose:
- long-term memory index
- daily memory timeline
- search
- source file links
- notable decisions / people / projects / TODO slices
- controlled write surfaces later

## Cron & Calendar tool

The Cron & Calendar tool should expose:
- schedule name
- owner worker
- cron expression / timing
- next run
- last run
- status
- runtime history
- failure streak / drift
- linked project

## Docs tool

The Docs tool should expose:
- generated docs
- hand-authored docs
- architecture notes
- runbooks
- project-specific docs
- last updated timestamps

## Projects tool

The Projects tool should expose:
- project health
- milestones
- linked task board slices
- linked docs
- linked cron jobs
- linked memory
- linked teammates
- deliverables

## optionsTaxHub project seed

The first seeded project should include:
- product summary
- primary owner: Jordan
- default workers: Developer + Reviewer
- business priority: revenue and automation

## Suggested v1 stack

- Next.js app router
- TypeScript
- SQLite or Postgres (SQLite acceptable for v1)
- OpenClaw integration layer
- thin server API routes
- file-backed docs/memory indexers where practical

## What we are explicitly not copying from the reference repo

- disposable-agent-first mental model
- fuzzy session bookkeeping
- hidden internals for memory and cron
- generic workflow assumptions over Jordan's real operating model

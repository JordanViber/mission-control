# V1 Data Model

This is the initial domain model for the custom Mission Control implementation.

## Entities

### Project
- id
- name
- slug
- summary
- priority
- stage
- owner
- defaultTeam
- milestones

### Worker
- id
- name
- role
- reportsTo
- model
- status
- focus
- currentProject

### Task
- id
- title
- status
- owner
- project
- priority

### MemoryItem
- id
- title
- bucket
- project
- source
- summary

### CronJob
- id
- name
- schedule
- nextRun
- owner
- project
- status
- notes

### DocItem
- id
- title
- type
- updated
- project
- summary

## Intent

This in-memory seed model is the bridge between static shell work and the later DB-backed implementation.

Next step after this model:
- move to SQLite-backed storage
- add API routes for each tool
- connect project, worker, and task relationships formally

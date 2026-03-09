# Next Steps

Current priority order for the custom Mission Control app:

1. Clean up DB persistence and gitignore handling
   - stop committing transient sqlite artifacts like `*-wal` and `*-shm`
   - keep seed/bootstrap behavior deterministic

2. Add write/mutation APIs
   - tasks
   - workers
   - docs
   - cron jobs
   - memory items

3. Add richer project detail views
   - dedicated optionsTaxHub project page
   - linked tasks, docs, cron jobs, memory, and assigned team

4. Improve UI interactivity
   - task filters
   - project filters
   - team status visual polish
   - project panels and summaries

5. Add runtime/session scaffolding
   - persistent worker registry
   - session health model
   - reconciliation planning surface

Definition of a meaningful checkpoint:
- code implemented
- build passes
- changes committed and pushed
- brief progress update sent

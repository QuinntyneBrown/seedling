# WebJobs

Scheduled work runs on the API's App Service plan as **triggered WebJobs**: no extra resource,
Always On keeps the schedule firing. One folder per job:

```text
deploy/webjobs/<job>/
  run.sh          # entry point: runs the CLI command from the `cli/` folder beside it
  settings.job    # NCRONTAB schedule, in UTC: { "schedule": "0 0 8 * * 5" }
  README.md       # what the job does, its settings, how to run it on demand
```

`deploy.yml` publishes `Seedling.Cli` into `App_Data/jobs/triggered/<job>/cli/` next to `run.sh`
inside the API zip, and fails when the deployed Web App does not list the job. On Linux, WebJobs
run only when `WEBSITE_SKIP_RUNNING_KUDUAGENT` is `false`; `eng/infra/main.bicep` sets it.

The same work can run as `Seedling.Worker` in a container (`src/Seedling.Worker/Dockerfile`) when
the schedule outgrows one instance.

# Screen recordings

`record-clips.mjs` drives the real app with Playwright and writes one MP4 per clip into
`docs/videos/NN-topic/clips/`, from that folder's `clips/clips.mjs`. Demo data for a recording
session lives beside it in `<demo>/` (a script that stages it through the API and a README).
`SL_DEMO_RESET`, when set, is a shell command run once before recording.

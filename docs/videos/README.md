# Videos

Narrated slide-deck videos about this repository, made with the `creating-videos` skill. Each
folder holds the authored text files (`script.md`, `slides.html`, `README.md`) and the generated
media (`NN-topic.mp3`, `NN-topic.mp4`, 1920x1080 with burned-in captions).

```text
docs/videos/
├── assets/              slides.css, slides.js: the deck chrome every slides.html loads
└── NN-kebab-topic/
    ├── script.md        the transcript the audio is synthesized from
    ├── slides.html      the timed slide deck
    ├── README.md        what the video covers and its runtime
    └── clips/           optional screen recordings (tools/video-record)
```

| # | Video | Runtime | What you learn |
| --- | ----- | ------- | -------------- |
|   |       |         |                |

## Building

```sh
node tools/video-audio/generate-audio.mjs docs/videos/NN-topic --dry-run   # validate the script
node tools/video-audio/generate-audio.mjs docs/videos/NN-topic             # narration + manifest
node tools/video-build/build-video.mjs docs/videos/NN-topic --check        # resolve cues
node tools/video-build/build-video.mjs docs/videos/NN-topic                # the MP4
```

### Background music

`--music <file>` on the builder mixes a music bed under the narration: narration normalised to
-18.3 LUFS integrated, the track looped from 0:00 at -11.43 dB below its own level with no ducking,
a 1.5 s fade-in, a 2 s fade-out and a 3 s music-only tail. Opt-in, for a brand video only.

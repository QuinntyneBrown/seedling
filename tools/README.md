# tools

| Folder                   | What it is                                                     |
| ------------------------ | -------------------------------------------------------------- |
| `video-audio/`           | Narration from `script.md` with edge-tts, plus the timing manifest |
| `video-build/`           | `slides.html` + manifest → captioned 1920x1080 MP4             |
| `video-record/`          | Screen recordings of the real app for video clips              |
| `marketing-screenshots/` | The marketing site's images, captured from the real app        |

All are Node scripts; the video tools need ffmpeg and Python with `edge-tts`.

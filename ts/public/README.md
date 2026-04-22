# public/

Served at `/static/*` by `web-server.ts` via `express.static`.

## Expected assets

| File | Purpose | Notes |
| --- | --- | --- |
| `my-eyes.mp4` | Light-mode easter egg (feat-port-047) | H.264 MP4. 300x226, 2.1s, 72KB. Served via `<video autoplay muted playsinline>` in the `_lightEgg` helper. Source: Tenor post 7225082 (`reaction-my-eyes`), `AAAPo` suffix = native MP4 variant. Helper timeout is hardcoded to 1500ms (intentionally cuts the 2.1s clip short for a snappier egg). Adjust if you want full playback. |

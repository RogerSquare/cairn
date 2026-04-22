# public/

Served at `/static/*` by `web-server.ts` via `express.static`.

## Expected assets

| File | Purpose | Notes |
| --- | --- | --- |
| `my-eyes.mp4` | Light-mode easter egg (feat-port-047) | H.264 MP4. 300x226, 2.1s, 72KB. Served via `<video autoplay muted playsinline>` in the `_lightEgg` helper. Source: Tenor post 7225082 (`reaction-my-eyes`), `AAAPo` suffix = native MP4 variant. If replacing the clip, the helper timeout is hardcoded to 2500ms — adjust if the new clip is longer than ~2.2s. |

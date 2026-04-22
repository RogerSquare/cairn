# public/

Served at `/static/*` by `web-server.ts` via `express.static`.

## Expected assets

| File | Purpose | Notes |
| --- | --- | --- |
| `my-eyes.webp` | Light-mode easter egg (feat-port-047) | Animated WebP. 444x298, 2.7s, 412KB. Converted from the 1.6MB Tenor GIF via `ffmpeg -c:v libwebp -loop 0 -lossless 0 -q:v 70`. If replacing the clip, the helper timeout in `web-server.ts` (`_lightEgg`) is hardcoded to 2800ms. |

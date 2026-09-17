// Temporary config for local headless-browser debugging only (paired with
// debug.html / src/debug-main.jsx) — allows the Docker-container Playwright
// runner to reach this dev server via the host.docker.internal hostname,
// which Vite's default allowedHosts check otherwise rejects.
import base from './vite.config.mjs';

export default {
  ...base,
  server: {
    ...base.server,
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    allowedHosts: ['host.docker.internal', 'localhost'],
  },
};

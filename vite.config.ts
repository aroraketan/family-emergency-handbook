import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function siteBase(): string {
  const raw = process.env.VITE_BASE_PATH || '/';
  if (raw === '/' || raw === '') return '/';
  return raw.endsWith('/') ? raw : `${raw}/`;
}

export default defineConfig({
  plugins: [react()],
  base: siteBase(),
  server: {
    port: 5173,
    open: true,
  },
});

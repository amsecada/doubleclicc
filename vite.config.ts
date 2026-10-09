import { defineConfig } from 'vite';
import { DIAGNOSTIC_HREF } from './src/config';

export default defineConfig({
  base: process.env.SITE_BASE || '/',
  plugins: [{
    name: 'diagnostic-fallback-link',
    transformIndexHtml: (html) => html.replace('__DIAGNOSTIC_HREF__', DIAGNOSTIC_HREF),
  }],
  build: { outDir: 'dist' },
});

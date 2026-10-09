import { defineConfig } from '@playwright/test';

const base = process.env.SITE_BASE || '/';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  workers: 2,
  use: { baseURL: `http://127.0.0.1:4173${base}`, trace: 'retain-on-failure' },
  webServer: {
    command: `npm run preview -- --port 4173 --strictPort --base=${base}`,
    url: `http://127.0.0.1:4173${base}`,
    reuseExistingServer: false,
  },
});

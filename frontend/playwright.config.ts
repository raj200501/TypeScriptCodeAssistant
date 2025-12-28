import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './playwright',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:5173',
    viewport: { width: 1400, height: 900 },
  },
  webServer: {
    command: 'npm run dev',
    cwd: path.resolve(__dirname, '..'),
    port: 5173,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

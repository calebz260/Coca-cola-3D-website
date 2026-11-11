import { defineConfig, devices } from '@playwright/test';

/**
 * Runs against the production build (vite preview on :4173), which proxies /api to the
 * Express server on :5050. Start the API and database first (see README).
 */
export default defineConfig({
  testDir: './e2e',
  // Generous because WebGL is rendered on the CPU (SwiftShader); real GPUs are far faster.
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  // Software WebGL (SwiftShader) is CPU-bound; parallel workers starve each other and time out.
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    // Uses the locally installed Google Chrome. Remove this line after `npx playwright install chromium`
    // to use Playwright's bundled browser instead.
    channel: 'chrome',
    // Software WebGL so the 3D stage renders in headless Chromium.
    launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 }, hasTouch: true } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'small-mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true } },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  // A single browser worker keeps Chromium teardown deterministic in the
  // memory-constrained clean verifier. Projects still cover desktop and mobile.
  fullyParallel: false,
  workers: 1,
  // The container's headless Chromium can occasionally lose its GPU process
  // while creating a new isolated context. Retry the whole test in a fresh
  // browser and keep GPU compositing out of this deterministic UI suite.
  retries: 1,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    launchOptions: { args: ["--disable-dev-shm-usage", "--disable-gpu", "--disable-software-rasterizer"] },
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } }
  ],
  webServer: {
    // Playwright owns the server process and closes it after the test run.
    command: "npm run preview -- --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false
  }
});

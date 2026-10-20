import { defineConfig } from "@playwright/test";
const port = process.env.TEST_PORT || "3100";
export default defineConfig({
  testDir: "./tests",
  timeout: 240000,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    launchOptions:
      process.platform === "win32"
        ? {
            executablePath:
              "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
          }
        : {},
  },
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
  },
  workers: 1,
});

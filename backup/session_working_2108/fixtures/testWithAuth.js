// fixtures/testWithAuth.js
const { test: base } = require("@playwright/test");
const { ensureAuth, clearAuth } = require("../utils/SessionManager");

const test = base.extend({
  storageState: async ({}, use) => {
    const storageStatePath = await ensureAuth();
    await use(storageStatePath);
  },

  page: async ({ page }, use) => {
    await page.goto("https://automationexercise.com/");
    await use(page);
  },
});

// Clean session after all tests
test.afterAll(async () => {
  await clearAuth();
});

module.exports = { test };

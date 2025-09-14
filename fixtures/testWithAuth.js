// fixtures/testWithAuth.js
const { test: base } = require("@playwright/test");
const { ensureAuth } = require("../utils/SessionManager");

const test = base.extend({
  storageState: async ({}, use) => {
    // ✅ Always ensures auth.json exists and is valid
    const storageStatePath = await ensureAuth();
    await use(storageStatePath);
  },

  page: async ({ context }, use) => {
    // ✅ Context already has storageState injected
    const page = await context.newPage();
    await page.goto("https://automationexercise.com/");

    // Double-check: if session expired during run → regenerate
    if (!(await page.$('a[href="/logout"]'))) {
      console.log("⚠️ Session not valid, refreshing login...");
      const { doLogin, authFile } = require("../utils/SessionManager");
      await doLogin();

      // Reload with fresh session
      const freshContext = await context.browser().newContext({
        storageState: authFile,
      });
      const freshPage = await freshContext.newPage();
      await freshPage.goto("https://automationexercise.com/");
      await use(freshPage);
    } else {
      await use(page);
    }
  },
});

module.exports = { test };

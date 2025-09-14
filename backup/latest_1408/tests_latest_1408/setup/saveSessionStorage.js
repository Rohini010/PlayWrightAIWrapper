const { chromium } = require("@playwright/test");

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://automationexercise.com/login");
  await page
    .locator('.login-form input[placeholder="Email Address"]')
    .fill("rohini@example.com");
  await page
    .locator('.login-form input[placeholder="Password"]')
    .fill("Rohini@123");
  await page.locator('.login-form button[type="submit"]').click();

  await page.waitForURL("https://automationexercise.com/");
  await page.waitForSelector("a:has-text('Logout')", { timeout: 50000 });

  await context.storageState({ path: "storageState.json" });
  console.log("for debugging: storageState.json generated");

  const sessionStorage = await page.evaluate(() => {
    const store = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      store[key] = sessionStorage.getItem(key);
    }
    return store;
  });
  const localStorage = await page.evaluate(() => {
    const store = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      store[key] = localStorage.getItem(key);
    }
    return store;
  });

  console.log("sessionStorage:", sessionStorage);
  console.log("localStorage:", localStorage);

  await browser.close();
})();

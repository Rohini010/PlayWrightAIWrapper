// tests/loginSetup.spec.js
const { test } = require("@playwright/test");
const { validuser } = require("../test-data/userData");
const path = require("path");

const authFile = path.join(__dirname, "../auth.json");

test("Generate auth.json", async ({ page }) => {
  await page.goto("https://automationexercise.com/login");
  await page.fill(
    '.login-form input[placeholder="Email Address"]',
    validuser.email
  );
  await page.fill(
    '.login-form input[placeholder="Password"]',
    validuser.password
  );
  await page.click('.login-form button[type="submit"]');
  await page.waitForURL("https://automationexercise.com/");
  await page.waitForSelector("a:has-text('Logout')");
  await page.context().storageState({ path: authFile });
  console.log(` Auth session saved to ${authFile}`);
});

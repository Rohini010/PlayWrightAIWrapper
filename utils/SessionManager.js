// utils/SessionManager.js
const path = require("path");
const fs = require("fs");
const { chromium } = require("@playwright/test");

const authFile = path.join(__dirname, "../auth.json");

async function doLogin() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://automationexercise.com/login");

  await page.fill('input[data-qa="login-email"]', "rohini@example.com");
  await page.fill('input[data-qa="login-password"]', "Rohini@123");
  await page.click('button[data-qa="login-button"]');

  await page.waitForSelector('a[href="/logout"]', { timeout: 10000 });

  await context.storageState({ path: authFile });
  await browser.close();

  console.log("auth.json created successfully.");
}

async function ensureAuth() {
  if (!fs.existsSync(authFile)) {
    console.log("auth.json missing. Logging in...");
    await doLogin();
  }
  return authFile;
}

async function clearAuth() {
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile);
    console.log("Removed auth.json.");
  }
}

module.exports = { ensureAuth, clearAuth, authFile, doLogin }; // ✅ export doLogin

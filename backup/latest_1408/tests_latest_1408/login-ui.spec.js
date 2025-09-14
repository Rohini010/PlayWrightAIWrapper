const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../page-objects/LoginPage");
const { email, password } = require("../test-data/userData");

test("Login to the application", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.validLogin(email, password);
  await expect(page).toHaveURL("https://automationexercise.com/");
});

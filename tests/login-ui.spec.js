const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../page-objects/LoginPage");

test.describe("Login Tests", () => {
  test("Login to the application", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.validLogin();
    await expect(page).toHaveURL("https://automationexercise.com/");
    await loginPage.logout();
  });

  test("Invalid Login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.invalidLogin();
    const errorMsg = await loginPage.errorMessage;
    await expect(errorMsg).toBeVisible();
  });
});

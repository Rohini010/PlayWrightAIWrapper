const { test, expect } = require("@playwright/test");
// const { LoginPage } = require("../page-objects/LoginPage");
const { Products } = require("../page-objects/Products");
const { email, password, productName } = require("../test-data/userData");

test.use({ storageState: "storageState.json" });

test("Add product to cart", async ({ page }) => {
  // const loginPage = new LoginPage(page);
  const productsPage = new Products(page);

  // await loginPage.open();
  // await loginPage.validLogin(email, password);

  await productsPage.openProductsPage();
  const successMessage = await productsPage.addProductToCart(productName);
  expect(successMessage).toContain("Your product has been added to cart.");
});

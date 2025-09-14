const { test, expect } = require("@playwright/test");
// const { LoginPage } = require("../page-objects/LoginPage");
const { Products } = require("../page-objects/Products");
const { Cart } = require("../page-objects/Cart");
const { email, password, productName } = require("../test-data/userData");

test.use({ storageState: "storageState.json" });

test("Verify product in cart", async ({ page }) => {
  // const loginPage = new LoginPage(page);
  const productsPage = new Products(page);
  const cart = new Cart(page);

  // await loginPage.open();
  // await loginPage.validLogin(email, password);

  await productsPage.openProductsPage();
  await productsPage.addProductToCart(productName);
  await productsPage.navigateToCart();

  const isProductInCart = await cart.verifyProductInCart(productName);
  expect(isProductInCart).toBe(true);
});

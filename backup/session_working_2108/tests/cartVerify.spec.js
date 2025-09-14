const { test } = require("../fixtures/testWithAuth");

const { expect } = require("@playwright/test");
const { clearCart } = require("../utils/clearCart");
const { CartPage } = require("../page-objects/CartPage");
const { ProductsPage } = require("../page-objects/ProductsPage");
const testData = require("../test-data/userData");

test.describe("Cart Verification Flow", () => {
  let productsPage, cartPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    // Always start with empty cart
    await clearCart(page);
  });
  test("verify cart has added  multiple products", async ({ page }) => {
    await productsPage.openProductsPage();
    await productsPage.addProductsToCart(testData.productNames);

    await productsPage.navigateToCart();
    const items = await cartPage.getCartProductNames();

    for (const expected of testData.productNames) {
      expect(items).toContain(expected);
    }
  });
});

const { test } = require("../fixtures/testWithAuth");

const { expect } = require("@playwright/test");
const { clearCart } = require("../utils/clearCart");
const { ProductsPage } = require("../page-objects/ProductsPage");
const { CartPage } = require("../page-objects/CartPage");
const testData = require("../test-data/userData");

test.describe("Add Product Flow", () => {
  let productsPage, cartPage;
  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    // Always start with empty cart
    await clearCart(page);
  });
  test.afterEach(async () => {
    // Cleanup not strictly needed since clearCart is in beforeEach
  });

  test("should add a single product to cart", async ({ page }) => {
    // const productsPage = new ProductsPage(page);

    await productsPage.openProductsPage();

    const message = await productsPage.addProductToCart(testData.productName);

    expect(message).toContain("added"); // Modal text check
    console.log(` ${testData.productName} added with msg: ${message}`);
  });

  test("should add multiple products to cart", async ({ page }) => {
    // const productsPage = new ProductsPage(page);

    await productsPage.openProductsPage();
    const results = await productsPage.addProductsToCart(testData.productNames);

    for (const { name, message } of results) {
      expect(message).toContain("added");
      console.log(` ${name} added with msg: ${message} `);
    }
  });
});

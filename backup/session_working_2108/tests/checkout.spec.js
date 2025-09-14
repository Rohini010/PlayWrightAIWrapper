const { test } = require("../fixtures/testWithAuth");
const { expect } = require("@playwright/test");
const { clearCart } = require("../utils/clearCart");
const { ProductsPage } = require("../page-objects/ProductsPage");
const { CartPage } = require("../page-objects/CartPage");
const { CheckoutPage } = require("../page-objects/CheckoutPage");
const testData = require("../test-data/userData");

test.describe("Checkout Flow", () => {
  let productsPage, cartPage, checkoutPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Always start with empty cart
    await clearCart(page);
  });

  test("Checkout and place order", async ({ page }) => {
    // Navigate to products and add product
    await productsPage.openProductsPage();
    await productsPage.addProductToCart(testData.productName);
    await productsPage.navigateToCart();

    // Verify cart
    await cartPage.verifyProductInCart(testData.productName);

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyProductsInCheckout([testData.productName]);

    // Enter message & place order
    await checkoutPage.enterOrderMessage("Automating checkout flow");
    await checkoutPage.placeOrder();

    // Payment details
    await checkoutPage.fillPaymentDetails(testData.payment);
    await checkoutPage.confirmOrder();

    // Logout after placing order
    await checkoutPage.logoutAfterOrder();
  });
});

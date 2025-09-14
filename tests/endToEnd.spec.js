const { test } = require("@playwright/test");
const { LoginPage } = require("../page-objects/LoginPage");
const { ProductsPage } = require("../page-objects/ProductsPage");
const { CartPage } = require("../page-objects/CartPage");
const { CheckoutPage } = require("../page-objects/CheckoutPage");
const testData = require("../test-data/userData");

const scenarios = [
  { name: "Checkout all products (no removal)", remove: false },
  {
    name: `Checkout after removing "${testData.productToRemove}"`,
    remove: true,
  },
];

scenarios.forEach((scenario) => {
  test.describe(`E2E Flow - ${scenario.name}`, () => {
    let loginPage, productsPage, cartPage, checkoutPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      productsPage = new ProductsPage(page);
      cartPage = new CartPage(page);
      checkoutPage = new CheckoutPage(page);

      await loginPage.open();
      await loginPage.validLogin();
      await page.goto("https://automationexercise.com/view_cart");
      await cartPage.clearCart();
    });

    test.afterEach(async () => {
      await loginPage.logout();
    });

    test("User can complete order successfully", async () => {
      await productsPage.openProductsPage();
      await productsPage.addProductsToCart(testData.productNames);
      await productsPage.navigateToCart();

      let expectedProducts = [...testData.productNames];

      if (scenario.remove) {
        await cartPage.removeProduct(testData.productToRemove);
        expectedProducts = expectedProducts.filter(
          (p) => p !== testData.productToRemove
        );
        await cartPage.verifyProductInCart(expectedProducts);
      }

      await cartPage.proceedToCheckout();
      await checkoutPage.verifyProductsInCheckout(expectedProducts);
      await checkoutPage.enterOrderMessage("Automating exercise");
      await checkoutPage.placeOrder();
      await checkoutPage.fillPaymentDetails(testData.payment);
      await checkoutPage.confirmOrder(testData.messages.orderSuccess);
    });
  });
});

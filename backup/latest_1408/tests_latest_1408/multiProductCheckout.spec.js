const { test, expect } = require("@playwright/test");
const { Products } = require("../page-objects/Products");
const { Cart } = require("../page-objects/Cart");
const { Checkout } = require("../page-objects/Checkout");
const {
  email,
  password,
  productNames,
  orderSuccessMessage,
} = require("../test-data/userData");

test.use({ storageState: "storageState.json" });

test("Checkout with multiple products", async ({ page }) => {
  const productsPage = new Products(page);
  const cart = new Cart(page);
  const checkout = new Checkout(page);

  await productsPage.openProductsPage();

  for (const name of productNames) {
    const message = await productsPage.addProductToCart(name);
    expect(message).toContain("Your product has been added to cart.");
  }

  await productsPage.navigateToCart();
  await page.pause();

  for (const name of productNames) {
    const isInCart = await cart.verifyProductInCart(name);
    expect(isInCart).toBe(true);
  }

  await checkout.proceedToCheckout(productNames[0]);
  await checkout.confirmOrder(orderSuccessMessage);
  await expect(page).toHaveURL(/.*payment_done/);

  await checkout.logoutAfterOrder();
  await expect(page).toHaveURL(/.*login/);
});

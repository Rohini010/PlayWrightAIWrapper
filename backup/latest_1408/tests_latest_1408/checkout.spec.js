const { test, expect } = require("@playwright/test");
// const { LoginPage } = require("../page-objects/LoginPage");
const { Products } = require("../page-objects/Products");
const { Cart } = require("../page-objects/Cart");
const { Checkout } = require("../page-objects/Checkout");
const {
  email,
  password,
  productName,
  checkoutproductName,
  orderSuccessMessage,
} = require("../test-data/userData");

test.use({ storageState: "storageState.json" });

test("Checkout and place order", async ({ page }) => {
  // const loginPage = new LoginPage(page);
  const productsPage = new Products(page);
  const cart = new Cart(page);
  const checkout = new Checkout(page);

  // await loginPage.open();
  // await loginPage.validLogin(email, password);
  await page.pause();

  await productsPage.openProductsPage();
  await productsPage.addProductToCart(checkoutproductName);
  await productsPage.navigateToCart();

  const isProductInCart = await cart.verifyProductInCart(checkoutproductName);
  expect(isProductInCart).toBe(true);

  await checkout.proceedToCheckout(checkoutproductName);
  await checkout.confirmOrder(orderSuccessMessage);
  await expect(page).toHaveURL(/.*payment_done/);

  await checkout.logoutAfterOrder();
  await expect(page).toHaveURL(/.*login/);
});

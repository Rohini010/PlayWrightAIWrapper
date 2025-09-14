const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../page-objects/LoginPage");
const { Products } = require("../page-objects/Products");
const { Cart } = require("../page-objects/Cart");
const { Checkout } = require("../page-objects/Checkout");
const {
  email,
  password,
  finalproduct,
  orderSuccessMessage,
} = require("../test-data/userData");

test("End-to-End flow", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new Products(page);
  const cart = new Cart(page);
  const checkout = new Checkout(page);

  await loginPage.open();
  await loginPage.validLogin(email, password);
  await productsPage.productLink.click();

  const successMsg = await productsPage.addProductToCart(finalproduct);
  expect(successMsg).toContain("product has been added");

  await productsPage.navigateToCart();
  const isProductInCart = await cart.verifyProductInCart(finalproduct);
  expect(isProductInCart).toBe(true);

  await checkout.proceedToCheckout(finalproduct);
  await checkout.confirmOrder(orderSuccessMessage);
  await expect(page).toHaveURL(/.*payment_done/);

  await checkout.logoutAfterOrder();
  await expect(page).toHaveURL(/.*login/);
});

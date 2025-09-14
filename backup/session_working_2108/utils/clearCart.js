// utils/clearCart.js
async function clearCart(page) {
  await page.goto("https://automationexercise.com/view_cart");

  // Remove all items if cart is not empty
  const removeButtons = page.locator(".cart_quantity_delete");
  const count = await removeButtons.count();

  for (let i = 0; i < count; i++) {
    await removeButtons.nth(0).click(); // always delete first item
    await page.waitForTimeout(500);
  }
}

module.exports = { clearCart }; // 👈 Correct export

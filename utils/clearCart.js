async function clearCart(page) {
  await page.goto("https://automationexercise.com/view_cart");

  const removeButtonLocator = page.locator(".cart_quantity_delete");

  while ((await removeButtonLocator.count()) > 0) {
    await removeButtonLocator.first().click();
    // Wait for the button to disappear (DOM update)
    await page.waitForTimeout(500);
  }

  console.log("Cart cleared successfully");
}

module.exports = { clearCart };

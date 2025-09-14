const { BasePage } = require("./BasePage");
const testData = require("../test-data/userData");

class CartPage extends BasePage {
  constructor(page) {
    super(page);

    this.locators = {
      cartItems: {
        css: ".cart_info tbody tr",
        xpath: "//table[@id='cart_info_table']/tbody/tr",
      },
      checkoutBtn: {
        css: ".check_out",
        xpath: "//a[contains(@class,'check_out')]",
        text: "Proceed To Checkout",
        role: "link",
      },
      removeItemBtn: (productName) => ({
        xpath: `//tr[contains(., "${productName}")]//a[contains(@class,"cart_quantity_delete")]`,
        css: `tr:has-text("${productName}") a.cart_quantity_delete`,
        role: "link",
        text: "Delete",
      }),
    };
  }

  async getCartProductNames() {
    const cartItems = await this.page
      .locator(this.locators.cartItems.css)
      .allTextContents();
    return cartItems.map((item) => item.trim().split("\n")[0]);
  }

  async verifyProductInCart(expectedProduct = testData.productName) {
    const cartItems = await this.getCartProductNames();
    const found = cartItems.includes(expectedProduct);
    console.log(
      `Checking if product is in cart: ${expectedProduct} -> ${found}`
    );
    return found;
  }

  async removeProduct(productName = testData.productToRemove) {
    const btn = this.locators.removeItemBtn(productName);
    await this.click(btn, `Remove ${productName} from cart`);
    await this.page
      .locator(`tr:has-text("${productName}")`)
      .waitFor({ state: "detached", timeout: 5000 });
    console.log(`Removed product from cart: ${productName}`);
  }

  async clearCart() {
    const removeButtons = this.page.locator("a.cart_quantity_delete");
    const count = await removeButtons.count();
    for (let i = 0; i < count; i++) {
      await removeButtons.first().click();
      await this.page.waitForTimeout(500);
    }
  }

  async proceedToCheckout() {
    await this.click(this.locators.checkoutBtn, "Proceed To Checkout");
    await this.waitForUrl(/.*checkout/);
  }
}

module.exports = { CartPage };

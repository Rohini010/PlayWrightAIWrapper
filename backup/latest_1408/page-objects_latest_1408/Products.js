const { AIWrapper } = require("../utils/AIWrapper");

class Products {
  constructor(page) {
    this.page = page;
    this.ai = new AIWrapper(page);
  }

  async openProductsPage() {
    await this.page.goto("https://automationexercise.com/");
    await this.ai.smartClick({
      css: "a[href*='/products']",
      text: "Products",
      role: "link",
      xpath: "//a[contains(@href, '/products')]",
    });
  }

  async addProductToCart(productName) {
    const product = this.page
      .locator(".product-image-wrapper .single-products")
      .filter({ hasText: productName });
    const count = await product.count();

    if (count !== 1) {
      throw new Error(`Product "${productName}" not found or duplicated.`);
    }

    await product.hover();

    await this.ai.smartClick({
      text: "Add to cart",
      role: "link",
      xpath: `//a[contains(text(),'Add to cart') and ancestor::*[contains(text(),'${productName}')]]`,
    });

    const message = await this.page
      .locator(".modal-body p")
      .first()
      .textContent();

    await this.ai.smartClick({
      text: "Continue Shopping",
      role: "button",
      xpath: "//button[contains(text(),'Continue Shopping')]",
    });

    return message.trim();
  }

  async navigateToCart() {
    await this.ai.smartClick({
      css: ".nav a[href*='/view_cart']",
      text: "Cart",
      role: "link",
      xpath: "//a[contains(@href, '/view_cart')]",
    });
    await this.page.waitForURL(/.*view_cart/);
  }
}

module.exports = { Products };

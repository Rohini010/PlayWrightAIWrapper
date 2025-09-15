// page-objects/ProductsPage.js
const { BasePage } = require("./BasePage");
const testData = require("../test-data/userData");

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);

    this.locators = {
      productsLink: {
        css: "a[href*='/products']",
        xpath: "//a[contains(@href, '/products)]",
        text: "Products",
        role: "link",
      },
      productWrapperCss: ".product-image-wrapper .single-products",

      cartModalMessage: {
        css: ".modal-body p",

        xpath: "//div[@class='modal-body']/p",
      },

      continueShoppingBtn: {
        xpath: "//button[contains(text(),'Continue Shopping')]",
        text: "Continue Shopping",
        role: "button",
      },

      cartNavLink: {
        css: ".nav a[href*='/view_cart']",
        xpath: "//a[contains(@href, '/view_cart')]",
        text: "Cart",
        role: "link",
      },
    };
  }

  async openProductsPage() {
    await this.navigate("https://automationexercise.com/");
    // should log [Fuzzy Locator] and still click
    await this.click(this.locators.productsLink, "Products link");
  }

  productLocator(productName) {
    return this.page
      .locator(this.locators.productWrapperCss)
      .filter({ hasText: productName });
  }

  async addProductToCart(productName = testData.productName) {
    const product = this.productLocator(productName);
    console.log(`Adding product to cart: ${productName}`);

    const count = await product.count();
    if (count !== 1)
      throw new Error(`Product "${productName}" not found or duplicated.`);

    await product.hover();
    const addToCartBtn = product.locator(
      ".productinfo a:has-text('Add to cart')"
    );
    await addToCartBtn.waitFor({ state: "visible", timeout: 5000 });
    await addToCartBtn.click();

    const message = await this.getText(
      this.locators.cartModalMessage,
      "Cart modal message"
    );
    console.log(`Cart modal message: ${message}`);

    await this.click(this.locators.continueShoppingBtn, "Continue Shopping");
    return message;
  }

  async addProductsToCart(productNames = testData.productNames) {
    const results = [];
    for (const name of productNames) {
      const msg = await this.addProductToCart(name);
      results.push({ name, message: msg });
    }
    return results;
  }

  async navigateToCart() {
    await this.click(this.locators.cartNavLink, "Cart nav link");
    await this.waitForUrl(/.*view_cart/);
  }
}

module.exports = { ProductsPage };

class Products {
  constructor(page) {
    this.page = page;
    this.productLink = page.locator("a[href*='/products']");
    this.allProducts = page.locator(".product-image-wrapper .single-products");
    this.modalMessage = page.locator(".modal-body p").first();
    this.continueShoppingBtn = page.getByRole("button", {
      name: "Continue Shopping",
    });
    this.cartLink = page.locator(".nav a[href*='/view_cart']");
  }

  async openProductsPage() {
    await this.page.goto("https://automationexercise.com/");
    await this.productLink.click();
  }

  async addProductToCart(productNames) {
    console.log("Total count of products: ", await this.allProducts.count());
    const product = this.allProducts.filter({ hasText: productNames });
    const count = await product.count();
    if (count === 0) {
      throw new Error(`Product "${productNames}" not found.`);
    } else if (count > 1) {
      throw new Error(`Multiple products found with name "${productNames}".`);
    } else {
      console.log(`Found product: ${productNames}`);
    }
    await product.hover();
    await product.locator("a:has-text('Add to cart')").first().click();
    const message = await this.modalMessage.textContent();
    await this.continueShoppingBtn.click();

    return message.trim();
  }

  async navigateToCart() {
    await this.cartLink.click();
    await this.page.waitForURL(/.*view_cart/);
  }
}
module.exports = { Products };

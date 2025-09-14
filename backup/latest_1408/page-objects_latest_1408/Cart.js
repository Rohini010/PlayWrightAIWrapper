const { AIWrapper } = require("../utils/AIWrapper");

class Cart {
  constructor(page) {
    this.page = page;
    this.ai = new AIWrapper(page);
  }

  async verifyProductInCart(productName) {
    await this.page.locator(".table-condensed tbody tr").first().waitFor();

    const cartProductNames = await this.page
      .locator(".table-condensed tbody tr td h4")
      .allTextContents();

    const matchedProduct = cartProductNames.find(
      (name) => name.trim().toLowerCase() === productName.toLowerCase()
    );

    if (matchedProduct) {
      console.log("Matched product in cart:", matchedProduct.trim());
      return true;
    } else {
      console.log("Product not found in cart.");
      return false;
    }
  }
}

module.exports = { Cart };

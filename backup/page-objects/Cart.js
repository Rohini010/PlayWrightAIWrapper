class Cart {
  constructor(page) {
    this.page = page;

    this.cartTable = page.locator(".table-condensed tbody tr");
    this.cartProductName = page.locator(".table-condensed tbody tr td h4");
  }

  async verifyProductInCart(productName) {
    await this.cartTable.first().waitFor();
    const cartProductNames = await this.cartProductName.allTextContents();
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

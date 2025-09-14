const { expect } = require("@playwright/test");

class Checkout {
  constructor(page) {
    this.page = page;
    this.checkoutButton = page.locator("a.check_out");
    this.checkoutProductNames = page.locator(
      ".table-condensed tbody tr td h4 a"
    );
    this.confirmOrderButton = page.locator(".col-md-12 button[type='submit']");
    this.logoutLink = page.locator("a[href*='logout']");
  }

  async proceedToCheckout(expectedProductName) {
    await this.checkoutButton.click();
    await this.page.waitForURL(/.*checkout/);

    const productNames = await this.checkoutProductNames.allTextContents();
    expect(productNames).toContain(expectedProductName);

    await this.page.locator("#ordermsg textarea").fill("automating exercise");
    await this.checkoutButton.click();
    await this.page
      .locator("input[name='name_on_card']")
      .waitFor({ state: "visible" });

    await this.page
      .locator("input[name='name_on_card']")
      .fill("Rohini Shilimkar");
    await this.page
      .locator("input[name='card_number']")
      .fill("4111111111111111");
    await this.page.locator("input[name='cvc']").fill("123");
    await this.page.locator("input[name='expiry_month']").fill("12");
    await this.page.locator("input[name='expiry_year']").fill("2027");
  }
  async confirmOrder(expectedMessage) {
    await this.confirmOrderButton.waitFor({ state: "visible" });

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "domcontentloaded" }), // or 'load'
      this.confirmOrderButton.click(),
    ]);
    await this.page.waitForURL(/.*payment_done/);
    const confirmationMessage = await this.page
      .locator(".text-center")
      .textContent();
    expect(confirmationMessage).toContain(expectedMessage);
  }
  async logoutAfterOrder() {
    await this.logoutLink.waitFor({ state: "visible" });
    await this.logoutLink.click();
    await this.page.waitForURL(/.*login/);
  }
}

module.exports = { Checkout };

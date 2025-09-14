const { expect } = require("@playwright/test");
const { AIWrapper } = require("../utils/AIWrapper");

class Checkout {
  constructor(page) {
    this.page = page;
    this.ai = new AIWrapper(page);
  }

  async proceedToCheckout(expectedProductName) {
    await this.ai.smartClick({
      css: "a.check_out",
      text: "Proceed To Checkout",
      role: "link",
      xpath: "//a[contains(@class, 'check_out')]",
    });

    await this.page.waitForURL(/.*checkout/);

    const productNames = await this.page
      .locator(".table-condensed tbody tr td h4 a")
      .allTextContents();
    expect(productNames).toContain(expectedProductName);

    await this.ai.smartFill(
      {
        css: "#ordermsg textarea",
        xpath: "//textarea[@id='ordermsg']",
      },
      "automating exercise"
    );

    await this.ai.smartClick({
      css: "a.check_out",
      text: "Place Order",
      role: "link",
      xpath: "//a[contains(@class, 'check_out')]",
    });

    await this.page
      .locator("input[name='name_on_card']")
      .waitFor({ state: "visible" });

    await this.ai.smartFill(
      { css: "input[name='name_on_card']" },
      "Rohini Shilimkar"
    );
    await this.ai.smartFill(
      { css: "input[name='card_number']" },
      "4111111111111111"
    );
    await this.ai.smartFill({ css: "input[name='cvc']" }, "123");
    await this.ai.smartFill({ css: "input[name='expiry_month']" }, "12");
    await this.ai.smartFill({ css: "input[name='expiry_year']" }, "2027");
  }

  async confirmOrder(expectedMessage) {
    await this.page
      .locator(".col-md-12 button[type='submit']")
      .waitFor({ state: "visible" });

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      this.ai.smartClick({
        css: ".col-md-12 button[type='submit']",
        text: "Confirm",
        role: "button",
        xpath: "//button[contains(text(),'Confirm')]",
      }),
    ]);

    await this.page.waitForURL(/.*payment_done/);
    const confirmationMessage = await this.page
      .locator(".text-center")
      .textContent();
    expect(confirmationMessage).toContain(expectedMessage);
  }

  async logoutAfterOrder() {
    await this.ai.smartClick({
      css: "a[href*='logout']",
      text: "Logout",
      role: "link",
      xpath: "//a[contains(@href,'logout')]",
    });

    await this.page.waitForURL(/.*login/);
  }
}

module.exports = { Checkout };

const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const testData = require("../test-data/userData");

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);

    this.locators = {
      placeOrderBtn: {
        css: "a.check_out",
        xpath: "//a[contains(text(),'Placerder')]",
        text: "Place Order",
        role: "link",
      },
      orderMsg: {
        css: "#ordermsg textarea",
        xpath: "//textarea[@id='ordermsg']",
      },
      productNames: {
        css: ".table-condensed tbody tr td h4 a",
        xpath: "//table[contains(@class,'table-condensed')]//h4/a",
      },
      nameOnCard: {
        css: "input[name='name_on_card']",
        xpath: "//input[@name='name_on_card']",
      },
      cardNumber: {
        css: "input[name='card_number']",
        xpath: "//input[@name='card_number']",
      },
      cvc: { css: "input[name='cvc']", xpath: "//input[@name='cvc']" },
      expiryMonth: {
        css: "input[name='expiry_month']",
        xpath: "//input[@name='expiry_month']",
      },
      expiryYear: {
        css: "input[name='expiry_year']",
        xpath: "//input[@name='expiry_year']",
      },
      confirmBtn: {
        css: ".col-md-12 button[type='submit']",
        xpath: "//button[contains(text(),'Confirm')]",
        text: "Confirm",
        role: "button",
      },
      logoutLink: {
        css: "a[href*='logout']",
        xpath: "//a[contains(@href,'logout')]",
        text: "Logout",
        role: "link",
      },
      confirmationMessage: {
        css: ".text-center",
        xpath: "//div[@class='text-center']",
      },
    };
  }

  async verifyProductsInCheckout(
    expectedProducts = [testData.checkoutProductName]
  ) {
    const productNames = await this.page
      .locator(this.locators.productNames.css)
      .allTextContents();
    const trimmed = productNames.map((n) => n.trim());
    for (const product of expectedProducts) {
      expect(trimmed).toContain(product);
      console.log(`Verified product in checkout: ${product}`);
    }
  }

  async enterOrderMessage(message = "Automating exercise") {
    await this.fill(this.locators.orderMsg, message, "Order message");
  }

  // CheckoutPage.js
  async placeOrder() {
    console.log("Clicking Place Order...");
    const placeOrderLocator = await this.getLocator(
      this.locators.placeOrderBtn,
      "Place Order"
    );

    // Click without waiting for navigation
    await placeOrderLocator.click();
    console.log("Place Order clicked. Waiting for payment section...");

    // Wait for Name on Card input to appear
    await this.waitForVisible(this.locators.nameOnCard, "Name on Card");
    console.log("Payment section is now visible.");
  }

  async fillPaymentDetails(payment = testData.payment) {
    await this.fill(this.locators.nameOnCard, payment.name, "Name on Card");
    await this.fill(this.locators.cardNumber, payment.number, "Card Number");
    await this.fill(this.locators.cvc, payment.cvc, "CVC");
    await this.fill(this.locators.expiryMonth, payment.month, "Expiry Month");
    await this.fill(this.locators.expiryYear, payment.year, "Expiry Year");
    console.log("Payment details entered successfully");
  }

  async confirmOrder(expectedMessage = testData.messages.orderSuccess) {
    await this.waitForVisible(this.locators.confirmBtn);
    await this.click(this.locators.confirmBtn, "Confirm Order");

    // Wait for confirmation message or URL update
    await this.waitForVisible(
      this.locators.confirmationMessage,
      "Confirmation message"
    );
    const confirmationMessage = await this.getText(
      this.locators.confirmationMessage,
      "Confirmation message"
    );

    expect(confirmationMessage).toContain(expectedMessage);
    console.log(`Order confirmed with message: "${expectedMessage}"`);
  }
}

module.exports = { CheckoutPage };

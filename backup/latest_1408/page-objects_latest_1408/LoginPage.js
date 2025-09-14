const { AIWrapper } = require("../utils/AIWrapper");

class LoginPage {
  constructor(page) {
    this.page = page;
    this.ai = new AIWrapper(page);
  }

  async open() {
    await this.page.goto("https://automationexercise.com/login");
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForURL(/.*\/login/);
  }

  async validLogin(emailValue, passwordValue) {
    await this.ai.smartFill(
      {
        css: ".login-form input[type='email']",
        xpath: "//input[@placeholder='Email Address']",
      },
      emailValue
    );

    await this.ai.smartFill(
      {
        css: ".login-form input[type='password']",
        xpath: "//input[@placeholder='Password']",
      },
      passwordValue
    );

    await this.ai.smartClick({
      css: ".login-form button[type='submit']",
      text: "Login",
      role: "button",
      xpath: "//button[contains(text(),'Login')]",
    });

    await this.page.locator("a[href='/logout']").waitFor({ state: "visible" });
  }
}

module.exports = { LoginPage };

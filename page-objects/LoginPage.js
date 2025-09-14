const { BasePage } = require("./BasePage");
const testData = require("../test-data/userData");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.locators = {
      emailInput: {
        css: ".login-form input[type='email']",
        xpath: "//input[@placeholder='Email Address']",
      },
      passwordInput: {
        css: ".login-form input[type='password']",
        xpath: "//input[@placeholder='Password']",
      },
      submitBtn: {
        css: ".login-form button[type='submit']",
        xpath: "//button[contains(text(),'Login')]",
        text: "Login",
        role: "button",
      },
      logoutLink: {
        css: "a[href='/logout']",
        xpath: "//a[@href='/logout']",
        text: "Logout",
      },
      errorMessage: {
        css: "form[action='/login'] p",
        xpath: "//p[contains(text(),'Your email or password is incorrect!')]",
      },
    };
  }

  get errorMessage() {
    return this.getLocator(this.locators.errorMessage);
  }

  async open() {
    await this.page.goto("https://automationexercise.com/login");
    await this.waitForUrl(/.*\/login/);
  }

  async validLogin() {
    await this.fill(
      this.locators.emailInput,
      testData.validuser.email,
      "Email"
    );
    await this.fill(
      this.locators.passwordInput,
      testData.validuser.password,
      "Password"
    );
    await this.click(this.locators.submitBtn, "Login Button");
  }

  async invalidLogin() {
    await this.fill(
      this.locators.emailInput,
      testData.invaliduser.email,
      "Email"
    );
    await this.fill(
      this.locators.passwordInput,
      testData.invaliduser.password,
      "Password"
    );
    await this.click(this.locators.submitBtn, "Login Button");
  }

  async logout() {
    await this.click(this.locators.logoutLink, "Logout");
    await this.waitForUrl(/.*login/);
    console.log("Logged out after order");
  }
}

module.exports = { LoginPage };

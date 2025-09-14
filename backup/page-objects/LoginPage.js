class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.locator(".login-form input[placeholder='Email Address']");
    this.password = page.locator(".login-form input[placeholder='Password']");
    this.loginButton = page.locator(".login-form button[type='submit']");
    this.logoutLink = page.locator("a[href='/logout']");
  }

  async open() {
    await this.page.goto("https://automationexercise.com/login");
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForURL(/.*\/login/);
  }

  async validLogin(emailValue, passwordValue) {
    await this.email.fill(emailValue);
    await this.password.fill(passwordValue);
    await this.loginButton.click();
    await this.page.waitForLoadState("networkidle");
    await this.logoutLink.waitFor({ state: "visible" });
  }

  async logout() {}
}

module.exports = { LoginPage };

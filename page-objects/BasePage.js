// page-objects/BasePage.js
const AIWrapper = require("../utils/AIWrapper");
const fs = require("fs");

class BasePage {
  constructor(page) {
    this.page = page;
    this.ai = new AIWrapper(page);
    this.locatorFile = "./locators.json";
    this._locatorCache = this.loadCacheFromFile();
  }

  loadCacheFromFile() {
    try {
      return JSON.parse(fs.readFileSync(this.locatorFile, "utf-8"));
    } catch {
      return {};
    }
  }

  saveCacheToFile() {
    fs.writeFileSync(
      this.locatorFile,
      JSON.stringify(this._locatorCache, null, 2)
    );
  }

  /**
   * Get a working locator with cache + retry fallback
   * @param {Object} locatorInfo
   * @param {string} elementName
   */
  async getLocator(locatorInfo, elementName = "element") {
    let locator;

    // 1. Try cached locator first
    if (this._locatorCache[elementName]) {
      locator = this.page.locator(this._locatorCache[elementName]);
      if ((await locator.count()) > 0) {
        console.log(`[Cache Hit] Using cached locator for "${elementName}"`);
        return locator;
      } else {
        console.warn(
          `[Cache Stale] Cached locator for "${elementName}". Retrying fresh lookup...`
        );
      }
    }

    // 2. Fallback → AIWrapper decides best selector (css, xpath, text, role)
    locator = await this.ai.findWorkingLocator(locatorInfo, elementName, true);

    if (!locator) {
      throw new Error(`No locator found for "${elementName}" after retry`);
    }

    // 3. Extract Playwright selector string safely
    const selectorString =
      locatorInfo.css ||
      locatorInfo.xpath ||
      locatorInfo.text ||
      locatorInfo.role ||
      locator._selector; // fallback if AIWrapper attaches it

    if (selectorString) {
      this._locatorCache[elementName] = selectorString;
      this.saveCacheToFile();
      console.log(
        `[Cache Update] Saved locator for "${elementName}": ${selectorString}`
      );
    } else {
      console.warn(`[Cache Skip] Could not save locator for "${elementName}"`);
    }

    return locator;
  }

  async click(locatorInfo, elementName = "element") {
    const locator = await this.getLocator(locatorInfo, elementName);
    await locator.click();
    console.log(`${elementName} clicked successfully`);
  }

  async fill(locatorInfo, value, elementName = "element") {
    const locator = await this.getLocator(locatorInfo, elementName);
    await locator.fill(value);
    console.log(`${elementName} filled with value: ${value}`);
  }

  async waitForVisible(locatorInfo, elementName = "element") {
    const locator = await this.getLocator(locatorInfo, elementName);
    await locator.waitFor({ state: "visible" });
    console.log(`${elementName} is visible`);
  }
  async waitForUrl(urlPattern, timeout = 5000) {
    await this.page.waitForURL(urlPattern, { timeout });
    console.log(`[Navigation] URL matched pattern: ${urlPattern}`);
  }
  async navigate(url) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    console.log(`[Navigation] Navigated to: ${url}`);
  }
  async getText(locatorInfo, elementName = "element") {
    const locator = await this.ai.findWorkingLocator(locatorInfo, elementName);
    await locator.waitFor({ state: "visible", timeout: 5000 });
    const text = await locator.textContent();
    console.log(`[Text Retrieved] ${elementName}: ${text?.trim()}`);
    return text?.trim();
  }
}

module.exports = { BasePage };

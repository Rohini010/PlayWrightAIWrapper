const AIWrapper = require("../utils/AIWrapper");
const { DEFAULT_TIMEOUT } = require("../constants");

class BasePage {
  constructor(page) {
    this.page = page;
    this.ai = new AIWrapper(page);
    this._locatorCache = {}; // Cache for repeated locators
  }

  /**
   * Get a working locator (supports fuzzy search, caching)
   * @param {Object} locatorInfo
   * @param {string} elementName
   * @param {boolean} useFuzzy
   */
  async getLocator(locatorInfo, elementName = "element", useFuzzy = true) {
    const cacheKey = elementName + (locatorInfo.text || locatorInfo.css || "");
    if (this._locatorCache[cacheKey]) return this._locatorCache[cacheKey];

    // Optionally disable fuzzy
    if (!useFuzzy) locatorInfo.fuzzyThreshold = 0;

    const locator = await this.ai.findWorkingLocator(locatorInfo, elementName);

    // 🔹 Unified logging: Always show correct type
    let type = "unknown";
    if (locator._isFuzzy) type = "fuzzy-text (fuzzy match applied)";
    else if (locator._usedLocatorType) type = locator._usedLocatorType;

    console.log(`[Locator Used] "${elementName}" -> ${type}`);

    // Cache the locator for future use
    this._locatorCache[cacheKey] = locator;
    return locator;
  }

  async click(locatorInfo, elementName = "element", useFuzzy = true) {
    try {
      const locator = await this.getLocator(locatorInfo, elementName, useFuzzy);
      console.log(`Click action performed on "${elementName}"`);
      await locator.click();
    } catch (err) {
      console.error(`Click failed on "${elementName}": ${err.message}`);
      throw err;
    }
  }

  async fill(locatorInfo, value, elementName = "input field", useFuzzy = true) {
    try {
      const locator = await this.getLocator(locatorInfo, elementName, useFuzzy);
      console.log(`Filled "${elementName}" with "${value}"`);
      await locator.fill(value);
    } catch (err) {
      console.error(`Fill failed on "${elementName}": ${err.message}`);
      throw err;
    }
  }

  async getText(locatorInfo, elementName = "element", useFuzzy = true) {
    try {
      const locator = await this.getLocator(locatorInfo, elementName, useFuzzy);
      const text = await locator.textContent();
      console.log(`Got text from "${elementName}": "${text}"`);
      return text;
    } catch (err) {
      console.error(`GetText failed on "${elementName}": ${err.message}`);
      throw err;
    }
  }

  async waitForUrl(urlPattern, timeout = 5000) {
    await this.page.waitForURL(urlPattern, { timeout });
  }
  async navigate(url) {
    await this.page.goto(url);
  }
  async waitForVisible(locatorInfo, elementName = "element") {
    const locator = await this.getLocator(locatorInfo, elementName);

    // Wait for the element to appear in DOM and be visible
    await locator.waitFor({ state: "visible", timeout: 15000 });
    console.log(`Element visible: ${elementName}`);
  }
}

module.exports = { BasePage };

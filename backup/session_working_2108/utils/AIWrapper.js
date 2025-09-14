const fs = require("fs");
const path = require("path");

class AIWrapper {
  constructor(page) {
    this.page = page;
    this.cache = {}; // memory of healed selectors
  }

  /**
   * Smart Click with healing
   */
  async smartClick(locatorInfo, elementName = "element") {
    try {
      await this._find(locatorInfo).click({ timeout: 3000 });
      console.log(`[AIWrapper] Clicked ${elementName} (strict)`);
      return;
    } catch {}

    if (this.cache[elementName]) {
      try {
        await this.page.locator(this.cache[elementName]).first().click();
        console.log(`[AIWrapper] Clicked ${elementName} using cached selector`);
        return;
      } catch {}
    }

    if (locatorInfo.css || locatorInfo.xpath) {
      try {
        if (locatorInfo.css) {
          await this.page.locator(locatorInfo.css).first().click();
          console.log(`[AIWrapper] Click fallback CSS for ${elementName}`);
          return;
        }
      } catch {}
      try {
        if (locatorInfo.xpath) {
          await this.page.locator(locatorInfo.xpath).first().click();
          console.log(`[AIWrapper] Click fallback XPath for ${elementName}`);
          return;
        }
      } catch {}
    }

    if (locatorInfo.role && locatorInfo.text) {
      try {
        await this.page
          .getByRole(locatorInfo.role, { name: locatorInfo.text })
          .first()
          .click();
        console.log(`[AIWrapper] Click fallback role+text for ${elementName}`);
        return;
      } catch {}
    }

    await this._handleFailure(elementName, "click");
  }

  /**
   *  Smart Fill with healing
   */
  async smartFill(locatorInfo, value, elementName = "input field") {
    try {
      await this._find(locatorInfo).fill(value, { timeout: 3000 });
      console.log(`[AIWrapper] Filled ${elementName} with: ${value}`);
      return;
    } catch {}

    if (locatorInfo.css || locatorInfo.xpath) {
      try {
        if (locatorInfo.css) {
          await this.page.locator(locatorInfo.css).first().fill(value);
          console.log(`[AIWrapper] Fill fallback CSS for ${elementName}`);
          return;
        }
      } catch {}
      try {
        if (locatorInfo.xpath) {
          await this.page.locator(locatorInfo.xpath).first().fill(value);
          console.log(`[AIWrapper] Fill fallback XPath for ${elementName}`);
          return;
        }
      } catch {}
    }

    await this._handleFailure(elementName, "fill");
  }

  /**
   * Smart TextContent with healing
   */
  async smartTextContent(locatorInfo, elementName = "element") {
    try {
      const text = await this._find(locatorInfo)
        .first()
        .textContent({ timeout: 3000 });
      console.log(`[AIWrapper] Got text from ${elementName}: ${text}`);
      return text?.trim();
    } catch {}

    if (locatorInfo.css || locatorInfo.xpath) {
      try {
        if (locatorInfo.css) {
          const text = await this.page
            .locator(locatorInfo.css)
            .first()
            .textContent();
          console.log(
            `[AIWrapper] Text fallback CSS for ${elementName}: ${text}`
          );
          return text?.trim();
        }
      } catch {}
      try {
        if (locatorInfo.xpath) {
          const text = await this.page
            .locator(locatorInfo.xpath)
            .first()
            .textContent();
          console.log(
            `[AIWrapper] Text fallback XPath for ${elementName}: ${text}`
          );
          return text?.trim();
        }
      } catch {}
    }

    await this._handleFailure(elementName, "textContent");
  }

  /**
   * Core locator finder
   */
  _find(locatorInfo) {
    if (locatorInfo.css) return this.page.locator(locatorInfo.css);
    if (locatorInfo.xpath) return this.page.locator(locatorInfo.xpath);
    if (locatorInfo.text) return this.page.getByText(locatorInfo.text);
    if (locatorInfo.role)
      return this.page.getByRole(locatorInfo.role, { name: locatorInfo.text });
    throw new Error("No valid locator strategy provided");
  }

  /**
   * Failure handler with screenshot
   */
  async _handleFailure(elementName, action) {
    const errorsDir = path.resolve("errors");
    if (!fs.existsSync(errorsDir)) {
      fs.mkdirSync(errorsDir, { recursive: true });
    }

    const filePath = path.join(errorsDir, `${elementName}-${action}-fail.png`);
    if (!this.page.isClosed()) {
      await this.page.screenshot({ path: filePath, fullPage: true });
      console.error(`[AIWrapper] Screenshot saved at: ${filePath}`);
    }

    console.error(
      `[AIWrapper] All strategies failed for ${action} on ${elementName}`
    );
    throw new Error(`AIWrapper failed to ${action} ${elementName}`);
  }
}

module.exports = { AIWrapper };

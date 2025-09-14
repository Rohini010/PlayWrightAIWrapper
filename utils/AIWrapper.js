const {
  DEFAULT_TIMEOUT,
  ENABLE_FUZZY,
  FUZZY_THRESHOLD,
} = require("../constants");

class AIWrapper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Main method to find a working locator
   * @param {Object} locatorInfo - {css, xpath, text, role, fuzzyThreshold}
   * @param {string} elementName - friendly name for logging
   */
  async findWorkingLocator(locatorInfo, elementName = "element") {
    const strategies = ["css", "xpath", "role", "text"];

    // Try standard locators first
    for (const key of strategies) {
      if (!locatorInfo[key]) continue;

      let locator;
      try {
        switch (key) {
          case "css":
            locator = this.page.locator(locatorInfo.css);
            break;
          case "xpath":
            locator = this.page.locator(locatorInfo.xpath);
            break;
          case "role":
            locator = this.page.getByRole(locatorInfo.role, {
              name: locatorInfo.text,
            });
            break;
          case "text":
            locator = this.page.getByText(locatorInfo.text);
            break;
        }

        const count = await locator.count();
        if (count > 0) {
          const firstLocator = locator.first(); // fix: apply type to returned locator
          firstLocator._usedLocatorType = key;
          firstLocator._isFuzzy = false;
          console.log(`[Locator Found] "${elementName}" using ${key} locator`);
          return firstLocator;
        }
      } catch (err) {
        // ignore missing locator errors
      }
    }

    //  Fuzzy search fallback
    if (!ENABLE_FUZZY || !locatorInfo.text) {
      throw new Error(`No locator found for "${elementName}"`);
    }

    const threshold = locatorInfo.fuzzyThreshold || FUZZY_THRESHOLD;
    const allElements = this.page.locator("a, button, span, div");
    const count = await allElements.count();
    let candidates = [];
    const seenTexts = new Set();

    for (let i = 0; i < count; i++) {
      try {
        const el = allElements.nth(i);
        if (!(await el.isVisible())) continue;

        const elText = (await el.textContent())?.trim();
        if (!elText || seenTexts.has(elText)) continue;
        seenTexts.add(elText);

        if (Math.abs(elText.length - locatorInfo.text.length) > 15) continue;

        const similarity = this.similarity(elText, locatorInfo.text);

        // fuzzy comparison log
        // console.log(`[Fuzzy Candidate] "${elText}" | Target: "${locatorInfo.text}" | Similarity: ${similarity.toFixed(3)}`);

        candidates.push({ text: elText, similarity, index: i });
      } catch (err) {
        // ignore errors
      }
    }

    // pick top candidate if above threshold
    candidates.sort((a, b) => b.similarity - a.similarity);
    if (candidates.length > 0 && candidates[0].similarity >= threshold) {
      const locator = allElements.nth(candidates[0].index);
      locator._usedLocatorType = "fuzzy-text";
      locator._isFuzzy = true;
      console.log(
        `[Fuzzy Match] "${
          candidates[0].text
        }" selected for "${elementName}" with similarity ${candidates[0].similarity.toFixed(
          3
        )}`
      );
      return locator;
    }

    throw new Error(`No locator found for "${elementName}"`);
  }

  similarity(a, b) {
    if (!a || !b) return 0;
    let longer = a.length > b.length ? a : b;
    let shorter = a.length > b.length ? b : a;
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    const distance = this.levenshtein(longer, shorter);
    return (longerLength - distance) / longerLength;
  }

  levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] =
          b[i - 1] === a[j - 1]
            ? matrix[i - 1][j - 1]
            : Math.min(
                matrix[i - 1][j - 1] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j] + 1
              );
      }
    }
    return matrix[b.length][a.length];
  }
}

module.exports = AIWrapper;

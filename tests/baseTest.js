// fixtures/baseTest.js
const { test: base } = require("@playwright/test");
const path = require("path");

const authFile = path.join(__dirname, "../auth.json");

exports.test = base.extend({
  storageState: authFile, //save session
});

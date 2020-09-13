const base = require("../../jest.config");
const package = require("./package.json");

module.exports = {
    ...base,
    displayName: package.name,
    name: package.name,
    rootDir: "./",
    testMatch: [`**/__tests__/*.+(ts|tsx|js)`]
};
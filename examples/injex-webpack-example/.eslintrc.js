const path = require("path");

module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:@typescript-eslint/recommended"
    ],
    parserOptions: {
        project: path.resolve(__dirname, "./tsconfig.json"),
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: "module",
    },
    rules: {
        "@typescript-eslint/interface-name-prefix": "false"
    }
};
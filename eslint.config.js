// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", ".storybook/*"],
    rules: {
      "no-unused-vars": ["error"], // Treat unused variables as errors
      "import/order": [
        "error",
        {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
          "alphabetize": { order: "asc", caseInsensitive: true }, // Sort imports alphabetically
        },
      ],
      "semi": ["error", "always"], // Enforce semicolons
      "no-trailing-spaces": ["error"], // Disallow trailing spaces
    },
  }
]);

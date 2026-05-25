import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-console": "warn", // Warns you if you leave console.logs in production
      "@typescript-eslint/no-explicit-any": "warn", // Discourages using 'any' types
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }] // Fails build if variables are unused, unless prefixed with _
    }
  },
  {
    // Tell ESLint to entirely ignore your production build and dependency files
    ignores: ["dist/", "node_modules/", "eslint.config.js"]
  }
);
import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "*.config.js",
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Possible Problems
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-undef": "error",
      "no-console": "warn",
      "no-debugger": "error",

      // Best Practices
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "warn",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-return-await": "warn",
      "require-await": "warn",
      "no-throw-literal": "error",

      // Code Style
      indent: ["error", 2, { SwitchCase: 1 }],
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "arrow-spacing": "error",
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "keyword-spacing": "error",
      "space-before-blocks": "error",
      "space-infix-ops": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],

      // ES6+
      "prefer-template": "warn",
      "prefer-destructuring": [
        "warn",
        {
          array: false,
          object: true,
        },
      ],
      "no-duplicate-imports": "error",
      "object-shorthand": ["warn", "always"],

      // Security
      "no-eval": "error",
      "no-new-func": "error",

      // Node.js specific
      "no-process-exit": "warn",
    },
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "no-console": "off",
    },
  },
];

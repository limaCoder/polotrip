module.exports = {
  env: {
    "browser": true,
    "es2021": true
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    "plugin:storybook/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: [
    "react",
    "react-hooks",
    "@typescript-eslint"
  ],
  globals: {
    JSX: true,
  },
  ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js", "**/*.css", "*.config.js", "*.mdx"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/function-component-definition": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react/jsx-no-constructed-context-values": "off",
    "react/jsx-props-no-spreading": "off",
    "import/prefer-default-export": "off",
    "no-shadow": "off",
    "prefer-promise-reject-errors": "off",
    "prettier/prettier": "error",
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [
          ".jsx",
          ".tsx"
        ]
      }
    ],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-empty-function": "warn"
  },
};
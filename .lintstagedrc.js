module.exports = {
  "apps/**/*.{js,ts,jsx,tsx}": [
    "eslint --fix"
  ],
  "packages/!(eslint-config|ts-config)/**/*.{js,ts,jsx,tsx}": [
    "eslint --fix"
  ],
  "*.json": [
    "prettier --write"
  ]
}

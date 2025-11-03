module.exports = {
  "apps/**/*.{js,ts,jsx,tsx}": [
    "pnpm dlx ultracite fix"
  ],
  "packages/!(ts-config)/**/*.{js,ts,jsx,tsx}": [
    "pnpm dlx ultracite fix"
  ],
  "*.json": [
    "prettier --write"
  ]
}

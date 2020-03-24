module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "prettier/prettier": [
      "error",
      {
        semi: false,
        trailingComma: "none",
        singleQuote: false
      }
    ]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
}

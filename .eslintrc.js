module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
    'no-trailing-spaces': 0, 
    camelcase: 2
  }
}

module.exports = {
  extends: 'standard',
  plugins: [
    'standard',
    'promise',
    'chai-friendly'
  ],
  rules: {
    'consistent-this': 2,
    "no-unused-expressions": 0,
    "chai-friendly/no-unused-expressions": 2
  },
  env: {
    browser: true,
    node: true,
    mocha: true
  }
}

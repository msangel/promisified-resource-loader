module.exports = {
  extends: 'standard',
  plugins: [
    'standard',
    'promise'
  ],
  rules: {
    'consistent-this': 2
  },
  env: {
    browser: true,
    node: true,
    mocha: true
  }
}

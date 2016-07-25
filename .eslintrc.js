module.exports = {
  'environment':   'mocha',
  'extends':       'eslint:recommended',
  'parserOptions': {
    'ecmaVersion':  6,
    'sourceType':   'module',
    'ecmaFeatures': {
      'modules': true
    }
  },
  'plugins':       ['mocha'],
  'rules':         {
    // enable additional rules
    'indent':          ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes':          ['error', 'single'],
    'semi':            ['error', 'never'],
    'prefer-const':    ['error'],

    // disable rules from base configurations
    'no-console': 'off'
  }
}

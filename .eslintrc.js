module.exports = {
  'environment':   'mocha, browser',
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
    'indent':                ['off', 2],
    'linebreak-style':       ['error', 'unix'],
    'quotes':                ['error', 'single'],
    'semi':                  ['error', 'never'],
    'prefer-const':          ['error'],
    'no-constant-condition': ['off'],
    'no-unused-vars':        ['error', {'varsIgnorePattern': '^_'}],

    // disable rules from base configurations
    'no-console': 'off'
  }
}

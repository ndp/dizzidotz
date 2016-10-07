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
    'camelcase':             ['error'],
    'complexity':            ['error', 11],
    'indent':                [0, 2],
    'linebreak-style':       ['error', 'unix'],
    'max-params':            ['error', 3],
    'new-cap':               [2],
    'no-confusing-arrow':    [0],
    'no-console':            [1],
    'no-constant-condition': ['off'],
    'no-duplicate-imports':  ['error'],
    'no-negated-condition':  ['error'],
    'no-useless-rename':     ['error'],
    'no-unused-vars':        ['error', {'varsIgnorePattern': '^_'}],
    'prefer-const':          ['error'],
    'prefer-rest-params':    ['error'],
    'prefer-spread':         ['error'],
    'quotes':                ['error', 'single'],
    'semi':                  ['error', 'never'],
  }
}

module.exports = {
  'extends':       'eslint:recommended',
  'parserOptions': {
    'ecmaVersion':  6,
    'sourceType':   'module',
    'ecmaFeatures': {
      'modules': true
    }
  },
  'plugins':       ['mocha', 'unused-imports'],
  'rules':         {
    'camelcase':             ['error'],
    'comma-dangle':          ['error', 'never'],
    'complexity':            ['error', 11],
    'indent':                [0, 2],
    'linebreak-style':       ['error', 'unix'],
    'max-params':            ['error', 3],
    'new-cap':               [2],
    'no-confusing-arrow':    [0],
    'no-console':            ['off'],
    'no-constant-condition': ['off'],
    'no-duplicate-imports':  ['error'],
    'no-negated-condition':  ['error'],
    'no-prototype-builtins': ['off'],
    'no-useless-rename':     ['error'],
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        'vars':              'all',
        'varsIgnorePattern': '^_',
        'args':              'after-used',
        'argsIgnorePattern': '^_'
      }
    ],
    'prefer-const':          ['error'],
    'prefer-rest-params':    ['error'],
    'prefer-spread':         ['error'],
    'quotes':                ['error', 'single'],
    'semi':                  ['error', 'never']
  }
}

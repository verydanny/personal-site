module.exports = {
  parserOptions: {
    ecmaVersion: '2018',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'inferno',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:inferno/recommended',
    'prettier',
  ],
  settings: {
    'inferno': {
      'createClass': 'createClass', // Regex for Component Factory to use,  default to 'createClass'
      'pragma': 'Inferno'  // Pragma to use, default to 'Inferno'
    },
    'propWrapperFunctions': [
        // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
        'forbidExtraProps',
        {'property': 'freeze', 'object': 'Object'},
        {'property': 'myFavoriteWrapper'}
    ],
    'linkComponents': [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      {'name': 'Link', 'linkAttribute': 'to'}
    ]
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  rules: {
    'prettier/prettier': ['error', {
      singleQuote: true,
      semi: false,
      bracketSpacing: true
    }]
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      plugins: [
        '@typescript-eslint',
      ],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      rules: {
        
      },
    }
  ]
}

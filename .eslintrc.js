module.exports = {
  parserOptions: {
    ecmaVersion: '2018',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  settings: {
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
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-unused-vars': [1, {
          varsIgnorePattern: '^_'
        }]
      },
    }
  ]
}

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist/', 'node_modules/', '.next/', '.turbo/', 'infra/cdk/cdk.out/'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {},
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parserOptions: { tsconfigRootDir: __dirname }
    }
  ]
}



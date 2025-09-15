// Flat config for ESLint (modern format)
module.exports = [
  // Ignore generated/build folders
  {
    ignores: ['dist/', 'node_modules/', '.next/', '.turbo/', 'infra/cdk/cdk.out/'],
  },

  // TypeScript rules for all TS/TSX files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // add project-specific rules here if needed
    },
  },
];



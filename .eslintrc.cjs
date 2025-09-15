module.exports = {
  root: true,
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
      parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname }
    }
  ]
}

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "simple-import-sort", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.base.json"]
  },
  settings: {
    "import/resolver": {
      typescript: true,
      node: true
    }
  },
  rules: {
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "import/order": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/consistent-type-imports": "warn"
  },
  ignorePatterns: ["**/dist/**", "**/.next/**", "**/build/**"]
};

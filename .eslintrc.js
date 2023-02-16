module.exports = {
  root: true,
  extends: ['plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/naming-convention': 'warn',
    '@typescript-eslint/semi': 'warn',
    curly: 'warn',
    eqeqeq: 'warn',
    'no-throw-literal': 'warn',
    semi: 'off',
  },
  ignorePatterns: [
    'out',
    'dist',
    'node_modules',
    'package.json',
    'pnpm-lock.yaml',
    '**/*.md',
    '**/*.json',
  ],
};

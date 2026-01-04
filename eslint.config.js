import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Enforce 4 spaces indentation
      'indent': ['error', 4, { "SwitchCase": 1 }],
      // Enforce single quotes (Google style preference)
      'quotes': ['error', 'single', { "avoidEscape": true }],
      // Enforce semicolons
      'semi': ['error', 'always'],
      // Enforce trailing commas where valid in ES5 (objects, arrays, etc)
      'comma-dangle': ['error', 'only-multiline'],
      // Enforce spacing before blocks
      'space-before-blocks': 'error',
      // Enforce consistent spacing inside braces
      'object-curly-spacing': ['error', 'always'],
      // Require const if variable is not reassigned
      'prefer-const': 'error',
      // No unused variables (strict)
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
);

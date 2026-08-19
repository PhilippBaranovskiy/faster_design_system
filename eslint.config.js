import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'cypress/downloads', 'cypress/screenshots', 'cypress/videos'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['src/**/*.test.{ts,tsx}'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    files: ['cypress/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        Cypress: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        cy: 'readonly',
        describe: 'readonly',
        it: 'readonly',
      },
    },
  },
  prettier,
);

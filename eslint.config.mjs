import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default defineConfig([
  { ignores: ['**/dist/**', '**/node_modules/**'] },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-useless-escape': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    plugins: { '@stylistic/js': stylisticJs },
    rules: {
      '@stylistic/js/newline-per-chained-call': [
        'error',
        { ignoreChainWithDepth: 1 },
      ],
      indent: [
        'error',
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: 1,
          ArrayExpression: 1,
          ObjectExpression: 1,
          ImportDeclaration: 1,
          FunctionDeclaration: {
            parameters: 1,
          },
          offsetTernaryExpressions: true
        },
      ],
      '@stylistic/js/max-len': ['error', { code: 100 }],
      '@stylistic/js/semi': ['error', 'always'],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      js,
    },
    extends: ['js/recommended'],
  },
  tseslint.configs.recommended,
]);

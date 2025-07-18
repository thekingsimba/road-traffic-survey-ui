import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import tailwindcss from 'eslint-plugin-tailwindcss';
import reactA11Y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.vscode', 'eslint.config.js', 'postcss.config.js', 'tailwind.config.js', 'src/shared/api/types.ts'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': reactA11Y,
      tailwindcss,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactA11Y.configs.recommended.rules,
      ...react.configs.recommended.rules,
      semi: ["error", "always"],
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "no-console": ['warn', { 'allow': ['warn', 'error'] }],
      "no-mixed-spaces-and-tabs": 'error',
      'eol-last': ['error', 'always'],
      "no-multi-spaces": ["error"],
      'object-curly-spacing': ['error', 'always'],
      'react/jsx-boolean-value': 2,
      'react/jsx-closing-bracket-location': 2,
      'react/jsx-closing-tag-location': 0,
      'react/jsx-indent': ['error', 2],
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', disallowTypeAnnotations: false }],
      'react/jsx-equals-spacing': 2,
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'react/jsx-curly-spacing': ['error', { when: 'never' }],
      'react/jsx-handler-names': 2,
      'react/jsx-no-leaked-render': 2,
      'react/jsx-indent-props': ['error', { indentMode: 2, ignoreTernaryOperator: true }],
      'react/jsx-props-no-multi-spaces': 2,
      'react/jsx-wrap-multilines': 2,
      'react/self-closing-comp': 2,
      'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
      'react-hooks/rules-of-hooks': ['error'],
      'jsx-quotes': ['error', 'prefer-single'],
      'react/react-in-jsx-scope': 0,
      'tailwindcss/enforces-negative-arbitrary-values': 0,
      'tailwindcss/no-custom-classname': 0,
      'tailwindcss/classnames-order': ['error'],
      'tailwindcss/enforces-shorthand': ['error'],
      'tailwindcss/no-contradicting-classname': ['error'],
      'react/jsx-curly-brace-presence': [2, { props: 'never', children: 'never' }],
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "react/jsx-indent-props": [
        "error",
        {
          indentMode: 2,
          ignoreTernaryOperator: true,
        },
      ],
    },
  },
);

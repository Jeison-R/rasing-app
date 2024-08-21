const { resolve } = require('node:path')

const projectClient = resolve(__dirname, 'client/tsconfig.json')

module.exports = {
  root: true,
  plugins: ['prettier', 'import'],
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: [projectClient]
      }
    }
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        printWidth: 200,
        trailingComma: 'none',
        tabWidth: 2,
        semi: false,
        singleQuote: true,
        bracketSpacing: true,
        arrowParens: 'always',
        endOfLine: 'auto'
      }
    ],
    'import/no-default-export': 'off',
    'import/order': [
      'warn',
      {
        groups: ['type', 'builtin', 'object', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'external',
            position: 'after'
          }
        ],
        'newlines-between': 'always'
      }
    ],
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: '*', next: ['return', 'export'] },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'always', prev: 'if', next: '*' },
      { blankLine: 'always', prev: '*', next: 'function' },
      { blankLine: 'always', prev: 'function', next: '*' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: 'expression', next: ['const', 'let', 'var', 'function', 'block-like'] }
    ],
    'no-console': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        ignoreRestSiblings: false,
        argsIgnorePattern: '^_.*?$'
      }
    ],
    '@typescript-eslint/no-misused-promises': 'off'
  },
  overrides: [
    {
      files: ['client/**/*.{ts,tsx}'],
      extends: [require.resolve('@vercel/style-guide/eslint/typescript'), require.resolve('@vercel/style-guide/eslint/react'), require.resolve('@vercel/style-guide/eslint/next')],
      parserOptions: {
        project: projectClient
      },
      rules: {
        'prettier/prettier': [
          'warn',
          {
            printWidth: 200,
            trailingComma: 'none',
            tabWidth: 2,
            semi: false,
            singleQuote: true,
            bracketSpacing: true,
            arrowParens: 'always',
            endOfLine: 'auto',
            plugins: [require.resolve('prettier-plugin-tailwindcss')]
          }
        ],
        'react-hooks/exhaustive-deps': 'off',
        '@next/next/no-img-element': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'react/prop-types': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/self-closing-comp': 'warn',
        'no-html-link-for-pages': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'react/jsx-sort-props': [
          'warn',
          {
            callbacksLast: true,
            shorthandFirst: true,
            noSortAlphabetically: false,
            reservedFirst: true
          }
        ]
      }
    }
  ]
}

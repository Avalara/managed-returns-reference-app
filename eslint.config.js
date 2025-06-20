import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,jsx}'],
    ignores: [
      // Dependencies
      'node_modules/**',
      
      // Production builds
      'build/**',
      'dist/**',
      'out/**',
      
      // Environment variables
      '.env*',
      
      // IDE and editor files
      '.vscode/**',
      '.idea/**',
      '**/*.swp',
      '**/*.swo',
      '**/*~',
      
      // OS generated files
      '.DS_Store',
      '.DS_Store?',
      '._*',
      '.Spotlight-V100',
      '.Trashes',
      'ehthumbs.db',
      'Thumbs.db',
      
      // Logs
      'logs/**',
      '**/*.log',
      
      // Coverage directory
      'coverage/**',
      '**/*.lcov',
      '.nyc_output/**',
      
      // Cache directories
      '.npm/**',
      '.eslintcache',
      '.rpt2_cache/**',
      '.rts2_cache_*/**',
      '.cache/**',
      '.parcel-cache/**',
      
      // Build outputs
      '.next/**',
      '.nuxt/**',
      '.vuepress/dist/**',
      'storybook-static/**',
      
      // Temporary folders
      'tmp/**',
      'temp/**',
      
      // Public assets
      'public/**',
      'static/**',
      
      // Config files that might contain generated content
      '**/*.config.js'
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: '18.3' },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
    },
    rules: {
      // Base ESLint rules
      ...js.configs.recommended.rules,

      // React rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // React specific customizations
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'warn',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-unused-prop-types': 'warn',
      'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
      'react/jsx-equals-spacing': ['error', 'never'],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],

      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General formatting
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'es5',
          tabWidth: 2,
          printWidth: 80,
          semi: true,
          singleQuote: true,
          arrowParens: 'always',
        },
      ],

      // JavaScript best practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],
      'prefer-const': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],
      'max-len': [
        'warn',
        {
          code: 100,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
    },
  },
];

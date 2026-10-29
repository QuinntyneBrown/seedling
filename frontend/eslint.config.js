// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  {
    ignores: ['dist/**', 'coverage/**', '.angular/**', 'out-tsc/**', 'storybook-static/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      prettier,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Components alias inputs such as `title` so the class field doesn't
      // shadow a host/DOM name while templates keep the mock's attribute names.
      '@angular-eslint/no-input-rename': 'off',
      // `() => {}` is the idiomatic no-op default for ControlValueAccessor callbacks.
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: ['sl', 'app'], style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: ['sl', 'app'], style: 'kebab-case' },
      ],
    },
  },
  {
    // AGENTS.md: no single-file components. Every component's template and
    // styles live in their own files beside the class.
    files: ['projects/**/*.ts'],
    ignores: ['projects/perf-test/src/scenarios/**'],
    rules: {
      '@angular-eslint/use-component-view-encapsulation': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Decorator[expression.callee.name="Component"] Property[key.name="template"]',
          message:
            'Inline templates are forbidden (AGENTS.md). Put the template in <name>.html and use templateUrl.',
        },
        {
          selector: 'Decorator[expression.callee.name="Component"] Property[key.name="styles"]',
          message:
            'Inline styles are forbidden (AGENTS.md). Put the styles in <name>.scss and use styleUrl.',
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      // Test doubles routinely stub partial framework/service shapes.
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
  },
]);

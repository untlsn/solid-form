import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin'
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
	eslint.configs.recommended,
	...tsEslint.configs.recommended,
	{
		plugins: { '@stylistic': stylistic },
		rules: {
			'prefer-const': 1,
			'space-infix-ops': 1,
			'no-console': [1, { allow: ['warn', 'error'] }],
			'@typescript-eslint/no-unused-vars': 1,
			'@typescript-eslint/ban-types': 1,
			'@typescript-eslint/method-signature-style': 1,
			'@typescript-eslint/no-explicit-any': 0,
			'@typescript-eslint/no-non-null-assertion': 0,
			'@typescript-eslint/ban-ts-comment': 0,

			'@stylistic/semi': [1, 'always'],
			'@stylistic/no-multiple-empty-lines': [1, { max: 2, maxEOF: 0 }],
			'@stylistic/arrow-parens': [1, 'always'],
			'@stylistic/indent': [1, 'tab', { SwitchCase: 1 }],
			'@stylistic/comma-dangle': [1, 'always-multiline'],
			'@stylistic/quote-props': [1, 'as-needed'],
			'@stylistic/object-curly-spacing': [1, 'always'],
			'@stylistic/object-curly-newline': [1, { multiline: true, consistent: true }],
			'@stylistic/no-trailing-spaces': 1,
			'@stylistic/quotes': [1, 'single'],
			'@stylistic/key-spacing': [1, { align: 'value' }],
			'@stylistic/space-before-blocks': 1,
			'@stylistic/comma-spacing': 1,

			'@stylistic/jsx-max-props-per-line': [1, { maximum: 1, when: 'multiline' }],
			'@stylistic/jsx-closing-bracket-location': 1,
			'@stylistic/jsx-indent': [1, 'tab'],
			'@stylistic/jsx-first-prop-new-line': 1,
			'@stylistic/jsx-tag-spacing': 1,
			'@stylistic/jsx-quotes': 1,
		},
	},
);

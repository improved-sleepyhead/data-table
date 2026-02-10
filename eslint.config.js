import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import pluginReact from 'eslint-plugin-react'
import eslintConfigPrettier from 'eslint-config-prettier' // 1. Импортируем конфиг
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
	globalIgnores(['dist']),

	js.configs.recommended,
	pluginReact.configs.flat.recommended,

	{
		files: ['**/*.{js,jsx}'],
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh
		},
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
				sourceType: 'module'
			}
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true }
			],

			'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
			'react/react-in-jsx-scope': 'off'
		}
	},

	eslintConfigPrettier
])

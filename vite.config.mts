import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import NodeCGPlugin from 'vite-plugin-nodecg';
import checker from 'vite-plugin-checker';
import Components from 'unplugin-vue-components/vite';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
	plugins: [
		vue(),
		NodeCGPlugin({
			inputs: {
				'dashboard/*.ts': 'src/dashboard/template.html',
				'graphics/*.ts': 'src/graphics/template.html',
			},
		}),
		Components({
			resolvers: [
				VuetifyResolver(),
			],
			dts: false,
		}),
		checker({
			typescript: {
				tsconfigPath: './tsconfig.browser.json',
			},
		}),
		tsconfigPaths({
			projects: ['./tsconfig.browser.json'],
		}),
	],
	resolve: {
		alias: {
			vue: 'vue/dist/vue.esm.js',
			'@src': path.resolve(__dirname, 'src'),
			'@bundles': path.resolve(__dirname, 'nodecg/bundles'),
		},
	},
	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
	},
	build: {
		outDir: 'nodecg',
		emptyOutDir: false,
		sourcemap: true,
	},
});

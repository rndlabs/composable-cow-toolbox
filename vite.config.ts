import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
	plugins: [sveltekit(), basicSsl()],
	define: {
		// stupid shims that love to destroy your day
		'global.crypto': undefined,
		'process.env': {}
	},
	resolve: {
		alias: {
			// this is required for the browser build
			'node-fetch': 'cross-fetch'
		}
	}
});

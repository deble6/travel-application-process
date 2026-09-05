import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	esbuild: {
		jsx: 'automatic'
	},
	server: {
		open: '/'
	}
});

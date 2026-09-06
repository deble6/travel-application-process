/// <reference types="vitest/config" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
	plugins: [sveltekit()],
	esbuild: {
		jsx: 'automatic'
	},
	server: {
		open: '/'
	},
	resolve: {
		alias: {
			$lib: path.join(root, 'src/lib')
		}
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['src/test/setup.ts'],
		include: ['src/**/*.{test,spec}.{ts,tsx}'],
		restoreMocks: true,
		clearMocks: true
	}
});

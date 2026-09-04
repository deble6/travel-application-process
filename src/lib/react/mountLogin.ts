import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import type { SessionUser } from './types';

type AppProps = {
	user: SessionUser | null;
	form?: {
		message?: string;
		username?: string;
		role?: string;
	} | null;
};

export function mountApp(target: HTMLElement, props: AppProps) {
	const root = createRoot(target);
	root.render(createElement(App, props));
	return () => root.unmount();
}

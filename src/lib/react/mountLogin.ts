import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import LoginPage from './LoginPage';

type LoginPageProps = {
	user: {
		username: string;
		name: string;
		role: 'admin' | 'user';
	} | null;
	form?: {
		message?: string;
		username?: string;
		role?: string;
	} | null;
};

export function mountLogin(target: HTMLElement, props: LoginPageProps) {
	const root = createRoot(target);
	root.render(createElement(LoginPage, props));
	return () => root.unmount();
}

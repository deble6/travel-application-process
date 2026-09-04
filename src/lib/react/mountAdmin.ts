import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import AdminPage from './admin/AdminPage';
import type { SessionUser, TravelApplication } from './types';

type AdminProps = {
	user: SessionUser;
	applications: TravelApplication[];
	selectedId: string;
	form?: { message?: string; id?: string } | null;
};

export function mountAdmin(target: HTMLElement, props: AdminProps) {
	const root = createRoot(target);
	root.render(createElement(AdminPage, props));
	return () => root.unmount();
}

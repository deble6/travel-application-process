import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ApplyPage from './ApplyPage';
import type { FieldIssue, SessionUser, TravelDraft } from './types';

type ApplyProps = {
	user: SessionUser;
	draft: TravelDraft;
	submitted: boolean;
	focusField?: string;
	form?: { message?: string; issues?: FieldIssue[] } | null;
};

export function mountApply(target: HTMLElement, props: ApplyProps) {
	const root = createRoot(target);
	root.render(createElement(ApplyPage, props));
	return () => root.unmount();
}

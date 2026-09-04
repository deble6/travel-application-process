import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getApplication,
	listApplications,
	updateApplicationStatus
} from '$lib/server/applications';

function requireAdmin(locals: App.Locals) {
	if (!locals.user) redirect(303, '/');
	if (locals.user.role !== 'admin') {
		redirect(303, locals.user.role === 'user' ? '/apply' : '/');
	}
	return locals.user;
}

function detailUrl(id: string) {
	return `/admin?id=${encodeURIComponent(id)}`;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = requireAdmin(locals);
	const id = url.searchParams.get('id') ?? '';
	const selected = id ? getApplication(id) : undefined;

	return {
		user,
		applications: listApplications(),
		selectedId: selected?.id ?? ''
	};
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		redirect(303, '/');
	},

	approve: async ({ locals, request }) => {
		requireAdmin(locals);
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		const comment = String(data.get('comment') ?? '').trim() || '同意出差';
		const item = updateApplicationStatus(id, 'approved', comment);
		if (!item) return fail(404, { message: '申请不存在' });
		redirect(303, detailUrl(id));
	},

	reject: async ({ locals, request }) => {
		requireAdmin(locals);
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		const comment = String(data.get('comment') ?? '').trim();
		if (!id) return fail(400, { message: '申请不存在' });
		if (!comment) return fail(400, { message: '请填写驳回原因', id });
		const item = updateApplicationStatus(id, 'rejected', comment);
		if (!item) return fail(404, { message: '申请不存在' });
		redirect(303, detailUrl(id));
	},

	reopen: async ({ locals, request }) => {
		requireAdmin(locals);
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		const item = updateApplicationStatus(id, 'pending');
		if (!item) return fail(404, { message: '申请不存在' });
		redirect(303, detailUrl(id));
	}
};

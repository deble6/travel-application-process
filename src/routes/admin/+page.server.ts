import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	approveApplication,
	getApplication,
	listApplications,
	rejectApplication
} from '$lib/server/applications';
import { buildReport } from '$lib/react/admin/stats';
import { canApprove } from '$lib/react/types';

function requireStaff(locals: App.Locals) {
	if (!locals.user) redirect(303, '/');
	if (locals.user.role === 'user') redirect(303, '/apply');
	if (locals.user.role !== 'admin' && locals.user.role !== 'hr') redirect(303, '/');
	return locals.user;
}

function detailUrl(id: string) {
	return `/admin?id=${encodeURIComponent(id)}`;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = requireStaff(locals);
	const id = url.searchParams.get('id') ?? '';
	const selected = id ? getApplication(id) : undefined;
	const applications = listApplications();

	return {
		user,
		applications,
		selectedId: selected?.id ?? '',
		view: url.searchParams.get('view') === 'stats' ? 'stats' : 'list',
		mode: url.searchParams.get('mode') === 'approve' ? 'approve' : 'view',
		report: buildReport(applications)
	};
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		redirect(303, '/');
	},

	approve: async ({ locals, request }) => {
		const user = requireStaff(locals);
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		const current = getApplication(id);
		if (!current) return fail(404, { message: '申请不存在' });
		if (!canApprove(user.role, current.status)) {
			return fail(400, { message: '当前角色不能审批该申请' });
		}
		const comment =
			String(data.get('comment') ?? '').trim() || (user.role === 'hr' ? '人事同意' : '同意出差');
		approveApplication(id, user.role, comment);
		redirect(303, detailUrl(id));
	},

	reject: async ({ locals, request }) => {
		const user = requireStaff(locals);
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		const current = getApplication(id);
		if (!current) return fail(404, { message: '申请不存在' });
		if (!canApprove(user.role, current.status)) {
			return fail(400, { message: '当前角色不能审批该申请' });
		}
		const comment = String(data.get('comment') ?? '').trim();
		if (!comment) return fail(400, { message: '请填写驳回原因', id });
		rejectApplication(id, user.role, comment);
		redirect(303, detailUrl(id));
	}
};

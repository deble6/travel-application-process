import { fail, redirect } from '@sveltejs/kit';
import { USERS } from '$lib/server/users';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.user ?? null
	};
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = String(data.get('username') ?? '').trim();
		const password = String(data.get('password') ?? '');
		const role = String(data.get('role') ?? '');

		if (!username || !password || !role) {
			return fail(400, { message: '请填写账号、密码并选择角色', username, role });
		}

		if (role !== 'admin' && role !== 'user') {
			return fail(400, { message: '角色无效', username, role });
		}

		const user = USERS.find(
			(item) => item.username === username && item.password === password && item.role === role
		);

		if (!user) {
			return fail(401, { message: '账号、密码或角色不匹配', username, role });
		}

		cookies.set(
			'session',
			JSON.stringify({
				username: user.username,
				name: user.name,
				role: user.role
			}),
			{
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 8
			}
		);

		redirect(303, '/');
	},

	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		redirect(303, '/');
	}
};

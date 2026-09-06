export type Role = 'admin' | 'hr' | 'user';

export type User = {
	username: string;
	password: string;
	role: Role;
	name: string;
};

export const USERS: User[] = [
	{ username: 'admin', password: '123456', role: 'admin', name: '王管理' },
	{ username: 'hr', password: '123456', role: 'hr', name: '赵人事' },
	{ username: 'user', password: '123456', role: 'user', name: '李员工' }
];

export function authenticate(username: string, password: string, role: string) {
	if (!username || !password || !role) {
		return { ok: false as const, message: '请填写账号、密码并选择角色' };
	}

	if (role !== 'admin' && role !== 'hr' && role !== 'user') {
		return { ok: false as const, message: '角色无效' };
	}

	const user = USERS.find(
		(item) => item.username === username && item.password === password && item.role === role
	);

	if (!user) {
		return { ok: false as const, message: '账号、密码或角色不匹配' };
	}

	return { ok: true as const, user };
}

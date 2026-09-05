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

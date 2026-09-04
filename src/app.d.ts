declare global {
	namespace App {
		interface Locals {
			user?: {
				username: string;
				name: string;
				role: 'admin' | 'user';
			};
		}
	}
}

export {};

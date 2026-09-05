import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const raw = event.cookies.get('session');

	if (raw) {
		try {
			const user = JSON.parse(raw) as App.Locals['user'];
			if (
				user?.username &&
				(user.role === 'admin' || user.role === 'hr' || user.role === 'user')
			) {
				event.locals.user = user;
			}
		} catch {
			event.cookies.delete('session', { path: '/' });
		}
	}

	return resolve(event);
};

import type { SessionUser } from './types';
import LoginPage from './LoginPage';
import AdminPage from './admin/AdminPage';

type LoginForm = {
	message?: string;
	username?: string;
	role?: string;
};

type Props = {
	user: SessionUser | null;
	form?: LoginForm | null;
};

function LogoutButton() {
	return (
		<form method="POST" action="?/logout" data-sveltekit-reload="">
			<button className="btn secondary header-logout" type="submit">
				退出登录
			</button>
		</form>
	);
}

function AdminHome({ user }: { user: SessionUser }) {
	return (
		<div className="app-shell">
			<header className="topbar">
				<strong>差旅申请系统</strong>
				<div className="topbar-right">
					<span>
						{user.name} · 管理员
					</span>
					<LogoutButton />
				</div>
			</header>
			<main className="app-main">
				<AdminPage />
			</main>
		</div>
	);
}

export default function App({ user, form }: Props) {
	if (!user) {
		return <LoginPage form={form} />;
	}

	return <AdminHome user={user} />;
}

import type { SessionUser } from './types';
import LoginPage from './LoginPage';

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
				<div className="apply-card home-card">
					<h1>管理员工作台</h1>
					<p className="subtitle">审批功能下一步再做，当前仅支持用户发起申请。</p>
				</div>
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

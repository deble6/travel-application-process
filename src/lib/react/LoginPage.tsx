type Role = 'admin' | 'user';

type LoginForm = {
	message?: string;
	username?: string;
	role?: string;
};

type LoginPageProps = {
	user: {
		username: string;
		name: string;
		role: Role;
	} | null;
	form?: LoginForm | null;
};

const roleText: Record<Role, string> = {
	admin: '管理员',
	user: '用户'
};

export default function LoginPage({ user, form }: LoginPageProps) {
	if (user) {
		return (
			<div className="login-page">
				<form className="login-card welcome" method="POST" action="?/logout" data-sveltekit-reload="">
					<h1>登录成功</h1>
					<p>欢迎，{user.name}</p>
					<div className="badge">{roleText[user.role]}</div>
					<button className="secondary" type="submit">
						退出登录
					</button>
					<p className="hint">下一步会在这里继续做差旅申请流程。</p>
				</form>
			</div>
		);
	}

	const selectedRole = form?.role === 'user' ? 'user' : 'admin';

	return (
		<div className="login-page">
			<form className="login-card" method="POST" action="?/login" data-sveltekit-reload="">
				<h1>差旅申请系统</h1>
				<p className="subtitle">请选择角色后登录</p>

				{form?.message ? <p className="error">{form.message}</p> : null}

				<p className="role-label">登录身份</p>
				<div className="role-tabs">
					<label>
						<input type="radio" name="role" value="admin" defaultChecked={selectedRole === 'admin'} />
						管理员
					</label>
					<label>
						<input type="radio" name="role" value="user" defaultChecked={selectedRole === 'user'} />
						用户
					</label>
				</div>

				<label className="field">
					<span>账号</span>
					<input
						name="username"
						autoComplete="username"
						defaultValue={form?.username ?? ''}
						placeholder="请输入账号"
					/>
				</label>

				<label className="field">
					<span>密码</span>
					<input
						name="password"
						type="password"
						autoComplete="current-password"
						placeholder="请输入密码"
					/>
				</label>

				<button type="submit">登录</button>

				<p className="hint">
					演示账号：
					<br />
					管理员 admin / 123456
					<br />
					用户 user / 123456
				</p>
			</form>
		</div>
	);
}

type LoginForm = {
	message?: string;
	username?: string;
	role?: string;
};

export default function LoginPage({ form }: { form?: LoginForm | null }) {
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

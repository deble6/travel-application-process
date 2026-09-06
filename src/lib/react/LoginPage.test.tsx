import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
	it('提供管理员、人事、用户三种登录身份', () => {
		render(<LoginPage />);
		expect(screen.getByRole('radio', { name: '管理员' })).toBeChecked();
		expect(screen.getByRole('radio', { name: '人事' })).not.toBeChecked();
		expect(screen.getByRole('radio', { name: '用户' })).not.toBeChecked();
	});

	it('可以选择人事身份', async () => {
		const user = userEvent.setup();
		render(<LoginPage />);
		await user.click(screen.getByRole('radio', { name: '人事' }));
		expect(screen.getByRole('radio', { name: '人事' })).toBeChecked();
	});

	it('失败时回填账号、角色并显示错误', () => {
		render(<LoginPage form={{ message: '账号、密码或角色不匹配', username: 'user', role: 'user' }} />);
		expect(screen.getByText('账号、密码或角色不匹配')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('请输入账号')).toHaveValue('user');
		expect(screen.getByRole('radio', { name: '用户' })).toBeChecked();
	});
});

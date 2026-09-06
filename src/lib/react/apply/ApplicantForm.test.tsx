import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ApplicantForm from './ApplicantForm';
import { applicant } from '../../../test/fixtures';

describe('ApplicantForm', () => {
	it('提交空表单时拦截并显示校验错误', async () => {
		const user = userEvent.setup();
		render(
			<ApplicantForm
				value={{ name: '', department: '', phone: '', jobTitle: '' }}
				issues={[]}
			/>
		);

		await user.click(screen.getByRole('button', { name: '下一步' }));

		expect(screen.getByText('请填写姓名')).toBeInTheDocument();
		expect(screen.getByText('请选择部门')).toBeInTheDocument();
		expect(screen.getByText('请填写联系电话')).toBeInTheDocument();
		expect(screen.getByText('请填写职务')).toBeInTheDocument();
	});

	it('填写字段后清除对应错误', async () => {
		const user = userEvent.setup();
		render(
			<ApplicantForm
				value={{ name: '', department: '', phone: '', jobTitle: '' }}
				issues={[{ section: 'applicant', field: 'name', label: '姓名', message: '请填写姓名' }]}
			/>
		);

		expect(screen.getByText('请填写姓名')).toBeInTheDocument();
		await user.type(screen.getByPlaceholderText('请输入姓名'), '李员工');
		expect(screen.queryByText('请填写姓名')).not.toBeInTheDocument();
	});

	it('信息完整时允许提交', async () => {
		const user = userEvent.setup();
		render(<ApplicantForm value={applicant} issues={[]} />);
		const form = screen.getByRole('button', { name: '下一步' }).closest('form');
		expect(form).not.toBeNull();
		form?.addEventListener('submit', (event) => event.preventDefault());
		await user.click(screen.getByRole('button', { name: '下一步' }));
		expect(screen.queryByText('请填写姓名')).not.toBeInTheDocument();
	});
});

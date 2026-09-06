import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ContentForm from './ContentForm';
import { content } from '../../../test/fixtures';

describe('ContentForm', () => {
	it('提交空内容时拦截并显示校验错误', async () => {
		const user = userEvent.setup();
		render(
			<ContentForm
				value={{
					destination: '',
					startDate: '',
					endDate: '',
					tripType: '',
					purpose: '',
					budget: ''
				}}
				issues={[]}
			/>
		);

		await user.click(screen.getByRole('button', { name: '下一步' }));
		expect(screen.getByText('请填写目的地')).toBeInTheDocument();
		expect(screen.getByText('请选择出行类型')).toBeInTheDocument();
		expect(screen.getByText('请选择出发日期')).toBeInTheDocument();
		expect(screen.getByText('请填写出差事由')).toBeInTheDocument();
	});

	it('点上一步时不走内容校验', async () => {
		const user = userEvent.setup();
		render(
			<ContentForm
				value={{
					destination: '',
					startDate: '',
					endDate: '',
					tripType: '',
					purpose: '',
					budget: ''
				}}
				issues={[]}
			/>
		);

		const form = screen.getByRole('button', { name: '上一步' }).closest('form');
		form?.addEventListener('submit', (event) => event.preventDefault());
		await user.click(screen.getByRole('button', { name: '上一步' }));
		expect(screen.queryByText('请填写目的地')).not.toBeInTheDocument();
	});

	it('内容完整时允许提交', async () => {
		const user = userEvent.setup();
		render(<ContentForm value={content} issues={[]} />);
		const form = screen.getByRole('button', { name: '下一步' }).closest('form');
		form?.addEventListener('submit', (event) => event.preventDefault());
		await user.click(screen.getByRole('button', { name: '下一步' }));
		expect(screen.queryByText('请填写目的地')).not.toBeInTheDocument();
	});
});

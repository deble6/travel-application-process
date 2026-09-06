import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import AdminPage from './AdminPage';
import AdminDetail from './AdminDetail';
import ProcessHistory from './ProcessHistory';
import { buildReport } from './stats';
import { adminSession, hrSession, makeApplication } from '../../../test/fixtures';

const applications = [
	makeApplication({ id: 'hr-wait', status: 'pending_hr', content: { ...makeApplication().content, destination: '上海' } }),
	makeApplication({
		id: 'admin-wait',
		status: 'pending_admin',
		content: { ...makeApplication().content, destination: '广州' },
		hrComment: '人事同意',
		hrProcessedAt: '2026-09-06T03:00:00.000Z'
	}),
	makeApplication({ id: 'done', status: 'approved', content: { ...makeApplication().content, destination: '北京' } })
];

const report = buildReport(applications);

describe('AdminPage', () => {
	it('人事只能对待人事申请显示审批', () => {
		render(
			<AdminPage
				user={hrSession}
				applications={applications}
				selectedId=""
				view="list"
				mode="view"
				report={report}
			/>
		);

		expect(screen.getByText('赵人事 · 人事')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: '审批' })).toHaveAttribute(
			'href',
			'/admin?id=hr-wait&mode=approve'
		);
		expect(screen.getAllByRole('link', { name: '查看' })).toHaveLength(2);
	});

	it('管理员只能对待管理员申请显示审批', () => {
		render(
			<AdminPage
				user={adminSession}
				applications={applications}
				selectedId=""
				view="list"
				mode="view"
				report={report}
			/>
		);

		expect(screen.getByRole('link', { name: '审批' })).toHaveAttribute(
			'href',
			'/admin?id=admin-wait&mode=approve'
		);
	});

	it('筛选标签会过滤列表', async () => {
		const user = userEvent.setup();
		render(
			<AdminPage
				user={hrSession}
				applications={applications}
				selectedId=""
				view="list"
				mode="view"
				report={report}
			/>
		);

		await user.click(screen.getByRole('button', { name: /待管理员审批/ }));
		expect(screen.getByText('广州')).toBeInTheDocument();
		expect(screen.queryByText('上海')).not.toBeInTheDocument();
		expect(screen.queryByText('北京')).not.toBeInTheDocument();
	});
});

describe('AdminDetail', () => {
	it('审批模式下可切换驳回表单', async () => {
		const user = userEvent.setup();
		render(
			<AdminDetail
				item={makeApplication({ status: 'pending_hr' })}
				mode="approve"
				role="hr"
			/>
		);

		expect(screen.getByRole('button', { name: '通过' })).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: '驳回' }));
		expect(screen.getByPlaceholderText('请填写驳回原因')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '确认驳回' })).toBeDisabled();

		await user.type(screen.getByPlaceholderText('请填写驳回原因'), '资料不全');
		expect(screen.getByRole('button', { name: '确认驳回' })).toBeEnabled();

		await user.click(screen.getByRole('button', { name: '取消' }));
		expect(screen.queryByPlaceholderText('请填写驳回原因')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: '通过' })).toBeInTheDocument();
	});

	it('非当前审批人只显示返回列表', () => {
		render(
			<AdminDetail
				item={makeApplication({ status: 'pending_hr' })}
				mode="approve"
				role="admin"
			/>
		);

		expect(screen.getByRole('link', { name: '返回列表' })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: '通过' })).not.toBeInTheDocument();
	});
});

describe('ProcessHistory', () => {
	it('展示人事通过后管理员待审批的进度', () => {
		render(
			<ProcessHistory
				item={makeApplication({
					status: 'pending_admin',
					hrComment: '人事同意',
					hrProcessedAt: '2026-09-06T03:00:00.000Z'
				})}
			/>
		);

		expect(screen.getByText('已通过')).toBeInTheDocument();
		expect(screen.getByText('待审批')).toBeInTheDocument();
		expect(screen.getByText('人事同意')).toBeInTheDocument();
	});
});

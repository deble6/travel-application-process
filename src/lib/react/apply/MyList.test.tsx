import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MyList from './MyList';
import { makeApplication } from '../../../test/fixtures';

describe('MyList', () => {
	it('空列表显示暂无申请', () => {
		render(<MyList applications={[]} />);
		expect(screen.getByText('暂无申请')).toBeInTheDocument();
	});

	it('被驳回的申请提供修改入口，其他状态只有查看', () => {
		render(
			<MyList
				applications={[
					makeApplication({ id: 'p', status: 'pending_hr', content: { ...makeApplication().content, destination: '上海' } }),
					makeApplication({ id: 'r', status: 'rejected', content: { ...makeApplication().content, destination: '成都' } })
				]}
			/>
		);

		expect(screen.getAllByRole('link', { name: '查看' })).toHaveLength(2);
		expect(screen.getByRole('button', { name: '修改' })).toBeInTheDocument();
		expect(screen.getByText('待人事审批')).toBeInTheDocument();
		expect(screen.getByText('已驳回')).toBeInTheDocument();
	});
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ApplyFlow from './ApplyFlow';
import { makeDraft } from '../../../test/fixtures';

describe('ApplyFlow', () => {
	it('重新提交时展示驳回原因和取消修改', () => {
		render(
			<ApplyFlow
				draft={makeDraft({
					resubmitId: 'a-004',
					rejectComment: '费用说明不足，请补充后再提交'
				})}
			/>
		);

		expect(screen.getByText(/正在修改被驳回的申请/)).toBeInTheDocument();
		expect(screen.getByText(/费用说明不足，请补充后再提交/)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '取消修改' })).toBeInTheDocument();
	});

	it('预览步骤对重新提交显示重新提交按钮', () => {
		render(
			<ApplyFlow
				draft={makeDraft({
					step: 'preview',
					resubmitId: 'a-004',
					rejectComment: '资料不全'
				})}
			/>
		);

		expect(screen.getByRole('button', { name: '重新提交' })).toBeInTheDocument();
	});

	it('普通申请预览显示确认提交', () => {
		render(<ApplyFlow draft={makeDraft({ step: 'preview' })} />);
		expect(screen.getByRole('button', { name: '确认提交' })).toBeInTheDocument();
	});
});

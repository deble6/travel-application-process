import { render, screen } from '@testing-library/react';
import * as echarts from 'echarts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminStats from './AdminStats';
import { buildReport } from './stats';
import { makeApplication } from '../../../test/fixtures';

describe('AdminStats ECharts', () => {
	beforeEach(() => {
		vi.mocked(echarts.init).mockClear();
	});

	it('渲染统计卡片并初始化三张 ECharts 图', () => {
		const report = buildReport([
			makeApplication({ id: '1', status: 'pending_hr' }),
			makeApplication({ id: '2', status: 'approved', content: { ...makeApplication().content, budget: '1500' } })
		]);

		render(<AdminStats report={report} />);

		expect(screen.getByText('全部申请').parentElement).toHaveTextContent('2');
		expect(screen.getByText('待人事审批').parentElement).toHaveTextContent('1');
		expect(screen.getByText('已通过').parentElement).toHaveTextContent('1');
		expect(screen.getByTestId('echart-status')).toBeInTheDocument();
		expect(screen.getByTestId('echart-department')).toBeInTheDocument();
		expect(screen.getByTestId('echart-tripType')).toBeInTheDocument();
		expect(echarts.init).toHaveBeenCalledTimes(3);

		const firstChart = vi.mocked(echarts.init).mock.results[0]?.value as {
			setOption: ReturnType<typeof vi.fn>;
		};
		expect(firstChart.setOption).toHaveBeenCalled();
		const option = firstChart.setOption.mock.calls[0]?.[0] as {
			series: Array<{ type: string; data: Array<{ name: string; value: number }> }>;
		};
		expect(option.series[0].type).toBe('pie');
		expect(option.series[0].data[0].value).toBe(1);
	});
});

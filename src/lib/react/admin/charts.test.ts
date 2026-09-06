import { describe, expect, it } from 'vitest';
import { STATUS_TEXT } from '$lib/react/admin/status';
import { buildBarChartOption, buildStatusChartOption, STATUS_CHART_COLORS } from '$lib/react/admin/charts';
import { buildReport } from '$lib/react/admin/stats';
import { makeApplication } from '../../../test/fixtures';

describe('ECharts 配置', () => {
	const report = buildReport([
		makeApplication({ id: '1', status: 'pending_hr', applicant: { ...makeApplication().applicant, department: '技术部' } }),
		makeApplication({
			id: '2',
			status: 'approved',
			content: { ...makeApplication().content, tripType: '培训学习' },
			applicant: { ...makeApplication().applicant, department: '市场部' }
		})
	]);

	it('状态图使用饼图，并带上全部状态与配色', () => {
		const option = buildStatusChartOption(report.byStatus);
		const series = option.series as Array<{ type: string; data: Array<{ name: string; value: number; itemStyle: { color: string } }> }>;

		expect(series[0].type).toBe('pie');
		expect(series[0].data.map((item) => item.name)).toEqual([
			STATUS_TEXT.pending_hr,
			STATUS_TEXT.pending_admin,
			STATUS_TEXT.approved,
			STATUS_TEXT.rejected
		]);
		expect(series[0].data.map((item) => item.value)).toEqual([1, 0, 1, 0]);
		expect(series[0].data[0].itemStyle.color).toBe(STATUS_CHART_COLORS[0]);
	});

	it('部门图使用柱状图并包含全部部门', () => {
		const option = buildBarChartOption(report.byDepartment);
		const xAxis = option.xAxis as { type: string; data: string[] };
		const series = option.series as Array<{ type: string; data: number[] }>;

		expect(xAxis.type).toBe('category');
		expect(xAxis.data).toEqual(['技术部', '市场部', '财务部', '人事部', '行政部']);
		expect(series[0].type).toBe('bar');
		expect(series[0].data).toEqual([1, 1, 0, 0, 0]);
	});

	it('出行类型图使用传入的柱颜色', () => {
		const option = buildBarChartOption(report.byTripType, '#3b82f6');
		const series = option.series as Array<{ itemStyle: { color: string } }>;
		expect(series[0].itemStyle.color).toBe('#3b82f6');
	});
});

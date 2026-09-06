import type { EChartsOption } from 'echarts';
import type { StatRow } from './stats';

export const STATUS_CHART_COLORS = ['#f59e0b', '#3b82f6', '#2a9d8f', '#ef4444'];

export function buildStatusChartOption(rows: StatRow[]): EChartsOption {
	return {
		tooltip: { trigger: 'item' },
		legend: { bottom: 0 },
		series: [
			{
				name: '申请状态',
				type: 'pie',
				radius: ['42%', '68%'],
				avoidLabelOverlap: true,
				data: rows.map((row, index) => ({
					name: row.name,
					value: row.count,
					itemStyle: { color: STATUS_CHART_COLORS[index % STATUS_CHART_COLORS.length] }
				}))
			}
		]
	};
}

export function buildBarChartOption(rows: StatRow[], color = '#2a9d8f'): EChartsOption {
	return {
		tooltip: { trigger: 'axis' },
		grid: { left: 36, right: 12, top: 24, bottom: 28, containLabel: true },
		xAxis: {
			type: 'category',
			data: rows.map((row) => row.name),
			axisLabel: { interval: 0 }
		},
		yAxis: { type: 'value', minInterval: 1 },
		series: [
			{
				type: 'bar',
				barMaxWidth: 36,
				data: rows.map((row) => row.count),
				itemStyle: { color, borderRadius: [6, 6, 0, 0] }
			}
		]
	};
}

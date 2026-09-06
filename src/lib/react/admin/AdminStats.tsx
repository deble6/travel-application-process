import { formatMoney, formatPercent, type AdminReport } from './stats';
import { buildBarChartOption, buildStatusChartOption } from './charts';
import EChart from './EChart';

type Props = {
	report: AdminReport;
};

export default function AdminStats({ report }: Props) {
	return (
		<div className="stats-page">
			<div className="stat-grid">
				<div className="stat-card">
					<span>全部申请</span>
					<strong>{report.total}</strong>
				</div>
				<div className="stat-card pending_hr">
					<span>待人事审批</span>
					<strong>{report.pendingHr}</strong>
				</div>
				<div className="stat-card pending_admin">
					<span>待管理员审批</span>
					<strong>{report.pendingAdmin}</strong>
				</div>
				<div className="stat-card approved">
					<span>已通过</span>
					<strong>{report.approved}</strong>
				</div>
				<div className="stat-card rejected">
					<span>已驳回</span>
					<strong>{report.rejected}</strong>
				</div>
				<div className="stat-card">
					<span>审批通过率</span>
					<strong>{formatPercent(report.approvalRate)}</strong>
					<small>按已处理申请计算</small>
				</div>
				<div className="stat-card">
					<span>预估费用合计</span>
					<strong className="money">{formatMoney(report.budgetTotal)}</strong>
					<small>已通过 {formatMoney(report.budgetApproved)}</small>
				</div>
			</div>

			<div className="stat-panels">
				<section className="stat-panel">
					<h2>状态分布</h2>
					<EChart testId="echart-status" option={buildStatusChartOption(report.byStatus)} />
				</section>
				<section className="stat-panel">
					<h2>部门申请</h2>
					<EChart testId="echart-department" option={buildBarChartOption(report.byDepartment)} />
				</section>
				<section className="stat-panel">
					<h2>出行类型</h2>
					<EChart
						testId="echart-tripType"
						option={buildBarChartOption(report.byTripType, '#3b82f6')}
					/>
				</section>
			</div>
		</div>
	);
}

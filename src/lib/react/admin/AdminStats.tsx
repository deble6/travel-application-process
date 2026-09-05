import { STATUS_ORDER } from './status';
import { formatMoney, formatPercent, type AdminReport, type StatRow } from './stats';

type Props = {
	report: AdminReport;
};

function BarList({ rows, tone }: { rows: StatRow[]; tone?: 'status' }) {
	const max = Math.max(...rows.map((row) => row.count), 1);

	return (
		<div className="stat-bars">
			{rows.map((row, index) => (
				<div className="stat-bar-row" key={row.name}>
					<span>{row.name}</span>
					<div className="stat-bar">
						<i
							className={tone === 'status' ? `bar-${STATUS_ORDER[index] ?? 'pending_hr'}` : ''}
							style={{ width: `${Math.max((row.count / max) * 100, row.count ? 8 : 0)}%` }}
						/>
					</div>
					<strong>
						{row.count}
						<em>{row.percent}%</em>
					</strong>
				</div>
			))}
		</div>
	);
}

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
					<BarList rows={report.byStatus} tone="status" />
				</section>
				<section className="stat-panel">
					<h2>部门申请</h2>
					<BarList rows={report.byDepartment} />
				</section>
				<section className="stat-panel">
					<h2>出行类型</h2>
					<BarList rows={report.byTripType} />
				</section>
			</div>
		</div>
	);
}

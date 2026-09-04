import { formatMoney, formatPercent, type AdminReport, type StatRow } from './stats';

const STATUS_CLASS = ['pending', 'approved', 'rejected'] as const;

type Props = {
	report: AdminReport;
};

function BarList({ rows, tone }: { rows: StatRow[]; tone?: 'status' }) {
	const max = Math.max(...rows.map((row) => row.count), 1);

	return (
		<div className="stat-bars">
			{rows.length === 0 ? (
				<p className="subtitle">暂无数据</p>
			) : (
				rows.map((row, index) => (
					<div className="stat-bar-row" key={row.name}>
						<span>{row.name}</span>
						<div className="stat-bar">
							<i
								className={tone === 'status' ? `bar-${STATUS_CLASS[index] ?? 'pending'}` : ''}
								style={{ width: `${Math.max((row.count / max) * 100, row.count ? 8 : 0)}%` }}
							/>
						</div>
						<strong>
							{row.count}
							<em>{row.percent}%</em>
						</strong>
					</div>
				))
			)}
		</div>
	);
}

export default function AdminStats({ report }: Props) {
	if (report.total === 0) {
		return (
			<div className="apply-card home-card">
				<h1>暂无统计数据</h1>
				<p className="subtitle">还没有差旅申请，提交后可在这里查看统计报表。</p>
			</div>
		);
	}

	return (
		<div className="stats-page">
			<div className="stat-grid">
				<div className="stat-card">
					<span>全部申请</span>
					<strong>{report.total}</strong>
				</div>
				<div className="stat-card pending">
					<span>待审批</span>
					<strong>{report.pending}</strong>
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
				<section className="stat-panel">
					<h2>目的地</h2>
					<BarList rows={report.byDestination} />
				</section>
			</div>
		</div>
	);
}

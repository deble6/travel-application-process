import { Fragment, useMemo, useState } from 'react';
import type { ApplicationStatus, TravelApplication } from '../types';
import { MOCK_APPLICATIONS } from './mockApplications';

const STATUS_TEXT: Record<ApplicationStatus, string> = {
	pending: '待审批',
	approved: '已通过',
	rejected: '已驳回'
};

const FILTERS: { id: 'all' | ApplicationStatus; label: string }[] = [
	{ id: 'all', label: '全部' },
	{ id: 'pending', label: '待审批' },
	{ id: 'approved', label: '已通过' },
	{ id: 'rejected', label: '已驳回' }
];

function formatTime(value: string) {
	const date = new Date(value);
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	const hh = String(date.getHours()).padStart(2, '0');
	const mm = String(date.getMinutes()).padStart(2, '0');
	return `${y}-${m}-${d} ${hh}:${mm}`;
}

export default function AdminList({ applications = MOCK_APPLICATIONS }: { applications?: TravelApplication[] }) {
	const [filter, setFilter] = useState<'all' | ApplicationStatus>('all');
	const [openId, setOpenId] = useState<string | null>(null);

	const visible = useMemo(
		() => (filter === 'all' ? applications : applications.filter((item) => item.status === filter)),
		[applications, filter]
	);

	const counts = useMemo(
		() => ({
			all: applications.length,
			pending: applications.filter((item) => item.status === 'pending').length,
			approved: applications.filter((item) => item.status === 'approved').length,
			rejected: applications.filter((item) => item.status === 'rejected').length
		}),
		[applications]
	);

	return (
		<div className="admin-page">
			<div className="admin-head">
				<div>
					<h1>申请列表</h1>
					<p className="subtitle">查看员工提交的差旅申请，后续再接审批。</p>
				</div>
			</div>

			<div className="filter-tabs">
				{FILTERS.map((item) => (
					<button
						key={item.id}
						type="button"
						className={filter === item.id ? 'active' : ''}
						onClick={() => setFilter(item.id)}
					>
						{item.label}
						<span>{counts[item.id]}</span>
					</button>
				))}
			</div>

			{visible.length === 0 ? (
				<div className="apply-card home-card">
					<h1>暂无申请</h1>
					<p className="subtitle">当前筛选条件下没有差旅申请。</p>
				</div>
			) : (
				<div className="list-card">
					<table className="apply-table">
						<thead>
							<tr>
								<th>申请人</th>
								<th>部门</th>
								<th>目的地</th>
								<th>出行类型</th>
								<th>行程日期</th>
								<th>状态</th>
								<th>提交时间</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{visible.map((item) => (
								<Fragment key={item.id}>
									<tr
										className={openId === item.id ? 'is-open' : ''}
										onClick={() => setOpenId(openId === item.id ? null : item.id)}
									>
										<td>{item.applicant.name}</td>
										<td>{item.applicant.department}</td>
										<td>{item.content.destination}</td>
										<td>{item.content.tripType}</td>
										<td>
											{item.content.startDate} ~ {item.content.endDate}
										</td>
										<td>
											<span className={`status-badge status-${item.status}`}>
												{STATUS_TEXT[item.status]}
											</span>
										</td>
										<td>{formatTime(item.createdAt)}</td>
										<td>
											<button
												type="button"
												className="link-btn"
												onClick={(event) => {
													event.stopPropagation();
													setOpenId(openId === item.id ? null : item.id);
												}}
											>
												{openId === item.id ? '收起' : '查看'}
											</button>
										</td>
									</tr>
									{openId === item.id ? (
										<tr className="detail-row">
											<td colSpan={8}>
												<dl>
													<div>
														<dt>职务</dt>
														<dd>{item.applicant.jobTitle}</dd>
													</div>
													<div>
														<dt>联系电话</dt>
														<dd>{item.applicant.phone}</dd>
													</div>
													<div>
														<dt>预估费用</dt>
														<dd>{item.content.budget ? `¥ ${item.content.budget}` : '未填写'}</dd>
													</div>
													<div>
														<dt>出差事由</dt>
														<dd>{item.content.purpose}</dd>
													</div>
												</dl>
											</td>
										</tr>
									) : null}
								</Fragment>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

import { useMemo, useState } from 'react';
import { canApprove, ROLE_TEXT, type ApplicationStatus, type SessionUser, type TravelApplication } from '../types';
import type { AdminReport } from './stats';
import { formatTime, STATUS_TEXT } from './status';
import AdminDetail from './AdminDetail';
import AdminStats from './AdminStats';

const FILTERS: { id: 'all' | ApplicationStatus; label: string }[] = [
	{ id: 'all', label: '全部' },
	{ id: 'pending_hr', label: '待人事审批' },
	{ id: 'pending_admin', label: '待管理员审批' },
	{ id: 'approved', label: '已通过' },
	{ id: 'rejected', label: '已驳回' }
];

type Props = {
	user: SessionUser;
	applications: TravelApplication[];
	selectedId: string;
	view: 'list' | 'stats';
	mode: 'view' | 'approve';
	report: AdminReport;
	form?: { message?: string; id?: string } | null;
};

export default function AdminPage({ user, applications, selectedId, view, report, mode, form }: Props) {
	const [filter, setFilter] = useState<'all' | ApplicationStatus>('all');

	const visible = useMemo(
		() => (filter === 'all' ? applications : applications.filter((item) => item.status === filter)),
		[applications, filter]
	);

	const counts = useMemo(
		() => ({
			all: applications.length,
			pending_hr: applications.filter((item) => item.status === 'pending_hr').length,
			pending_admin: applications.filter((item) => item.status === 'pending_admin').length,
			approved: applications.filter((item) => item.status === 'approved').length,
			rejected: applications.filter((item) => item.status === 'rejected').length
		}),
		[applications]
	);

	const selected = applications.find((item) => item.id === selectedId) ?? null;

	return (
		<div className="app-shell">
			<header className="topbar">
				<strong>差旅申请系统</strong>
				<div className="topbar-right">
					<span>
						{user.name} · {ROLE_TEXT[user.role]}
					</span>
					<form method="POST" action="?/logout" data-sveltekit-reload="">
						<button className="btn secondary header-logout" type="submit">
							退出登录
						</button>
					</form>
				</div>
			</header>
			<main className="app-main">
				{selected ? (
					<AdminDetail item={selected} mode={mode} role={user.role} message={form?.message} />
				) : (
					<div className="admin-page">
						<div className="admin-head">
							<div className="view-tabs">
								<a
									className={view === 'list' ? 'active' : ''}
									href="/admin"
									data-sveltekit-reload=""
								>
									申请列表
								</a>
								<a
									className={view === 'stats' ? 'active' : ''}
									href="/admin?view=stats"
									data-sveltekit-reload=""
								>
									统计报表
								</a>
							</div>
						</div>

						{form?.message ? <p className="error">{form.message}</p> : null}

						{view === 'stats' ? <AdminStats report={report} /> : null}

						{view === 'list' ? (
							<>
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
									<div className="list-card empty-list">暂无申请</div>
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
													<th>操作</th>
												</tr>
											</thead>
											<tbody>
												{visible.map((item) => (
													<tr key={item.id}>
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
														<td className="table-actions">
															{canApprove(user.role, item.status) ? (
																<a
																	className="link-btn action-approve"
																	href={`/admin?id=${encodeURIComponent(item.id)}&mode=approve`}
																	data-sveltekit-reload=""
																>
																	审批
																</a>
															) : (
																<a
																	className="link-btn action-view"
																	href={`/admin?id=${encodeURIComponent(item.id)}`}
																	data-sveltekit-reload=""
																>
																	查看
																</a>
															)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</>
						) : null}
					</div>
				)}
			</main>
		</div>
	);
}

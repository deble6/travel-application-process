import { useMemo, useState } from 'react';
import type { ApplicationStatus, TravelApplication } from '../types';
import { MOCK_APPLICATIONS } from './mockApplications';
import { formatTime, STATUS_TEXT } from './status';
import AdminDetail from './AdminDetail';

const FILTERS: { id: 'all' | ApplicationStatus; label: string }[] = [
	{ id: 'all', label: '全部' },
	{ id: 'pending', label: '待审批' },
	{ id: 'approved', label: '已通过' },
	{ id: 'rejected', label: '已驳回' }
];

export default function AdminPage() {
	const [items, setItems] = useState<TravelApplication[]>(MOCK_APPLICATIONS);
	const [filter, setFilter] = useState<'all' | ApplicationStatus>('all');
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const visible = useMemo(
		() => (filter === 'all' ? items : items.filter((item) => item.status === filter)),
		[items, filter]
	);

	const counts = useMemo(
		() => ({
			all: items.length,
			pending: items.filter((item) => item.status === 'pending').length,
			approved: items.filter((item) => item.status === 'approved').length,
			rejected: items.filter((item) => item.status === 'rejected').length
		}),
		[items]
	);

	const selected = items.find((item) => item.id === selectedId) ?? null;

	function updateItem(id: string, patch: Partial<TravelApplication>) {
		setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
	}

	function approve(id: string, comment: string) {
		updateItem(id, {
			status: 'approved',
			comment,
			processedAt: new Date().toISOString()
		});
	}

	function reject(id: string, comment: string) {
		updateItem(id, {
			status: 'rejected',
			comment,
			processedAt: new Date().toISOString()
		});
	}

	function reopen(id: string) {
		updateItem(id, {
			status: 'pending',
			comment: '',
			processedAt: undefined
		});
	}

	if (selected) {
		return (
			<AdminDetail
				item={selected}
				onBack={() => setSelectedId(null)}
				onApprove={approve}
				onReject={reject}
				onReopen={reopen}
			/>
		);
	}

	return (
		<div className="admin-page">
			<div className="admin-head">
				<div>
					<h1>申请列表</h1>
					<p className="subtitle">查看申请详情，并处理当前流程状态。</p>
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
									<td>
										<button type="button" className="link-btn" onClick={() => setSelectedId(item.id)}>
											查看
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

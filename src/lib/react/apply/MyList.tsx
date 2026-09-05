import type { TravelApplication } from '../types';
import { formatTime, STATUS_TEXT } from '../admin/status';

type Props = {
	applications: TravelApplication[];
};

export default function MyList({ applications }: Props) {
	if (applications.length === 0) {
		return <div className="list-card empty-list">暂无申请</div>;
	}

	return (
		<div className="list-card">
			<table className="apply-table">
				<thead>
					<tr>
						<th>目的地</th>
						<th>出行类型</th>
						<th>行程日期</th>
						<th>状态</th>
						<th>提交时间</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					{applications.map((item) => (
						<tr key={item.id}>
							<td>{item.content.destination}</td>
							<td>{item.content.tripType}</td>
							<td>
								{item.content.startDate} ~ {item.content.endDate}
							</td>
							<td>
								<span className={`status-badge status-${item.status}`}>{STATUS_TEXT[item.status]}</span>
							</td>
							<td>{formatTime(item.createdAt)}</td>
							<td className="table-actions">
								<a
									className="link-btn action-view"
									href={`/apply?view=list&id=${encodeURIComponent(item.id)}`}
									data-sveltekit-reload=""
								>
									查看
								</a>
								{item.status === 'rejected' ? (
									<form method="POST" action="?/edit" data-sveltekit-reload="">
										<input type="hidden" name="id" value={item.id} />
										<button type="submit" className="link-btn action-approve">
											修改
										</button>
									</form>
								) : null}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

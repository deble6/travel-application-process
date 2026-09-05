import type { TravelApplication } from '../types';
import { formatTime, STATUS_TEXT } from '../admin/status';
import ProcessHistory from '../admin/ProcessHistory';

type Props = {
	item: TravelApplication;
};

export default function MyDetail({ item }: Props) {
	return (
		<div className="apply-card preview-card">
			<div className="detail-head">
				<span className={`status-badge status-${item.status}`}>{STATUS_TEXT[item.status]}</span>
			</div>

			<section className="preview-section">
				<header>
					<h2>申请人信息</h2>
				</header>
				<dl>
					<div>
						<dt>姓名</dt>
						<dd>{item.applicant.name}</dd>
					</div>
					<div>
						<dt>部门</dt>
						<dd>{item.applicant.department}</dd>
					</div>
					<div>
						<dt>职务</dt>
						<dd>{item.applicant.jobTitle}</dd>
					</div>
					<div>
						<dt>联系电话</dt>
						<dd>{item.applicant.phone}</dd>
					</div>
				</dl>
			</section>

			<section className="preview-section">
				<header>
					<h2>申请内容</h2>
				</header>
				<dl>
					<div>
						<dt>目的地</dt>
						<dd>{item.content.destination}</dd>
					</div>
					<div>
						<dt>出行类型</dt>
						<dd>{item.content.tripType}</dd>
					</div>
					<div>
						<dt>出发日期</dt>
						<dd>{item.content.startDate}</dd>
					</div>
					<div>
						<dt>返回日期</dt>
						<dd>{item.content.endDate}</dd>
					</div>
					<div>
						<dt>预估费用</dt>
						<dd>{item.content.budget ? `¥ ${item.content.budget}` : '未填写'}</dd>
					</div>
					<div>
						<dt>出差事由</dt>
						<dd>{item.content.purpose}</dd>
					</div>
					<div>
						<dt>提交时间</dt>
						<dd>{formatTime(item.createdAt)}</dd>
					</div>
				</dl>
			</section>

			<ProcessHistory item={item} />

			<div className={`actions ${item.status === 'rejected' ? '' : 'actions-one'}`}>
				<a className="btn secondary" href="/apply?view=list" data-sveltekit-reload="">
					返回列表
				</a>
				{item.status === 'rejected' ? (
					<form method="POST" action="?/edit" data-sveltekit-reload="">
						<input type="hidden" name="id" value={item.id} />
						<button type="submit">修改后重新提交</button>
					</form>
				) : null}
			</div>
		</div>
	);
}

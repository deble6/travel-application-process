import type { TravelApplication } from '../types';
import { formatTime, STATUS_TEXT } from '../admin/status';

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

			{item.status !== 'pending' ? (
				<section className="preview-section">
					<header>
						<h2>处理结果</h2>
					</header>
					<dl>
						<div>
							<dt>当前状态</dt>
							<dd>{STATUS_TEXT[item.status]}</dd>
						</div>
						<div>
							<dt>处理时间</dt>
							<dd>{item.processedAt ? formatTime(item.processedAt) : '—'}</dd>
						</div>
						<div>
							<dt>处理意见</dt>
							<dd>{item.comment || '—'}</dd>
						</div>
					</dl>
				</section>
			) : null}

			<div className="actions actions-one">
				<a className="btn secondary" href="/apply?view=list" data-sveltekit-reload="">
					返回列表
				</a>
			</div>
		</div>
	);
}

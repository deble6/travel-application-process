import { useState } from 'react';
import type { TravelApplication } from '../types';
import { formatTime, STATUS_TEXT } from './status';

type Props = {
	item: TravelApplication;
	message?: string;
};

export default function AdminDetail({ item, message }: Props) {
	const [rejecting, setRejecting] = useState(Boolean(message));
	const [comment, setComment] = useState('');

	return (
		<div className="apply-card preview-card">
			<div className="detail-head">
				<div>
					<h1>申请详情</h1>
					<p className="subtitle">核对申请内容后，可处理当前流程状态</p>
				</div>
				<span className={`status-badge status-${item.status}`}>{STATUS_TEXT[item.status]}</span>
			</div>

			{message ? <p className="error">{message}</p> : null}

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

			{item.status === 'pending' && rejecting ? (
				<form className="process-box" method="POST" action="?/reject" data-sveltekit-reload="">
					<input type="hidden" name="id" value={item.id} />
					<label className="field">
						<span>驳回原因</span>
						<textarea
							name="comment"
							rows={3}
							value={comment}
							placeholder="请填写驳回原因"
							onChange={(event) => setComment(event.target.value)}
						/>
					</label>
					<div className="actions">
						<button type="button" className="btn secondary" onClick={() => setRejecting(false)}>
							取消
						</button>
						<button type="submit" className="danger" disabled={!comment.trim()}>
							确认驳回
						</button>
					</div>
				</form>
			) : (
				<div className={`actions ${item.status === 'pending' ? 'detail-actions' : ''}`}>
					<a className="btn secondary" href="/admin" data-sveltekit-reload="">
						返回列表
					</a>
					{item.status === 'pending' ? (
						<>
							<button type="button" className="danger" onClick={() => setRejecting(true)}>
								驳回
							</button>
							<form method="POST" action="?/approve" data-sveltekit-reload="">
								<input type="hidden" name="id" value={item.id} />
								<button type="submit">通过</button>
							</form>
						</>
					) : (
						<form method="POST" action="?/reopen" data-sveltekit-reload="">
							<input type="hidden" name="id" value={item.id} />
							<button type="submit">退回待审批</button>
						</form>
					)}
				</div>
			)}
		</div>
	);
}

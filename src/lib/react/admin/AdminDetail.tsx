import { useState } from 'react';
import { canApprove, type Role, type TravelApplication } from '../types';
import { formatTime, STATUS_TEXT } from './status';
import ProcessHistory from './ProcessHistory';

type Props = {
	item: TravelApplication;
	mode: 'view' | 'approve';
	role: Role;
	message?: string;
};

export default function AdminDetail({ item, mode, role, message }: Props) {
	const canProcess = mode === 'approve' && canApprove(role, item.status);
	const [rejecting, setRejecting] = useState(Boolean(message) && canProcess);
	const [comment, setComment] = useState('');

	return (
		<div className="apply-card preview-card">
			<div className="detail-head">
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

			<ProcessHistory item={item} />

			{canProcess && rejecting ? (
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
				<div className={`actions ${canProcess ? 'detail-actions' : 'actions-one'}`}>
					<a className="btn secondary" href="/admin" data-sveltekit-reload="">
						返回列表
					</a>
					{canProcess ? (
						<>
							<button type="button" className="danger" onClick={() => setRejecting(true)}>
								驳回
							</button>
							<form method="POST" action="?/approve" data-sveltekit-reload="">
								<input type="hidden" name="id" value={item.id} />
								<button type="submit">通过</button>
							</form>
						</>
					) : null}
				</div>
			)}
		</div>
	);
}

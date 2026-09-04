import { useState } from 'react';
import type { TravelApplication } from '../types';
import { formatTime, STATUS_TEXT } from './status';

type Props = {
	item: TravelApplication;
	onBack: () => void;
	onApprove: (id: string, comment: string) => void;
	onReject: (id: string, comment: string) => void;
	onReopen: (id: string) => void;
};

export default function AdminDetail({ item, onBack, onApprove, onReject, onReopen }: Props) {
	const [rejecting, setRejecting] = useState(false);
	const [comment, setComment] = useState('');

	function submitApprove() {
		onApprove(item.id, comment.trim() || '同意出差');
	}

	function submitReject() {
		if (!comment.trim()) return;
		onReject(item.id, comment.trim());
	}

	return (
		<div className="apply-card preview-card">
			<div className="detail-head">
				<div>
					<h1>申请详情</h1>
					<p className="subtitle">核对申请内容后，可处理当前流程状态</p>
				</div>
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

			{item.status === 'pending' && rejecting ? (
				<div className="process-box">
					<label className="field">
						<span>驳回原因</span>
						<textarea
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
						<button type="button" className="danger" disabled={!comment.trim()} onClick={submitReject}>
							确认驳回
						</button>
					</div>
				</div>
			) : (
				<div className={`actions ${item.status === 'pending' ? 'detail-actions' : ''}`}>
					<button type="button" className="btn secondary" onClick={onBack}>
						返回列表
					</button>
					{item.status === 'pending' ? (
						<>
							<button type="button" className="danger" onClick={() => setRejecting(true)}>
								驳回
							</button>
							<button type="button" onClick={submitApprove}>
								通过
							</button>
						</>
					) : (
						<button type="button" onClick={() => onReopen(item.id)}>
							退回待审批
						</button>
					)}
				</div>
			)}
		</div>
	);
}

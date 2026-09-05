import type { TravelApplication } from '../types';
import { adminStage, formatTime, hrStage, STAGE_TEXT } from './status';

export default function ProcessHistory({ item }: { item: TravelApplication }) {
	const hr = hrStage(item);
	const admin = adminStage(item);

	return (
		<section className="preview-section">
			<header>
				<h2>审批进度</h2>
			</header>
			<dl>
				<div>
					<dt>人事审批</dt>
					<dd>{STAGE_TEXT[hr]}</dd>
				</div>
				<div>
					<dt>人事意见</dt>
					<dd>{item.hrComment || (hr === 'rejected' ? item.comment || '—' : '—')}</dd>
				</div>
				<div>
					<dt>人事处理时间</dt>
					<dd>
						{item.hrProcessedAt
							? formatTime(item.hrProcessedAt)
							: hr === 'rejected' && item.processedAt
								? formatTime(item.processedAt)
								: '—'}
					</dd>
				</div>
				<div>
					<dt>管理员审批</dt>
					<dd>{STAGE_TEXT[admin]}</dd>
				</div>
				<div>
					<dt>管理员意见</dt>
					<dd>{admin === 'none' || admin === 'pending' ? '—' : item.comment || '—'}</dd>
				</div>
				<div>
					<dt>管理员处理时间</dt>
					<dd>
						{admin === 'approved' || admin === 'rejected'
							? item.processedAt
								? formatTime(item.processedAt)
								: '—'
							: '—'}
					</dd>
				</div>
			</dl>
		</section>
	);
}

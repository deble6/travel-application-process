import type { ApplicationStatus, TravelApplication } from '../types';

export const STATUS_TEXT: Record<ApplicationStatus, string> = {
	pending_hr: '待人事审批',
	pending_admin: '待管理员审批',
	approved: '已通过',
	rejected: '已驳回'
};

export const STATUS_ORDER: ApplicationStatus[] = [
	'pending_hr',
	'pending_admin',
	'approved',
	'rejected'
];

export const STAGE_TEXT = {
	none: '未开始',
	pending: '待审批',
	approved: '已通过',
	rejected: '已驳回'
} as const;

export type ApprovalStage = keyof typeof STAGE_TEXT;

export function hrStage(item: TravelApplication): ApprovalStage {
	if (item.status === 'pending_hr') return 'pending';
	if (item.status === 'rejected' && !item.hrProcessedAt) return 'rejected';
	if (item.hrProcessedAt) return 'approved';
	return 'none';
}

export function adminStage(item: TravelApplication): ApprovalStage {
	if (item.status === 'pending_hr' || (item.status === 'rejected' && !item.hrProcessedAt)) return 'none';
	if (item.status === 'pending_admin') return 'pending';
	if (item.status === 'approved') return 'approved';
	if (item.status === 'rejected') return 'rejected';
	return 'none';
}

export function formatTime(value: string) {
	const date = new Date(value);
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	const hh = String(date.getHours()).padStart(2, '0');
	const mm = String(date.getMinutes()).padStart(2, '0');
	return `${y}-${m}-${d} ${hh}:${mm}`;
}

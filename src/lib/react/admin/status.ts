import type { ApplicationStatus } from '../types';

export const STATUS_TEXT: Record<ApplicationStatus, string> = {
	pending: '待审批',
	approved: '已通过',
	rejected: '已驳回'
};

export function formatTime(value: string) {
	const date = new Date(value);
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	const hh = String(date.getHours()).padStart(2, '0');
	const mm = String(date.getMinutes()).padStart(2, '0');
	return `${y}-${m}-${d} ${hh}:${mm}`;
}

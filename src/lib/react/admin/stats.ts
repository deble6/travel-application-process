import { DEPARTMENTS, type ApplicationStatus, type TravelApplication } from '../types';
import { STATUS_ORDER, STATUS_TEXT } from './status';

export type StatRow = {
	name: string;
	count: number;
	percent: number;
	amount: number;
};

export type AdminReport = {
	total: number;
	pending: number;
	pendingHr: number;
	pendingAdmin: number;
	approved: number;
	rejected: number;
	processed: number;
	approvalRate: number | null;
	budgetTotal: number;
	budgetApproved: number;
	byStatus: StatRow[];
	byDepartment: StatRow[];
	byTripType: StatRow[];
};

function parseBudget(value: string) {
	const amount = Number(value);
	return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function groupRows(applications: TravelApplication[], getName: (item: TravelApplication) => string) {
	const total = applications.length;
	const map = new Map<string, { count: number; amount: number }>();

	for (const item of applications) {
		const name = getName(item) || '未填写';
		const current = map.get(name) ?? { count: 0, amount: 0 };
		current.count += 1;
		current.amount += parseBudget(item.content.budget);
		map.set(name, current);
	}

	return [...map.entries()]
		.map(([name, item]) => ({
			name,
			count: item.count,
			amount: item.amount,
			percent: total ? Math.round((item.count / total) * 100) : 0
		}))
		.sort((a, b) => b.count - a.count || b.amount - a.amount);
}

function statusRow(applications: TravelApplication[], status: ApplicationStatus): StatRow {
	const items = applications.filter((item) => item.status === status);
	return {
		name: STATUS_TEXT[status],
		count: items.length,
		percent: applications.length ? Math.round((items.length / applications.length) * 100) : 0,
		amount: items.reduce((sum, item) => sum + parseBudget(item.content.budget), 0)
	};
}

export function buildReport(applications: TravelApplication[]): AdminReport {
	const pendingHr = applications.filter((item) => item.status === 'pending_hr').length;
	const pendingAdmin = applications.filter((item) => item.status === 'pending_admin').length;
	const approved = applications.filter((item) => item.status === 'approved').length;
	const rejected = applications.filter((item) => item.status === 'rejected').length;
	const processed = approved + rejected;

	return {
		total: applications.length,
		pending: pendingHr + pendingAdmin,
		pendingHr,
		pendingAdmin,
		approved,
		rejected,
		processed,
		approvalRate: processed ? Math.round((approved / processed) * 100) : null,
		budgetTotal: applications.reduce((sum, item) => sum + parseBudget(item.content.budget), 0),
		budgetApproved: applications
			.filter((item) => item.status === 'approved')
			.reduce((sum, item) => sum + parseBudget(item.content.budget), 0),
		byStatus: STATUS_ORDER.map((status) => statusRow(applications, status)),
		byDepartment: DEPARTMENTS.map((name) => {
			const items = applications.filter((item) => item.applicant.department === name);
			return {
				name,
				count: items.length,
				amount: items.reduce((sum, item) => sum + parseBudget(item.content.budget), 0),
				percent: applications.length ? Math.round((items.length / applications.length) * 100) : 0
			};
		}),
		byTripType: groupRows(applications, (item) => item.content.tripType)
	};
}

export function formatMoney(value: number) {
	return `¥ ${value.toLocaleString('zh-CN')}`;
}

export function formatPercent(value: number | null) {
	return value === null ? '—' : `${value}%`;
}

import type { ApplicantInfo, ApplicationContent, SessionUser, TravelApplication, TravelDraft } from '$lib/react/types';

export const applicant: ApplicantInfo = {
	name: '李员工',
	department: '技术部',
	phone: '13800138000',
	jobTitle: '工程师'
};

export const content: ApplicationContent = {
	destination: '杭州',
	startDate: '2026-10-01',
	endDate: '2026-10-03',
	tripType: '公务出差',
	purpose: '客户拜访',
	budget: '2000'
};

export const userSession: SessionUser = { username: 'user', name: '李员工', role: 'user' };
export const hrSession: SessionUser = { username: 'hr', name: '赵人事', role: 'hr' };
export const adminSession: SessionUser = { username: 'admin', name: '王管理', role: 'admin' };

export function makeDraft(overrides: Partial<TravelDraft> = {}): TravelDraft {
	return {
		step: 'applicant',
		applicant: { ...applicant },
		content: { ...content },
		previewed: false,
		...overrides
	};
}

export function makeApplication(overrides: Partial<TravelApplication> = {}): TravelApplication {
	return {
		id: overrides.id ?? 'app-1',
		username: overrides.username ?? 'user',
		applicant: { ...applicant, ...overrides.applicant },
		content: { ...content, ...overrides.content },
		status: overrides.status ?? 'pending_hr',
		createdAt: overrides.createdAt ?? '2026-09-06T02:00:00.000Z',
		comment: overrides.comment,
		processedAt: overrides.processedAt,
		hrComment: overrides.hrComment,
		hrProcessedAt: overrides.hrProcessedAt
	};
}

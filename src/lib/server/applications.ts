import {
	canApprove,
	emptyApplicant,
	emptyContent,
	type ApplicationStatus,
	type ApplicantInfo,
	type ApplicationContent,
	type Role,
	type TravelApplication,
	type TravelDraft
} from '$lib/react/types';
import { collectIssues } from '$lib/react/validate';
import { MOCK_APPLICATIONS } from '$lib/react/admin/mockApplications';

function cloneApplication(item: TravelApplication): TravelApplication {
	return {
		...item,
		applicant: { ...item.applicant },
		content: { ...item.content }
	};
}

const drafts = new Map<string, TravelDraft>();
const applications: TravelApplication[] = MOCK_APPLICATIONS.map(cloneApplication);
const submittedFlags = new Set<string>();

export function resetStore(seed: TravelApplication[] = MOCK_APPLICATIONS) {
	drafts.clear();
	submittedFlags.clear();
	applications.splice(0, applications.length, ...seed.map(cloneApplication));
}

export function getDraft(username: string, name: string): TravelDraft {
	const current = drafts.get(username);
	if (current) {
		if (current.step === 'home' || current.step === 'done') current.step = 'applicant';
		if (!current.applicant.name) current.applicant.name = name;
		return current;
	}

	const created: TravelDraft = {
		step: 'applicant',
		applicant: emptyApplicant(name),
		content: emptyContent(),
		previewed: false
	};
	drafts.set(username, created);
	return created;
}

export function saveDraft(username: string, draft: TravelDraft) {
	drafts.set(username, draft);
}

export function clearDraft(username: string, name: string) {
	drafts.set(username, {
		step: 'applicant',
		applicant: emptyApplicant(name),
		content: emptyContent(),
		previewed: false
	});
}

export function readApplicant(data: FormData): ApplicantInfo {
	return {
		name: String(data.get('name') ?? '').trim(),
		department: String(data.get('department') ?? ''),
		phone: String(data.get('phone') ?? '').trim(),
		jobTitle: String(data.get('jobTitle') ?? '').trim()
	};
}

export function readContent(data: FormData): ApplicationContent {
	return {
		destination: String(data.get('destination') ?? '').trim(),
		startDate: String(data.get('startDate') ?? ''),
		endDate: String(data.get('endDate') ?? ''),
		tripType: String(data.get('tripType') ?? ''),
		purpose: String(data.get('purpose') ?? '').trim(),
		budget: String(data.get('budget') ?? '').trim()
	};
}

export function startEditRejected(username: string, name: string, id: string) {
	const item = getUserApplication(id, username);
	if (!item || item.status !== 'rejected') return null;

	saveDraft(username, {
		step: 'applicant',
		applicant: { ...item.applicant },
		content: { ...item.content },
		previewed: false,
		resubmitId: item.id,
		rejectComment: item.comment
	});
	return item;
}

export function submitDraft(username: string, name: string) {
	const draft = getDraft(username, name);
	const issues = collectIssues(draft);
	if (issues.length > 0) {
		return { ok: false as const, issues, draft };
	}

	if (draft.resubmitId) {
		const item = getUserApplication(draft.resubmitId, username);
		if (!item || item.status !== 'rejected') {
			return { ok: false as const, issues, draft };
		}

		item.applicant = { ...draft.applicant };
		item.content = { ...draft.content };
		item.status = 'pending_hr';
		item.comment = '';
		item.processedAt = undefined;
		item.hrComment = undefined;
		item.hrProcessedAt = undefined;
		item.createdAt = new Date().toISOString();
		clearDraft(username, name);
		submittedFlags.add(username);
		return { ok: true as const, application: item };
	}

	const application: TravelApplication = {
		id: crypto.randomUUID(),
		username,
		applicant: { ...draft.applicant },
		content: { ...draft.content },
		status: 'pending_hr',
		createdAt: new Date().toISOString()
	};
	applications.unshift(application);
	clearDraft(username, name);
	submittedFlags.add(username);
	return { ok: true as const, application };
}

export function hasJustSubmitted(username: string) {
	return submittedFlags.has(username);
}

export function clearSubmitted(username: string) {
	submittedFlags.delete(username);
}

export function listApplications() {
	return applications;
}

export function listUserApplications(username: string) {
	return applications.filter((item) => item.username === username);
}

export function getApplication(id: string) {
	return applications.find((item) => item.id === id);
}

export function getUserApplication(id: string, username: string) {
	const item = getApplication(id);
	return item?.username === username ? item : undefined;
}

export function approveApplication(id: string, role: Role, comment = '') {
	const item = getApplication(id);
	if (!item || !canApprove(role, item.status)) return null;

	if (role === 'hr') {
		item.status = 'pending_admin';
		item.hrComment = comment || '人事同意';
		item.hrProcessedAt = new Date().toISOString();
		item.comment = '';
		item.processedAt = undefined;
		return item;
	}

	item.status = 'approved';
	item.comment = comment || '同意出差';
	item.processedAt = new Date().toISOString();
	return item;
}

export function rejectApplication(id: string, role: Role, comment: string) {
	const item = getApplication(id);
	if (!item || !canApprove(role, item.status)) return null;

	item.status = 'rejected';
	item.comment = comment;
	item.processedAt = new Date().toISOString();
	return item;
}

export function updateApplicationStatus(id: string, status: ApplicationStatus, comment = '') {
	const item = getApplication(id);
	if (!item) return null;
	item.status = status;
	item.comment = comment;
	item.processedAt = status === 'approved' || status === 'rejected' ? new Date().toISOString() : undefined;
	return item;
}

import {
	emptyApplicant,
	emptyContent,
	type ApplicationStatus,
	type ApplicantInfo,
	type ApplicationContent,
	type TravelApplication,
	type TravelDraft
} from '$lib/react/types';
import { collectIssues } from '$lib/react/validate';
import { MOCK_APPLICATIONS } from '$lib/react/admin/mockApplications';

const drafts = new Map<string, TravelDraft>();
const applications: TravelApplication[] = MOCK_APPLICATIONS.map((item) => ({ ...item }));
const submittedFlags = new Set<string>();

export function getDraft(username: string, name: string): TravelDraft {
	const current = drafts.get(username);
	if (current) return current;

	const created: TravelDraft = {
		step: 'home',
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
		step: 'home',
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

export function submitDraft(username: string, name: string) {
	const draft = getDraft(username, name);
	const issues = collectIssues(draft);
	if (issues.length > 0) {
		return { ok: false as const, issues, draft };
	}

	const application: TravelApplication = {
		id: crypto.randomUUID(),
		username,
		applicant: { ...draft.applicant },
		content: { ...draft.content },
		status: 'pending',
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

export function getApplication(id: string) {
	return applications.find((item) => item.id === id);
}

export function updateApplicationStatus(id: string, status: ApplicationStatus, comment = '') {
	const item = getApplication(id);
	if (!item) return null;

	item.status = status;
	if (status === 'pending') {
		item.comment = '';
		item.processedAt = undefined;
	} else {
		item.comment = comment;
		item.processedAt = new Date().toISOString();
	}

	return item;
}

import { emptyApplicant, emptyContent, type ApplyStep, type SessionUser, type TravelDraft } from './types';

const DRAFT_KEY = 'travel-apply-draft';

export function loadDraft(user: SessionUser): TravelDraft {
	try {
		const raw = localStorage.getItem(`${DRAFT_KEY}:${user.username}`);
		if (!raw) return createDraft(user);
		const parsed = JSON.parse(raw) as TravelDraft;
		return {
			step: parsed.step && parsed.step !== 'done' ? parsed.step : 'home',
			applicant: { ...emptyApplicant(user.name), ...parsed.applicant },
			content: { ...emptyContent(), ...parsed.content }
		};
	} catch {
		return createDraft(user);
	}
}

export function saveDraft(user: SessionUser, draft: TravelDraft) {
	localStorage.setItem(`${DRAFT_KEY}:${user.username}`, JSON.stringify(draft));
}

export function clearDraft(user: SessionUser) {
	localStorage.removeItem(`${DRAFT_KEY}:${user.username}`);
}

function createDraft(user: SessionUser): TravelDraft {
	return {
		step: 'home',
		applicant: emptyApplicant(user.name),
		content: emptyContent()
	};
}

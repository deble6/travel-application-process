import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	clearSubmitted,
	getDraft,
	getUserApplication,
	hasJustSubmitted,
	listUserApplications,
	readApplicant,
	readContent,
	saveDraft,
	submitDraft
} from '$lib/server/applications';
import type { ApplyStep } from '$lib/react/types';
import { applicantIssues, contentIssues } from '$lib/react/validate';

const FOCUS_FIELDS = new Set([
	'name',
	'department',
	'phone',
	'jobTitle',
	'destination',
	'tripType',
	'startDate',
	'endDate',
	'purpose'
]);

function requireUser(locals: App.Locals) {
	if (!locals.user) redirect(303, '/');
	if (locals.user.role !== 'user') redirect(303, locals.user.role === 'admin' ? '/admin' : '/');
	return locals.user;
}

function applyRedirect(field?: string) {
	if (field && FOCUS_FIELDS.has(field)) {
		redirect(303, `/apply?focus=${encodeURIComponent(field)}`);
	}
	redirect(303, '/apply');
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = requireUser(locals);
	const focus = url.searchParams.get('focus') ?? '';
	const id = url.searchParams.get('id') ?? '';
	const selected = id ? getUserApplication(id, user.username) : undefined;
	const submitted = hasJustSubmitted(user.username);
	if (submitted) clearSubmitted(user.username);

	const wantsList = Boolean(id) || url.searchParams.get('view') === 'list';

	return {
		user,
		draft: getDraft(user.username, user.name),
		applications: listUserApplications(user.username),
		selectedId: selected?.id ?? '',
		view: wantsList ? 'list' : 'form',
		focusField: FOCUS_FIELDS.has(focus) ? focus : '',
		submitted
	};
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		redirect(303, '/');
	},

	saveApplicant: async ({ locals, request }) => {
		const user = requireUser(locals);
		const draft = getDraft(user.username, user.name);
		draft.applicant = readApplicant(await request.formData());
		const issues = applicantIssues(draft.applicant);
		if (issues.length > 0) {
			draft.step = 'applicant';
			saveDraft(user.username, draft);
			return fail(400, { issues });
		}

		draft.step = 'content';
		saveDraft(user.username, draft);
		redirect(303, '/apply');
	},

	saveContent: async ({ locals, request }) => {
		const user = requireUser(locals);
		const draft = getDraft(user.username, user.name);
		draft.content = readContent(await request.formData());
		const issues = contentIssues(draft.content);
		if (issues.length > 0) {
			draft.step = 'content';
			saveDraft(user.username, draft);
			return fail(400, { issues });
		}

		draft.step = 'preview';
		saveDraft(user.username, draft);
		redirect(303, '/apply');
	},

	saveContentBack: async ({ locals, request }) => {
		const user = requireUser(locals);
		const draft = getDraft(user.username, user.name);
		draft.content = readContent(await request.formData());
		draft.step = 'applicant';
		saveDraft(user.username, draft);
		redirect(303, '/apply');
	},

	go: async ({ locals, request }) => {
		const user = requireUser(locals);
		const data = await request.formData();
		const [step, field] = String(data.get('goto') ?? '').split(':');
		const allowed: ApplyStep[] = ['applicant', 'content', 'preview'];
		if (!allowed.includes(step as ApplyStep)) {
			redirect(303, '/apply');
		}

		const draft = getDraft(user.username, user.name);
		draft.step = step as ApplyStep;
		saveDraft(user.username, draft);
		applyRedirect(field);
	},

	submit: async ({ locals }) => {
		const user = requireUser(locals);
		const result = submitDraft(user.username, user.name);
		if (!result.ok) {
			const draft = result.draft;
			draft.step = result.issues[0]?.section ?? 'applicant';
			saveDraft(user.username, draft);
			return fail(400, { issues: result.issues });
		}
		redirect(303, '/apply?view=list');
	}
};

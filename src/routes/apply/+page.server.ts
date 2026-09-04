import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	clearSubmitted,
	getDraft,
	hasJustSubmitted,
	readApplicant,
	readContent,
	saveDraft,
	submitDraft
} from '$lib/server/applications';
import type { ApplyStep } from '$lib/react/types';

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
	if (locals.user.role !== 'user') redirect(303, '/');
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

	return {
		user,
		draft: getDraft(user.username, user.name),
		submitted: hasJustSubmitted(user.username),
		focusField: FOCUS_FIELDS.has(focus) ? focus : ''
	};
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		redirect(303, '/');
	},

	start: async ({ locals }) => {
		const user = requireUser(locals);
		const draft = getDraft(user.username, user.name);
		draft.step = 'applicant';
		if (!draft.applicant.name) draft.applicant.name = user.name;
		saveDraft(user.username, draft);
		clearSubmitted(user.username);
		redirect(303, '/apply');
	},

	home: async ({ locals }) => {
		const user = requireUser(locals);
		const draft = getDraft(user.username, user.name);
		draft.step = 'home';
		saveDraft(user.username, draft);
		clearSubmitted(user.username);
		redirect(303, '/apply');
	},

	saveApplicant: async ({ locals, request }) => {
		const user = requireUser(locals);
		const draft = getDraft(user.username, user.name);
		draft.applicant = readApplicant(await request.formData());
		draft.step = 'content';
		saveDraft(user.username, draft);
		redirect(303, '/apply');
	},

	saveApplicantBack: async ({ locals, request }) => {
		const user = requireUser(locals);
		const draft = getDraft(user.username, user.name);
		draft.applicant = readApplicant(await request.formData());
		draft.step = 'home';
		saveDraft(user.username, draft);
		redirect(303, '/apply');
	},

	saveContent: async ({ locals, request }) => {
		const user = requireUser(locals);
		const draft = getDraft(user.username, user.name);
		draft.content = readContent(await request.formData());
		draft.step = 'preview';
		draft.previewed = true;
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
		const allowed: ApplyStep[] = ['home', 'applicant', 'content', 'preview'];
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
			draft.step = 'preview';
			draft.previewed = true;
			saveDraft(user.username, draft);
			return fail(400, { message: '请先修改后再提交' });
		}
		redirect(303, '/apply');
	}
};

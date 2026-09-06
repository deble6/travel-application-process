import { beforeEach, describe, expect, it } from 'vitest';
import {
	approveApplication,
	clearDraft,
	getApplication,
	getDraft,
	listApplications,
	listUserApplications,
	rejectApplication,
	resetStore,
	saveDraft,
	startEditRejected,
	submitDraft
} from '$lib/server/applications';
import { applicant, content, makeApplication, makeDraft } from '../../test/fixtures';

describe('差旅申请主流程', () => {
	beforeEach(() => {
		resetStore([]);
	});

	function submitValid(username = 'user', name = '李员工') {
		saveDraft(username, makeDraft({ step: 'preview', previewed: true }));
		return submitDraft(username, name);
	}

	it('提交后进入人事审批，人事通过后再由管理员通过', () => {
		const created = submitValid();
		expect(created.ok).toBe(true);
		if (!created.ok) return;

		expect(created.application.status).toBe('pending_hr');
		expect(listUserApplications('user')).toHaveLength(1);

		expect(approveApplication(created.application.id, 'admin')).toBeNull();

		const afterHr = approveApplication(created.application.id, 'hr');
		expect(afterHr?.status).toBe('pending_admin');
		expect(afterHr?.hrComment).toBe('人事同意');

		expect(approveApplication(created.application.id, 'hr')).toBeNull();

		const afterAdmin = approveApplication(created.application.id, 'admin', '同意出差');
		expect(afterAdmin?.status).toBe('approved');
		expect(afterAdmin?.comment).toBe('同意出差');
	});

	it('人事驳回后用户可修改并重新提交', () => {
		const created = submitValid();
		expect(created.ok).toBe(true);
		if (!created.ok) return;

		rejectApplication(created.application.id, 'hr', '费用说明不足');
		expect(getApplication(created.application.id)?.status).toBe('rejected');

		expect(startEditRejected('user', '李员工', created.application.id)).not.toBeNull();
		const draft = getDraft('user', '李员工');
		expect(draft.resubmitId).toBe(created.application.id);
		expect(draft.rejectComment).toBe('费用说明不足');

		draft.content = { ...content, purpose: '补充费用明细后再次申请', budget: '2600' };
		saveDraft('user', draft);

		const again = submitDraft('user', '李员工');
		expect(again.ok).toBe(true);
		if (!again.ok) return;

		expect(again.application.id).toBe(created.application.id);
		expect(again.application.status).toBe('pending_hr');
		expect(again.application.content.budget).toBe('2600');
		expect(again.application.comment).toBe('');
		expect(again.application.hrComment).toBeUndefined();
		expect(listApplications()).toHaveLength(1);
	});

	it('管理员驳回后用户重新提交，需再次经过人事和管理员', () => {
		const created = submitValid();
		expect(created.ok).toBe(true);
		if (!created.ok) return;

		approveApplication(created.application.id, 'hr');
		rejectApplication(created.application.id, 'admin', '行程需调整');

		startEditRejected('user', '李员工', created.application.id);
		saveDraft('user', makeDraft({ step: 'preview', previewed: true, resubmitId: created.application.id }));
		const again = submitDraft('user', '李员工');
		expect(again.ok).toBe(true);
		if (!again.ok) return;

		expect(again.application.status).toBe('pending_hr');
		approveApplication(again.application.id, 'hr');
		approveApplication(again.application.id, 'admin');
		expect(getApplication(again.application.id)?.status).toBe('approved');
	});

	it('未通过校验或非驳回申请不能提交或修改', () => {
		saveDraft('user', makeDraft({ applicant: { ...applicant, phone: '123' } }));
		const invalid = submitDraft('user', '李员工');
		expect(invalid.ok).toBe(false);
		if (invalid.ok) return;
		expect(invalid.issues.some((item) => item.field === 'phone')).toBe(true);

		resetStore([makeApplication({ id: 'ok', status: 'approved' })]);
		expect(startEditRejected('user', '李员工', 'ok')).toBeNull();
	});

	it('取消修改会清空草稿中的重新提交信息', () => {
		resetStore([makeApplication({ id: 'rej', status: 'rejected', comment: '驳回' })]);
		startEditRejected('user', '李员工', 'rej');
		clearDraft('user', '李员工');
		expect(getDraft('user', '李员工').resubmitId).toBeUndefined();
	});
});

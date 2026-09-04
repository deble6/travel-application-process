import type { ApplicationContent, ApplicantInfo, FieldIssue, TravelDraft } from './types';

export function collectIssues(draft: TravelDraft): FieldIssue[] {
	return [...applicantIssues(draft.applicant), ...contentIssues(draft.content)];
}

export function applicantIssues(applicant: ApplicantInfo): FieldIssue[] {
	const issues: FieldIssue[] = [];

	if (!applicant.name.trim()) {
		issues.push({ section: 'applicant', field: 'name', label: '姓名', message: '请填写姓名' });
	}
	if (!applicant.department) {
		issues.push({ section: 'applicant', field: 'department', label: '部门', message: '请选择部门' });
	}
	if (!applicant.phone.trim()) {
		issues.push({ section: 'applicant', field: 'phone', label: '联系电话', message: '请填写联系电话' });
	} else if (!/^1\d{10}$/.test(applicant.phone.trim())) {
		issues.push({
			section: 'applicant',
			field: 'phone',
			label: '联系电话',
			message: '请输入 11 位手机号'
		});
	}
	if (!applicant.jobTitle.trim()) {
		issues.push({ section: 'applicant', field: 'jobTitle', label: '职务', message: '请填写职务' });
	}

	return issues;
}

export function contentIssues(content: ApplicationContent): FieldIssue[] {
	const issues: FieldIssue[] = [];

	if (!content.destination.trim()) {
		issues.push({ section: 'content', field: 'destination', label: '目的地', message: '请填写目的地' });
	}
	if (!content.tripType) {
		issues.push({ section: 'content', field: 'tripType', label: '出行类型', message: '请选择出行类型' });
	}
	if (!content.startDate) {
		issues.push({ section: 'content', field: 'startDate', label: '出发日期', message: '请选择出发日期' });
	}
	if (!content.endDate) {
		issues.push({ section: 'content', field: 'endDate', label: '返回日期', message: '请选择返回日期' });
	} else if (content.startDate && content.endDate < content.startDate) {
		issues.push({
			section: 'content',
			field: 'endDate',
			label: '返回日期',
			message: '返回日期不能早于出发日期'
		});
	}
	if (!content.purpose.trim()) {
		issues.push({ section: 'content', field: 'purpose', label: '出差事由', message: '请填写出差事由' });
	}

	return issues;
}

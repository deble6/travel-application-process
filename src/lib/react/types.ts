export type Role = 'admin' | 'hr' | 'user';

export type SessionUser = {
	username: string;
	name: string;
	role: Role;
};

export type ApplicantInfo = {
	name: string;
	department: string;
	phone: string;
	jobTitle: string;
};

export type ApplicationContent = {
	destination: string;
	startDate: string;
	endDate: string;
	tripType: string;
	purpose: string;
	budget: string;
};

export type TravelDraft = {
	applicant: ApplicantInfo;
	content: ApplicationContent;
	step: ApplyStep;
	previewed?: boolean;
	resubmitId?: string;
	rejectComment?: string;
};

export type ApplyStep = 'home' | 'applicant' | 'content' | 'preview' | 'done';

export type FormSection = 'applicant' | 'content';

export type ApplicationStatus = 'pending_hr' | 'pending_admin' | 'approved' | 'rejected';

export type TravelApplication = {
	id: string;
	username: string;
	applicant: ApplicantInfo;
	content: ApplicationContent;
	status: ApplicationStatus;
	createdAt: string;
	comment?: string;
	processedAt?: string;
	hrComment?: string;
	hrProcessedAt?: string;
};

export type FieldIssue = {
	section: FormSection;
	field: string;
	label: string;
	message: string;
};

export const DEPARTMENTS = ['技术部', '市场部', '财务部', '人事部', '行政部'];
export const TRIP_TYPES = ['公务出差', '培训学习', '会议交流', '其他'];

export const ROLE_TEXT: Record<Role, string> = {
	admin: '管理员',
	hr: '人事',
	user: '用户'
};

export function canApprove(role: Role, status: ApplicationStatus) {
	return (role === 'hr' && status === 'pending_hr') || (role === 'admin' && status === 'pending_admin');
}

export function emptyApplicant(name = ''): ApplicantInfo {
	return { name, department: '', phone: '', jobTitle: '' };
}

export function emptyContent(): ApplicationContent {
	return {
		destination: '',
		startDate: '',
		endDate: '',
		tripType: '',
		purpose: '',
		budget: ''
	};
}

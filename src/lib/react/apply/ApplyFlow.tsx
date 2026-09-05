import type { FieldIssue, TravelDraft } from '../types';
import ApplicantForm from './ApplicantForm';
import ContentForm from './ContentForm';
import Preview from './Preview';

const STEPS = [
	{ id: 'applicant', label: '申请人信息' },
	{ id: 'content', label: '申请内容' },
	{ id: 'preview', label: '预览确认' }
] as const;

type Props = {
	draft: TravelDraft;
	focusField?: string;
	issues?: FieldIssue[];
};

export default function ApplyFlow({ draft, focusField, issues = [] }: Props) {
	const step = draft?.step === 'home' || draft?.step === 'done' ? 'applicant' : draft?.step;
	const stepIndex = STEPS.findIndex((item) => item.id === step);

	if (!draft) return null;

	return (
		<div className="apply-wrap">
			{draft.resubmitId ? (
				<div className="edit-notice">
					<p>
						正在修改被驳回的申请。上次驳回原因：{draft.rejectComment?.trim() || '未填写'}
					</p>
					<form method="POST" action="?/cancelEdit" data-sveltekit-reload="">
						<button type="submit" className="btn secondary">
							取消修改
						</button>
					</form>
				</div>
			) : null}

			<ol className="steps">
				{STEPS.map((item, index) => (
					<li key={item.id} className={step === item.id ? 'active' : stepIndex > index ? 'done' : ''}>
						<span>{index + 1}</span>
						{item.label}
					</li>
				))}
			</ol>

			{step === 'applicant' ? (
				<ApplicantForm
					value={draft.applicant}
					issues={issues.filter((item) => item.section === 'applicant')}
					focusField={focusField}
				/>
			) : null}

			{step === 'content' ? (
				<ContentForm
					value={draft.content}
					issues={issues.filter((item) => item.section === 'content')}
					focusField={focusField}
				/>
			) : null}

			{step === 'preview' ? <Preview draft={draft} /> : null}
		</div>
	);
}

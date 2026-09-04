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
	submitted: boolean;
	focusField?: string;
	issues?: FieldIssue[];
};

export default function ApplyFlow({ draft, submitted, focusField, issues = [] }: Props) {
	const step = draft?.step === 'home' || draft?.step === 'done' ? 'applicant' : draft?.step;
	const stepIndex = STEPS.findIndex((item) => item.id === step);
	const formIssues = issues;

	if (!draft) return null;

	if (submitted) {
		return (
			<div className="apply-card home-card">
				<h1>已提交</h1>
				<form method="POST" action="?/start" data-sveltekit-reload="">
					<button type="submit">再次申请</button>
				</form>
			</div>
		);
	}

	return (
		<div className="apply-wrap">
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
					issues={formIssues.filter((item) => item.section === 'applicant')}
					focusField={focusField}
				/>
			) : null}

			{step === 'content' ? (
				<ContentForm
					value={draft.content}
					issues={formIssues.filter((item) => item.section === 'content')}
					focusField={focusField}
				/>
			) : null}

			{step === 'preview' ? <Preview draft={draft} /> : null}
		</div>
	);
}

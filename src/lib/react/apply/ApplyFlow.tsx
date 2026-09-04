import { useMemo } from 'react';
import { collectIssues } from '../validate';
import type { TravelDraft } from '../types';
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
	message?: string;
};

export default function ApplyFlow({ draft, submitted, focusField, message }: Props) {
	const issues = useMemo(() => (draft ? collectIssues(draft) : []), [draft]);
	const showIssues = Boolean(draft?.previewed);
	const stepIndex = STEPS.findIndex((item) => item.id === draft?.step);

	if (!draft) return null;

	if (submitted) {
		return (
			<div className="apply-card home-card">
				<h1>已提交</h1>
				<p className="subtitle">申请已保存到服务端，等待后续审批。</p>
				<form method="POST" action="?/home" data-sveltekit-reload="">
					<button type="submit">返回首页</button>
				</form>
			</div>
		);
	}

	if (draft.step === 'home') {
		return (
			<div className="apply-card home-card">
				<h1>差旅申请</h1>
				<p className="subtitle">填写申请人信息和申请内容，提交前可预览核对</p>
				<form method="POST" action="?/start" data-sveltekit-reload="">
					<button type="submit">发起申请</button>
				</form>
			</div>
		);
	}

	return (
		<div className="apply-wrap">
			<ol className="steps">
				{STEPS.map((item, index) => (
					<li key={item.id} className={draft.step === item.id ? 'active' : stepIndex > index ? 'done' : ''}>
						<span>{index + 1}</span>
						{item.label}
					</li>
				))}
			</ol>

			{draft.step === 'applicant' ? (
				<ApplicantForm
					value={draft.applicant}
					issues={issues.filter((item) => item.section === 'applicant')}
					showIssues={showIssues}
					focusField={focusField}
				/>
			) : null}

			{draft.step === 'content' ? (
				<ContentForm
					value={draft.content}
					issues={issues.filter((item) => item.section === 'content')}
					showIssues={showIssues}
					focusField={focusField}
				/>
			) : null}

			{draft.step === 'preview' ? (
				<Preview draft={draft} issues={issues} message={message} />
			) : null}
		</div>
	);
}

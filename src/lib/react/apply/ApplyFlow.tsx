import { useEffect, useMemo, useState } from 'react';
import { collectIssues } from '../validate';
import { clearDraft, loadDraft, saveDraft } from '../storage';
import { emptyApplicant, emptyContent, type ApplyStep, type FormSection, type SessionUser } from '../types';
import ApplicantForm from './ApplicantForm';
import ContentForm from './ContentForm';
import Preview from './Preview';

const STEPS: { id: ApplyStep; label: string }[] = [
	{ id: 'applicant', label: '申请人信息' },
	{ id: 'content', label: '申请内容' },
	{ id: 'preview', label: '预览确认' }
];

export default function ApplyFlow({ user }: { user: SessionUser }) {
	const [draft, setDraft] = useState(() => loadDraft(user));
	const [focusField, setFocusField] = useState<string>();
	const [showIssues, setShowIssues] = useState(false);
	const issues = useMemo(() => collectIssues(draft), [draft]);

	useEffect(() => {
		if (draft.step === 'done') {
			clearDraft(user);
			return;
		}
		saveDraft(user, draft);
	}, [user, draft]);

	function go(step: ApplyStep, field?: string) {
		if (step === 'preview') setShowIssues(true);
		setFocusField(field);
		setDraft((current) => ({ ...current, step }));
	}

	function editSection(section: FormSection, field?: string) {
		setShowIssues(true);
		go(section, field);
	}

	function startApply() {
		setShowIssues(false);
		setFocusField(undefined);
		setDraft((current) => ({
			...current,
			step: 'applicant',
			applicant: current.applicant.name ? current.applicant : emptyApplicant(user.name)
		}));
	}

	function submit() {
		if (issues.length > 0) return;
		clearDraft(user);
		setDraft({
			step: 'done',
			applicant: emptyApplicant(user.name),
			content: emptyContent()
		});
	}

	if (draft.step === 'home') {
		return (
			<div className="apply-card home-card">
				<h1>差旅申请</h1>
				<p className="subtitle">填写申请人信息和申请内容，提交前可预览核对</p>
				<button type="button" onClick={startApply}>
					发起申请
				</button>
			</div>
		);
	}

	if (draft.step === 'done') {
		return (
			<div className="apply-card home-card">
				<h1>已提交</h1>
				<p className="subtitle">申请已暂存在浏览器本地，后续步骤再接服务端。</p>
				<button type="button" onClick={() => go('home')}>
					返回首页
				</button>
			</div>
		);
	}

	return (
		<div className="apply-wrap">
			<ol className="steps">
				{STEPS.map((item, index) => (
					<li
						key={item.id}
						className={draft.step === item.id ? 'active' : STEPS.findIndex((step) => step.id === draft.step) > index ? 'done' : ''}
					>
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
					onChange={(applicant) => setDraft((current) => ({ ...current, applicant }))}
					onNext={() => go('content')}
					onBack={() => go('home')}
				/>
			) : null}

			{draft.step === 'content' ? (
				<ContentForm
					value={draft.content}
					issues={issues.filter((item) => item.section === 'content')}
					showIssues={showIssues}
					focusField={focusField}
					onChange={(content) => setDraft((current) => ({ ...current, content }))}
					onNext={() => go('preview')}
					onBack={() => go('applicant')}
				/>
			) : null}

			{draft.step === 'preview' ? (
				<Preview
					draft={draft}
					issues={issues}
					onEdit={editSection}
					onSubmit={submit}
					onBack={() => go('content')}
				/>
			) : null}
		</div>
	);
}

import { useEffect, useRef } from 'react';
import { DEPARTMENTS, type ApplicantInfo, type FieldIssue } from '../types';

type Props = {
	value: ApplicantInfo;
	issues: FieldIssue[];
	showIssues?: boolean;
	focusField?: string;
};

export default function ApplicantForm({ value, issues, showIssues, focusField }: Props) {
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (!focusField || !formRef.current) return;
		const el = formRef.current.querySelector<HTMLElement>(`[name="${focusField}"]`);
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		el?.focus();
	}, [focusField]);

	function issueFor(field: string) {
		return issues.find((item) => item.field === field);
	}

	return (
		<form
			ref={formRef}
			className="apply-card"
			method="POST"
			action="?/saveApplicant"
			data-sveltekit-reload=""
		>
			<h1>申请人信息</h1>
			<p className="subtitle">请填写本次出差的申请人基本信息</p>

			<label className={`field ${showIssues && issueFor('name') ? 'has-issue' : ''}`}>
				<span>姓名</span>
				<input name="name" defaultValue={value.name} placeholder="请输入姓名" />
				{showIssues && issueFor('name') ? <em>{issueFor('name')?.message}</em> : null}
			</label>

			<label className={`field ${showIssues && issueFor('department') ? 'has-issue' : ''}`}>
				<span>部门</span>
				<select name="department" defaultValue={value.department}>
					<option value="">请选择部门</option>
					{DEPARTMENTS.map((item) => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
				</select>
				{showIssues && issueFor('department') ? <em>{issueFor('department')?.message}</em> : null}
			</label>

			<label className={`field ${showIssues && issueFor('phone') ? 'has-issue' : ''}`}>
				<span>联系电话</span>
				<input name="phone" defaultValue={value.phone} placeholder="请输入 11 位手机号" />
				{showIssues && issueFor('phone') ? <em>{issueFor('phone')?.message}</em> : null}
			</label>

			<label className={`field ${showIssues && issueFor('jobTitle') ? 'has-issue' : ''}`}>
				<span>职务</span>
				<input name="jobTitle" defaultValue={value.jobTitle} placeholder="例如：工程师" />
				{showIssues && issueFor('jobTitle') ? <em>{issueFor('jobTitle')?.message}</em> : null}
			</label>

			<div className="actions">
				<button type="submit" className="btn secondary" formAction="?/saveApplicantBack">
					返回
				</button>
				<button type="submit">下一步</button>
			</div>
		</form>
	);
}

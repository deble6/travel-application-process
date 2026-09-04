import { useEffect, useRef, useState, type FormEvent } from 'react';
import { DEPARTMENTS, type ApplicantInfo, type FieldIssue } from '../types';
import { applicantIssues } from '../validate';

type Props = {
	value: ApplicantInfo;
	issues: FieldIssue[];
	focusField?: string;
};

export default function ApplicantForm({ value, issues: initialIssues, focusField }: Props) {
	const formRef = useRef<HTMLFormElement>(null);
	const [issues, setIssues] = useState(initialIssues);

	useEffect(() => {
		setIssues(initialIssues);
	}, [initialIssues]);

	useEffect(() => {
		if (!focusField || !formRef.current) return;
		const el = formRef.current.querySelector<HTMLElement>(`[name="${focusField}"]`);
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		el?.focus();
	}, [focusField]);

	function issueFor(field: string) {
		return issues.find((item) => item.field === field);
	}

	function clearField(field: string) {
		setIssues((current) => current.filter((item) => item.field !== field));
	}

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		const data = new FormData(event.currentTarget);
		const nextIssues = applicantIssues({
			name: String(data.get('name') ?? ''),
			department: String(data.get('department') ?? ''),
			phone: String(data.get('phone') ?? ''),
			jobTitle: String(data.get('jobTitle') ?? '')
		});
		if (nextIssues.length > 0) {
			event.preventDefault();
			setIssues(nextIssues);
		}
	}

	return (
		<form
			ref={formRef}
			className="apply-card"
			method="POST"
			action="?/saveApplicant"
			data-sveltekit-reload=""
			onSubmit={onSubmit}
		>
			<h1>申请人信息</h1>

			<label className={`field ${issueFor('name') ? 'has-issue' : ''}`}>
				<span>姓名</span>
				<input
					name="name"
					defaultValue={value.name}
					placeholder="请输入姓名"
					onChange={() => clearField('name')}
				/>
				{issueFor('name') ? <em>{issueFor('name')?.message}</em> : null}
			</label>

			<label className={`field ${issueFor('department') ? 'has-issue' : ''}`}>
				<span>部门</span>
				<select
					name="department"
					defaultValue={value.department}
					onChange={() => clearField('department')}
				>
					{value.department ? null : <option value="" disabled hidden />}
					{DEPARTMENTS.map((item) => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
				</select>
				{issueFor('department') ? <em>{issueFor('department')?.message}</em> : null}
			</label>

			<label className={`field ${issueFor('phone') ? 'has-issue' : ''}`}>
				<span>联系电话</span>
				<input
					name="phone"
					defaultValue={value.phone}
					placeholder="请输入 11 位手机号"
					onChange={() => clearField('phone')}
				/>
				{issueFor('phone') ? <em>{issueFor('phone')?.message}</em> : null}
			</label>

			<label className={`field ${issueFor('jobTitle') ? 'has-issue' : ''}`}>
				<span>职务</span>
				<input
					name="jobTitle"
					defaultValue={value.jobTitle}
					placeholder="例如：工程师"
					onChange={() => clearField('jobTitle')}
				/>
				{issueFor('jobTitle') ? <em>{issueFor('jobTitle')?.message}</em> : null}
			</label>

			<div className="actions actions-one">
				<button type="submit">下一步</button>
			</div>
		</form>
	);
}

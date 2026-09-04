import { useEffect, useRef } from 'react';
import { DEPARTMENTS, type ApplicantInfo, type FieldIssue } from '../types';

type Props = {
	value: ApplicantInfo;
	issues: FieldIssue[];
	showIssues?: boolean;
	focusField?: string;
	onChange: (value: ApplicantInfo) => void;
	onNext: () => void;
	onBack: () => void;
};

export default function ApplicantForm({
	value,
	issues,
	showIssues,
	focusField,
	onChange,
	onNext,
	onBack
}: Props) {
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
			onSubmit={(event) => {
				event.preventDefault();
				onNext();
			}}
		>
			<h1>申请人信息</h1>
			<p className="subtitle">请填写本次出差的申请人基本信息</p>

			<label className={`field ${showIssues && issueFor('name') ? 'has-issue' : ''}`}>
				<span>姓名</span>
				<input
					name="name"
					value={value.name}
					placeholder="请输入姓名"
					onChange={(event) => onChange({ ...value, name: event.target.value })}
				/>
				{showIssues && issueFor('name') ? <em>{issueFor('name')?.message}</em> : null}
			</label>

			<label className={`field ${showIssues && issueFor('department') ? 'has-issue' : ''}`}>
				<span>部门</span>
				<select
					name="department"
					value={value.department}
					onChange={(event) => onChange({ ...value, department: event.target.value })}
				>
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
				<input
					name="phone"
					value={value.phone}
					placeholder="请输入 11 位手机号"
					onChange={(event) => onChange({ ...value, phone: event.target.value })}
				/>
				{showIssues && issueFor('phone') ? <em>{issueFor('phone')?.message}</em> : null}
			</label>

			<label className={`field ${showIssues && issueFor('jobTitle') ? 'has-issue' : ''}`}>
				<span>职务</span>
				<input
					name="jobTitle"
					value={value.jobTitle}
					placeholder="例如：工程师"
					onChange={(event) => onChange({ ...value, jobTitle: event.target.value })}
				/>
				{showIssues && issueFor('jobTitle') ? <em>{issueFor('jobTitle')?.message}</em> : null}
			</label>

			<div className="actions">
				<button type="button" className="btn secondary" onClick={onBack}>
					返回
				</button>
				<button type="submit">下一步</button>
			</div>
		</form>
	);
}

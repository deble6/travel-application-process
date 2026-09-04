import { useEffect, useRef } from 'react';
import { TRIP_TYPES, type ApplicationContent, type FieldIssue } from '../types';

type Props = {
	value: ApplicationContent;
	issues: FieldIssue[];
	showIssues?: boolean;
	focusField?: string;
	onChange: (value: ApplicationContent) => void;
	onNext: () => void;
	onBack: () => void;
};

export default function ContentForm({
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
			<h1>申请内容</h1>
			<p className="subtitle">请填写本次差旅的行程和事由</p>

			<label className={`field ${showIssues && issueFor('destination') ? 'has-issue' : ''}`}>
				<span>目的地</span>
				<input
					name="destination"
					value={value.destination}
					placeholder="例如：上海"
					onChange={(event) => onChange({ ...value, destination: event.target.value })}
				/>
				{showIssues && issueFor('destination') ? <em>{issueFor('destination')?.message}</em> : null}
			</label>

			<label className={`field ${showIssues && issueFor('tripType') ? 'has-issue' : ''}`}>
				<span>出行类型</span>
				<select
					name="tripType"
					value={value.tripType}
					onChange={(event) => onChange({ ...value, tripType: event.target.value })}
				>
					<option value="">请选择出行类型</option>
					{TRIP_TYPES.map((item) => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
				</select>
				{showIssues && issueFor('tripType') ? <em>{issueFor('tripType')?.message}</em> : null}
			</label>

			<div className="field-row">
				<label className={`field ${showIssues && issueFor('startDate') ? 'has-issue' : ''}`}>
					<span>出发日期</span>
					<input
						name="startDate"
						type="date"
						value={value.startDate}
						onChange={(event) => onChange({ ...value, startDate: event.target.value })}
					/>
					{showIssues && issueFor('startDate') ? <em>{issueFor('startDate')?.message}</em> : null}
				</label>
				<label className={`field ${showIssues && issueFor('endDate') ? 'has-issue' : ''}`}>
					<span>返回日期</span>
					<input
						name="endDate"
						type="date"
						value={value.endDate}
						onChange={(event) => onChange({ ...value, endDate: event.target.value })}
					/>
					{showIssues && issueFor('endDate') ? <em>{issueFor('endDate')?.message}</em> : null}
				</label>
			</div>

			<label className="field">
				<span>预估费用（选填）</span>
				<input
					name="budget"
					value={value.budget}
					placeholder="例如：3500"
					onChange={(event) => onChange({ ...value, budget: event.target.value })}
				/>
			</label>

			<label className={`field ${showIssues && issueFor('purpose') ? 'has-issue' : ''}`}>
				<span>出差事由</span>
				<textarea
					name="purpose"
					rows={4}
					value={value.purpose}
					placeholder="请简要说明出差目的"
					onChange={(event) => onChange({ ...value, purpose: event.target.value })}
				/>
				{showIssues && issueFor('purpose') ? <em>{issueFor('purpose')?.message}</em> : null}
			</label>

			<div className="actions">
				<button type="button" className="btn secondary" onClick={onBack}>
					上一步
				</button>
				<button type="submit">去预览</button>
			</div>
		</form>
	);
}

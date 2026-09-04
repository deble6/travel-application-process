import { useEffect, useRef, useState, type FormEvent } from 'react';
import { TRIP_TYPES, type ApplicationContent, type FieldIssue } from '../types';
import { contentIssues } from '../validate';

type Props = {
	value: ApplicationContent;
	issues: FieldIssue[];
	focusField?: string;
};

function openDatePicker(event: { currentTarget: HTMLInputElement }) {
	const input = event.currentTarget;
	if (typeof input.showPicker === 'function') {
		try {
			input.showPicker();
		} catch {
			input.focus();
		}
	}
}

export default function ContentForm({ value, issues: initialIssues, focusField }: Props) {
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
		const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
		const action = submitter?.getAttribute('formaction') ?? '';
		if (action.includes('saveContentBack')) return;

		const data = new FormData(event.currentTarget);
		const nextIssues = contentIssues({
			destination: String(data.get('destination') ?? ''),
			startDate: String(data.get('startDate') ?? ''),
			endDate: String(data.get('endDate') ?? ''),
			tripType: String(data.get('tripType') ?? ''),
			purpose: String(data.get('purpose') ?? ''),
			budget: String(data.get('budget') ?? '')
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
			action="?/saveContent"
			data-sveltekit-reload=""
			onSubmit={onSubmit}
		>
			<h1>申请内容</h1>

			<label className={`field ${issueFor('destination') ? 'has-issue' : ''}`}>
				<span>目的地</span>
				<input
					name="destination"
					defaultValue={value.destination}
					placeholder="例如：上海"
					onChange={() => clearField('destination')}
				/>
				{issueFor('destination') ? <em>{issueFor('destination')?.message}</em> : null}
			</label>

			<label className={`field ${issueFor('tripType') ? 'has-issue' : ''}`}>
				<span>出行类型</span>
				<select name="tripType" defaultValue={value.tripType} onChange={() => clearField('tripType')}>
					{value.tripType ? null : <option value="" disabled hidden />}
					{TRIP_TYPES.map((item) => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
				</select>
				{issueFor('tripType') ? <em>{issueFor('tripType')?.message}</em> : null}
			</label>

			<div className="field-row">
				<label className={`field ${issueFor('startDate') ? 'has-issue' : ''}`}>
					<span>出发日期</span>
					<input
						name="startDate"
						type="date"
						defaultValue={value.startDate}
						onChange={() => clearField('startDate')}
						onClick={openDatePicker}
					/>
					{issueFor('startDate') ? <em>{issueFor('startDate')?.message}</em> : null}
				</label>
				<label className={`field ${issueFor('endDate') ? 'has-issue' : ''}`}>
					<span>返回日期</span>
					<input
						name="endDate"
						type="date"
						defaultValue={value.endDate}
						onChange={() => clearField('endDate')}
						onClick={openDatePicker}
					/>
					{issueFor('endDate') ? <em>{issueFor('endDate')?.message}</em> : null}
				</label>
			</div>

			<label className="field">
				<span>预估费用（选填）</span>
				<input name="budget" defaultValue={value.budget} placeholder="例如：3500" />
			</label>

			<label className={`field ${issueFor('purpose') ? 'has-issue' : ''}`}>
				<span>出差事由</span>
				<textarea
					name="purpose"
					rows={4}
					defaultValue={value.purpose}
					placeholder="请简要说明出差目的"
					onChange={() => clearField('purpose')}
				/>
				{issueFor('purpose') ? <em>{issueFor('purpose')?.message}</em> : null}
			</label>

			<div className="actions">
				<button type="submit" className="btn secondary" formAction="?/saveContentBack">
					上一步
				</button>
				<button type="submit">下一步</button>
			</div>
		</form>
	);
}

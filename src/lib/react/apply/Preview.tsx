import type { FieldIssue, FormSection, TravelDraft } from '../types';

type Props = {
	draft: TravelDraft;
	issues: FieldIssue[];
	onEdit: (section: FormSection, field?: string) => void;
	onSubmit: () => void;
	onBack: () => void;
};

const APPLICANT_FIELDS = [
	{ key: 'name', label: '姓名' },
	{ key: 'department', label: '部门' },
	{ key: 'phone', label: '联系电话' },
	{ key: 'jobTitle', label: '职务' }
] as const;

const CONTENT_FIELDS = [
	{ key: 'destination', label: '目的地' },
	{ key: 'tripType', label: '出行类型' },
	{ key: 'startDate', label: '出发日期' },
	{ key: 'endDate', label: '返回日期' },
	{ key: 'budget', label: '预估费用' },
	{ key: 'purpose', label: '出差事由' }
] as const;

export default function Preview({ draft, issues, onEdit, onSubmit, onBack }: Props) {
	function display(value: string) {
		return value.trim() ? value : '未填写';
	}

	function hasIssue(section: FormSection, field: string) {
		return issues.some((item) => item.section === section && item.field === field);
	}

	return (
		<div className="apply-card preview-card">
			<h1>预览确认</h1>
			<p className="subtitle">请核对填写内容，有问题可跳回对应表单修改</p>

			{issues.length > 0 ? (
				<div className="issue-box">
					<p>发现 {issues.length} 处需要修改：</p>
					<ul>
						{issues.map((item) => (
							<li key={`${item.section}-${item.field}`}>
								<button type="button" onClick={() => onEdit(item.section, item.field)}>
									{item.section === 'applicant' ? '申请人信息' : '申请内容'} · {item.label}
								</button>
								<span>{item.message}</span>
							</li>
						))}
					</ul>
				</div>
			) : (
				<p className="ok-box">信息完整，可以提交。</p>
			)}

			<section className="preview-section">
				<header>
					<h2>申请人信息</h2>
					<button type="button" className="link-btn" onClick={() => onEdit('applicant')}>
						去修改
					</button>
				</header>
				<dl>
					{APPLICANT_FIELDS.map((item) => (
						<div key={item.key} className={hasIssue('applicant', item.key) ? 'is-issue' : ''}>
							<dt>{item.label}</dt>
							<dd>{display(draft.applicant[item.key])}</dd>
						</div>
					))}
				</dl>
			</section>

			<section className="preview-section">
				<header>
					<h2>申请内容</h2>
					<button type="button" className="link-btn" onClick={() => onEdit('content')}>
						去修改
					</button>
				</header>
				<dl>
					{CONTENT_FIELDS.map((item) => (
						<div key={item.key} className={hasIssue('content', item.key) ? 'is-issue' : ''}>
							<dt>{item.label}</dt>
							<dd>
								{item.key === 'budget'
									? draft.content.budget.trim()
										? `¥ ${draft.content.budget}`
										: '未填写'
									: display(draft.content[item.key])}
							</dd>
						</div>
					))}
				</dl>
			</section>

			<div className="actions">
				<button type="button" className="btn secondary" onClick={onBack}>
					返回修改
				</button>
				<button type="button" disabled={issues.length > 0} onClick={onSubmit}>
					确认提交
				</button>
			</div>
		</div>
	);
}

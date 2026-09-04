import type { TravelDraft } from '../types';

type Props = {
	draft: TravelDraft;
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

export default function Preview({ draft }: Props) {
	function display(value: string) {
		return value.trim() ? value : '未填写';
	}

	return (
		<form className="apply-card preview-card" method="POST" data-sveltekit-reload="">
			<h1>预览确认</h1>

			<section className="preview-section">
				<header>
					<h2>申请人信息</h2>
					<button type="submit" className="link-btn" formAction="?/go" name="goto" value="applicant">
						去修改
					</button>
				</header>
				<dl>
					{APPLICANT_FIELDS.map((item) => (
						<div key={item.key}>
							<dt>{item.label}</dt>
							<dd>{display(draft.applicant[item.key])}</dd>
						</div>
					))}
				</dl>
			</section>

			<section className="preview-section">
				<header>
					<h2>申请内容</h2>
					<button type="submit" className="link-btn" formAction="?/go" name="goto" value="content">
						去修改
					</button>
				</header>
				<dl>
					{CONTENT_FIELDS.map((item) => (
						<div key={item.key}>
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
				<button type="submit" className="btn secondary" formAction="?/go" name="goto" value="content">
					返回修改
				</button>
				<button type="submit" formAction="?/submit">
					确认提交
				</button>
			</div>
		</form>
	);
}

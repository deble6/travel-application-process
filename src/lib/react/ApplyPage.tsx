import type { FieldIssue, SessionUser, TravelApplication, TravelDraft } from './types';
import ApplyFlow from './apply/ApplyFlow';
import MyDetail from './apply/MyDetail';
import MyList from './apply/MyList';
import Toast from './apply/Toast';

type Props = {
	user: SessionUser;
	draft: TravelDraft;
	applications: TravelApplication[];
	selectedId: string;
	view: 'form' | 'list';
	submitted: boolean;
	focusField?: string;
	form?: { message?: string; issues?: FieldIssue[] } | null;
};

export default function ApplyPage({
	user,
	draft,
	applications,
	selectedId,
	view,
	submitted,
	focusField,
	form
}: Props) {
	const selected = applications.find((item) => item.id === selectedId) ?? null;

	return (
		<div className="app-shell">
			<header className="topbar">
				<strong>差旅申请系统</strong>
				<div className="topbar-right">
					<span>
						{user.name} · 用户
					</span>
					<form method="POST" action="?/logout" data-sveltekit-reload="">
						<button className="btn secondary header-logout" type="submit">
							退出登录
						</button>
					</form>
				</div>
			</header>
			<main className="app-main">
				<div className="admin-page">
					<div className="admin-head">
						<div className="view-tabs">
							<a className={view === 'form' ? 'active' : ''} href="/apply" data-sveltekit-reload="">
								申请填写
							</a>
							<a
								className={view === 'list' ? 'active' : ''}
								href="/apply?view=list"
								data-sveltekit-reload=""
							>
								我的申请
							</a>
						</div>
					</div>

					{selected ? (
						<MyDetail item={selected} />
					) : view === 'list' ? (
						<MyList applications={applications} />
					) : (
						<ApplyFlow draft={draft} focusField={focusField} issues={form?.issues} />
					)}
				</div>
			</main>
			{submitted ? <Toast text="提交成功" /> : null}
		</div>
	);
}

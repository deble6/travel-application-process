import type { FieldIssue, SessionUser, TravelDraft } from './types';
import ApplyFlow from './apply/ApplyFlow';

type Props = {
	user: SessionUser;
	draft: TravelDraft;
	submitted: boolean;
	focusField?: string;
	form?: { message?: string; issues?: FieldIssue[] } | null;
};

export default function ApplyPage({ user, draft, submitted, focusField, form }: Props) {
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
				<ApplyFlow
					draft={draft}
					submitted={submitted}
					focusField={focusField}
					issues={form?.issues}
				/>
			</main>
		</div>
	);
}

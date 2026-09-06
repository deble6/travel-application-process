import { describe, expect, it } from 'vitest';
import { canApprove } from '$lib/react/types';
import { applicantIssues, collectIssues, contentIssues } from '$lib/react/validate';
import { adminStage, formatTime, hrStage } from '$lib/react/admin/status';
import { authenticate } from '$lib/server/users';
import { buildReport, formatMoney, formatPercent } from '$lib/react/admin/stats';
import { applicant, content, makeApplication, makeDraft } from '../../test/fixtures';

describe('登录规则', () => {
	it('账号密码角色齐全且匹配时登录成功', () => {
		const result = authenticate('hr', '123456', 'hr');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.user.name).toBe('赵人事');
			expect(result.user.role).toBe('hr');
		}
	});

	it('缺少字段时提示填写', () => {
		expect(authenticate('', '123456', 'user')).toEqual({
			ok: false,
			message: '请填写账号、密码并选择角色'
		});
	});

	it('角色无效时拒绝登录', () => {
		expect(authenticate('user', '123456', 'guest')).toEqual({
			ok: false,
			message: '角色无效'
		});
	});

	it('账号与角色不匹配时拒绝登录', () => {
		expect(authenticate('user', '123456', 'admin')).toEqual({
			ok: false,
			message: '账号、密码或角色不匹配'
		});
	});
});

describe('审批权限', () => {
	it('人事只能审批待人事申请', () => {
		expect(canApprove('hr', 'pending_hr')).toBe(true);
		expect(canApprove('hr', 'pending_admin')).toBe(false);
		expect(canApprove('hr', 'approved')).toBe(false);
		expect(canApprove('hr', 'rejected')).toBe(false);
	});

	it('管理员只能审批待管理员申请', () => {
		expect(canApprove('admin', 'pending_admin')).toBe(true);
		expect(canApprove('admin', 'pending_hr')).toBe(false);
		expect(canApprove('admin', 'approved')).toBe(false);
	});

	it('普通用户不能审批', () => {
		expect(canApprove('user', 'pending_hr')).toBe(false);
		expect(canApprove('user', 'pending_admin')).toBe(false);
	});
});

describe('表单校验', () => {
	it('申请人信息缺少必填项时给出对应错误', () => {
		const issues = applicantIssues({ name: '', department: '', phone: '', jobTitle: '' });
		expect(issues.map((item) => item.field)).toEqual(['name', 'department', 'phone', 'jobTitle']);
	});

	it('手机号必须是 11 位且以 1 开头', () => {
		const issues = applicantIssues({ ...applicant, phone: '123' });
		expect(issues).toEqual([
			expect.objectContaining({ field: 'phone', message: '请输入 11 位手机号' })
		]);
	});

	it('返回日期不能早于出发日期', () => {
		const issues = contentIssues({ ...content, endDate: '2026-09-01' });
		expect(issues).toEqual([
			expect.objectContaining({ field: 'endDate', message: '返回日期不能早于出发日期' })
		]);
	});

	it('完整草稿可以通过校验', () => {
		expect(collectIssues(makeDraft())).toEqual([]);
	});
});

describe('审批阶段', () => {
	it('待人事审批时管理员阶段未开始', () => {
		const item = makeApplication({ status: 'pending_hr' });
		expect(hrStage(item)).toBe('pending');
		expect(adminStage(item)).toBe('none');
	});

	it('人事通过后进入管理员待审批', () => {
		const item = makeApplication({
			status: 'pending_admin',
			hrComment: '人事同意',
			hrProcessedAt: '2026-09-06T03:00:00.000Z'
		});
		expect(hrStage(item)).toBe('approved');
		expect(adminStage(item)).toBe('pending');
	});

	it('人事驳回后管理员阶段保持未开始', () => {
		const item = makeApplication({
			status: 'rejected',
			comment: '资料不全',
			processedAt: '2026-09-06T03:00:00.000Z'
		});
		expect(hrStage(item)).toBe('rejected');
		expect(adminStage(item)).toBe('none');
	});

	it('管理员驳回时保留人事已通过记录', () => {
		const item = makeApplication({
			status: 'rejected',
			hrComment: '人事同意',
			hrProcessedAt: '2026-09-06T03:00:00.000Z',
			comment: '预算过高',
			processedAt: '2026-09-06T04:00:00.000Z'
		});
		expect(hrStage(item)).toBe('approved');
		expect(adminStage(item)).toBe('rejected');
	});
});

describe('统计规则', () => {
	it('按状态拆分待审批并计算通过率', () => {
		const report = buildReport([
			makeApplication({ id: '1', status: 'pending_hr', applicant: { ...applicant, department: '技术部' } }),
			makeApplication({ id: '2', status: 'pending_admin', applicant: { ...applicant, department: '市场部' } }),
			makeApplication({
				id: '3',
				status: 'approved',
				content: { ...content, budget: '1000' },
				applicant: { ...applicant, department: '技术部' }
			}),
			makeApplication({ id: '4', status: 'rejected', content: { ...content, budget: 'abc' } })
		]);

		expect(report.total).toBe(4);
		expect(report.pendingHr).toBe(1);
		expect(report.pendingAdmin).toBe(1);
		expect(report.pending).toBe(2);
		expect(report.approved).toBe(1);
		expect(report.rejected).toBe(1);
		expect(report.approvalRate).toBe(50);
		expect(report.budgetApproved).toBe(1000);
		expect(report.byDepartment.find((row) => row.name === '财务部')?.count).toBe(0);
	});

	it('没有已处理申请时通过率为空', () => {
		expect(formatPercent(buildReport([makeApplication()]).approvalRate)).toBe('—');
		expect(formatMoney(1200)).toBe('¥ 1,200');
	});
});

describe('时间格式', () => {
	it('格式化为本地日期时间', () => {
		expect(formatTime('2026-09-06T02:05:00.000Z')).toMatch(/^2026-09-06 \d{2}:05$/);
	});
});

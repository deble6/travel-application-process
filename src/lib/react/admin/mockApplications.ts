import type { TravelApplication } from '../types';

export const MOCK_APPLICATIONS: TravelApplication[] = [
	{
		id: 'a-001',
		username: 'user',
		applicant: {
			name: '李员工',
			department: '技术部',
			phone: '13800138000',
			jobTitle: '工程师'
		},
		content: {
			destination: '上海',
			startDate: '2026-09-10',
			endDate: '2026-09-12',
			tripType: '公务出差',
			purpose: '参加客户项目评审会议',
			budget: '3500'
		},
		status: 'pending',
		createdAt: '2026-09-04T10:20:00.000Z'
	},
	{
		id: 'a-002',
		username: 'user',
		applicant: {
			name: '李员工',
			department: '技术部',
			phone: '13800138000',
			jobTitle: '工程师'
		},
		content: {
			destination: '北京',
			startDate: '2026-08-18',
			endDate: '2026-08-20',
			tripType: '培训学习',
			purpose: '参加前端技术培训',
			budget: '2800'
		},
		status: 'approved',
		createdAt: '2026-08-12T09:10:00.000Z',
		comment: '同意参加培训',
		processedAt: '2026-08-13T02:30:00.000Z'
	},
	{
		id: 'a-003',
		username: 'zhao',
		applicant: {
			name: '赵市场',
			department: '市场部',
			phone: '13900139000',
			jobTitle: '客户经理'
		},
		content: {
			destination: '广州',
			startDate: '2026-09-16',
			endDate: '2026-09-18',
			tripType: '会议交流',
			purpose: '参加渠道合作洽谈会',
			budget: '4200'
		},
		status: 'pending',
		createdAt: '2026-09-03T15:40:00.000Z'
	},
	{
		id: 'a-004',
		username: 'qian',
		applicant: {
			name: '钱财务',
			department: '财务部',
			phone: '13700137000',
			jobTitle: '会计'
		},
		content: {
			destination: '成都',
			startDate: '2026-07-06',
			endDate: '2026-07-08',
			tripType: '其他',
			purpose: '分公司账务核对',
			budget: '1800'
		},
		status: 'rejected',
		createdAt: '2026-07-01T08:05:00.000Z',
		comment: '费用说明不足，请补充后再提交',
		processedAt: '2026-07-02T02:00:00.000Z'
	}
];

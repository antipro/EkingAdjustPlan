/**
 * Common Service for Plan List with Pagination
 */

import { request } from './request';

export interface PlanInfo {
  id: string;
  planName: string;
  planType: string;
  planTypeName: string;
  status: string;
  statusName: string;
  beginDatetime: string;
  policy: string;
  changeSummary: string;
  orgNames: string;
  orgIdList?: string[];
}

export interface PageInfo {
  pageSize: number;
  totalCount: number;
  totalPageNum: number;
  pageNum: number;
}

export interface PlanListResponse {
  code: string;
  data: {
    dataInfo: PlanInfo[];
    pageInfo: PageInfo;
  };
  serial: string;
  sucMsg: string;
}

const mockPlans: PlanInfo[] = [
  {
    id: "1241075063734665216",
    planName: "按2026年医保物价管理条例要求变更物价",
    planType: "100",
    planTypeName: "价表",
    status: "0",
    statusName: "草稿",
    beginDatetime: "2026-10-01 00:00:00",
    policy: "江苏省医保医疗服务价格调整公式[202607]",
    changeSummary: "启用0；调整1；停用0",
    orgNames: "智慧云医院，温泉镇分院，南河镇分院",
    orgIdList: ["711912746777575424", "909521624921800704", "1037000793053462528"]
  },
  {
    id: "1241075063734665217",
    planName: "2026年第一季度临床项目调整计划",
    planType: "200",
    planTypeName: "临床",
    status: "1",
    statusName: "发布",
    beginDatetime: "2026-01-01 00:00:00",
    policy: "临床项目管理办法[2026]",
    changeSummary: "启用3；调整5；停用4",
    orgNames: "不限",
    orgIdList: []
  },
  {
    id: "1241075063734665218",
    planName: "年度价表维护计划",
    planType: "100",
    planTypeName: "价表",
    status: "2",
    statusName: "生效",
    beginDatetime: "2025-09-30 00:00:00",
    policy: "年度维护规程",
    changeSummary: "启用10；调整20；停用5",
    orgNames: "智慧云医院",
    orgIdList: ["711912746777575424"]
  },
  {
    id: "1241075063734665219",
    planName: "2026年临床拓展项目试点计划",
    planType: "400",
    planTypeName: "临床拓展",
    status: "0",
    statusName: "草稿",
    beginDatetime: "2026-06-01 00:00:00",
    policy: "临床拓展项目管理细则[2026]",
    changeSummary: "启用2；调整0；停用0",
    orgNames: "智慧云医院",
    orgIdList: ["711912746777575424"]
  },
  {
    id: "1241075063734665220",
    planName: "已撤回的临床项目调整",
    planType: "200",
    planTypeName: "临床",
    status: "3",
    statusName: "撤回",
    beginDatetime: "2026-03-01 00:00:00",
    policy: "临床项目管理办法[2026]",
    changeSummary: "启用1；调整2；停用1",
    orgNames: "温泉镇分院",
    orgIdList: ["909521624921800704"]
  }
];

export const planService = {
  getPlans: async (params: { pageNum: number; pageSize: number; planType?: string }): Promise<PlanListResponse> => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const query = new URLSearchParams({
        pageNum: params.pageNum.toString(),
        pageSize: params.pageSize.toString(),
        ...(params.planType && { planType: params.planType })
      });
      const response = await request<any>(`/api/adjust/plan/page?${query}`);
      return response;
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = mockPlans;
    if (params.planType) {
      filtered = mockPlans.filter(p => p.planType === params.planType);
    }

    const start = (params.pageNum - 1) * params.pageSize;
    const end = start + params.pageSize;
    const dataInfo = filtered.slice(start, end);

    return {
      code: "SUCCESS",
      data: {
        dataInfo,
        pageInfo: {
          pageSize: params.pageSize,
          totalCount: filtered.length,
          totalPageNum: Math.ceil(filtered.length / params.pageSize),
          pageNum: params.pageNum,
        }
      },
      serial: "dom-mdm_" + Math.random().toString(36).substring(7),
      sucMsg: "操作成功"
    };
  },
  savePlan: async (data: {
    id?: string;
    beginDatetime: string;
    planType: string;
    planName: string;
    policy: string;
    orgIdList: string[];
  }) => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>('/api/adjust/plan/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response;
    }
    // Mock success
    console.log('Mock Save Plan:', data);
    return { code: 'SUCCESS', sucMsg: '保存成功' };
  },
  submitPlan: async (planId: string) => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>(`/api/adjust/plan/submit?planId=${planId}`, { method: 'POST' });
      return response;
    }
    return { code: 'SUCCESS', sucMsg: '提交成功' } as any;
  },
  withdrawPlan: async (planId: string) => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>(`/api/adjust/plan/withdraw?planId=${planId}`, { method: 'POST' });
      return response;
    }
    return { code: 'SUCCESS', sucMsg: '撤回成功' } as any;
  },
  deletePlan: async (planId: string) => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>(`/api/adjust/plan/delete?planId=${planId}`, { method: 'POST' });
      return response;
    }
    return { code: 'SUCCESS', sucMsg: '删除成功' } as any;
  },
  cancelPlan: async (planId: string) => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>(`/api/adjust/plan/cancel?planId=${planId}`, { method: 'POST' });
      return response;
    }
    return { code: 'SUCCESS', sucMsg: '作废成功' } as any;
  },
  copyPlan: async (planId: string) => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>(`/api/adjust/plan/copy?planId=${planId}`, { method: 'POST' });
      return response;
    }
    return { code: 'SUCCESS', sucMsg: '复制成功' } as any;
  }
};

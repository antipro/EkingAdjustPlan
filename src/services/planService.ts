/**
 * Common Service for Plan List with Pagination
 */

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
      const response = await fetch(`/api/plans?${query}`);
      return response.json();
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
  }
};

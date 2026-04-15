/**
 * Mock Service for 临床价表调整日志 (Clinical Price List Adjustment Log)
 */

export interface LogEntry {
  id: string;
  adjustPlanId: string;
  itemType: string;
  itemTypeName: string;
  itemCode: string;
  itemName: string;
  itemClassCode: string;
  unit: string;
  spec: string;
  planBeginTime: string;
  adjustType: string;
  changes: string;
  childAdjustId?: string;
  replaceItemCode?: string;
  replaceItemName?: string;
  beginTime: string;
  result: number;
  failureReason?: string;
}

export interface LogListResponse {
  code: string;
  data: {
    dataInfo: {
      data: LogEntry[];
      totalNum: number;
      totalPage: number;
      pageSize: number;
      pageNum: number;
    }
  };
  serial: string;
  sucMsg: string;
}

const logData: LogEntry[] = [
  {
    id: "1241787199993675776",
    adjustPlanId: "1241786916454531072",
    itemName: "肠镜（体检1）",
    itemType: "200",
    adjustType: "U",
    itemCode: "C001219",
    planBeginTime: "2026-10-01 00:00:00",
    changes: "{\"clinicName\":{\"before\":\"肠镜（体检）\",\"after\":\"肠镜（体检1）\"},\"daysLimit\":{\"before\":3,\"after\":5}}",
    itemTypeName: "临床项目",
    beginTime: "2026-04-15 13:41:40",
    result: 1,
    itemClassCode: "D",
    unit: "次",
    spec: "/"
  },
  {
    id: "1241392974827356160",
    adjustPlanId: "1241369796516249600",
    itemName: "肠镜（体检）",
    itemType: "200",
    adjustType: "U",
    itemCode: "C001219",
    planBeginTime: "2026-10-01 00:00:00",
    changes: "{}",
    itemTypeName: "临床项目",
    beginTime: "",
    result: 0,
    itemClassCode: "D",
    unit: "次",
    spec: "/"
  },
  {
    id: "1241100460979388416",
    adjustPlanId: "1241075063734665216",
    itemType: "100",
    adjustType: "U",
    itemCode: "I243035",
    changes: "{\"itemName\":{\"before\":\"234\",\"after\":\"测试项目名称\"}}",
    spec: "324",
    result: 1,
    itemName: "测试项目名称",
    unit: "次",
    planBeginTime: "2026-10-01 00:00:00",
    itemTypeName: "价表项目",
    beginTime: "2026-04-15 11:34:48",
    itemClassCode: "C"
  }
];

export interface AdjustExecuteResultQueryParam {
  beginDate?: string;
  endDate?: string;
  queryString?: string;
  itemType?: string;
  adjustType?: string;
  pageNum: number;
  pageSize: number;
}

export const logService = {
  getLogs: async (params: AdjustExecuteResultQueryParam): Promise<LogListResponse> => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await fetch('/api/adjust/apply/result/page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });
      return response.json();
    }
    
    return {
      code: "SUCCESS",
      data: {
        dataInfo: {
          data: logData,
          totalNum: logData.length,
          totalPage: 1,
          pageSize: params.pageSize,
          pageNum: params.pageNum
        }
      },
      serial: "mock-serial",
      sucMsg: "操作成功"
    };
  },
};

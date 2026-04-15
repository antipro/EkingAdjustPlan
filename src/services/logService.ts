/**
 * Mock Service for 临床价表调整日志 (Clinical Price List Adjustment Log)
 */

export interface LogEntry {
  id: string;
  adjustPlanId: string;
  itemName: string;
  itemType: string;
  adjustType: string;
  itemCode: string;
  changes: string;
  itemTypeName: string;
  itemClassName: string;
  unit: string;
  spec: string;
  planBeginTime: string;
  latestLog: {
    executionTime: string;
    result: number;
    id: string;
  };
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
    id: "1",
    adjustPlanId: "p1",
    itemName: "前牙美容修复术",
    itemType: "200",
    adjustType: "A",
    itemCode: "C00903",
    changes: "{}",
    itemTypeName: "临床",
    itemClassName: "处置",
    unit: "套",
    spec: "",
    planBeginTime: "2026-04-01 00:00:00",
    latestLog: {
      executionTime: "2026-04-01 00:01:23",
      result: 1,
      id: "l1"
    }
  },
  {
    id: "2",
    adjustPlanId: "p1",
    itemName: "多学科诊疗费",
    itemType: "200",
    adjustType: "U",
    itemCode: "C00904",
    changes: "{}",
    itemTypeName: "临床",
    itemClassName: "其他",
    unit: "套",
    spec: "",
    planBeginTime: "2026-04-01 00:00:00",
    latestLog: {
      executionTime: "2026-04-01 00:01:23",
      result: 1,
      id: "l2"
    }
  },
  {
    id: "3",
    adjustPlanId: "p1",
    itemName: "挂号费",
    itemType: "100",
    adjustType: "D",
    itemCode: "C00905",
    changes: "{}",
    itemTypeName: "价表",
    itemClassName: "其他",
    unit: "次",
    spec: "",
    planBeginTime: "2026-04-01 00:00:00",
    latestLog: {
      executionTime: "2026-04-01 00:01:23",
      result: 1,
      id: "l3"
    }
  },
  {
    id: "4",
    adjustPlanId: "p1",
    itemName: "诊疗费",
    itemType: "100",
    adjustType: "A",
    itemCode: "C00906",
    changes: "{}",
    itemTypeName: "价表",
    itemClassName: "其他",
    unit: "次",
    spec: "",
    planBeginTime: "2026-04-01 00:00:00",
    latestLog: {
      executionTime: "2026-04-01 00:01:23",
      result: 0,
      id: "l4"
    }
  },
  {
    id: "5",
    adjustPlanId: "p1",
    itemName: "门诊病历手册",
    itemType: "100",
    adjustType: "U",
    itemCode: "C00907",
    changes: "{}",
    itemTypeName: "价表",
    itemClassName: "其他",
    unit: "册",
    spec: "",
    planBeginTime: "2026-04-01 00:00:00",
    latestLog: {
      executionTime: "2026-04-01 00:01:23",
      result: 0,
      id: "l5"
    }
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

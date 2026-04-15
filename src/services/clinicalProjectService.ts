/**
 * Mock Service for 临床项目调整计划 (Clinical Project Adjustment Plan)
 */

export interface ClinicalPlan {
  id: string;
  effectiveTime: string;
  linkedPlan: string;
  name: string;
  stats: string;
  scope: string;
  status: 'Draft' | 'Published' | 'Active' | 'Obsolete';
}

export interface ClinicalItem {
  key: string;
  active?: string;
  source?: string;
  code?: string;
  category?: string;
  name?: string;
  unit?: string;
  totalPrice?: string;
  linkedItems?: string;
  highRisk?: string;
  specialType?: string;
  remarks?: string;
  infoChanges?: string;
  // New fields for adjustment details
  adjustType?: string;
  changes?: string;
  detail?: any;
  priceItemList?: any[];
}

const clinicalPlanList: ClinicalPlan[] = [
  {
    id: '1',
    effectiveTime: '2026-02-01 00:00',
    linkedPlan: '是 (价表项目调整: 按2026年医保物价...)',
    name: '按2026年医保物价管理条例要求变更物价项目...',
    stats: '启用3; 调整5; 停用4',
    scope: '不限',
    status: 'Draft',
  },
  {
    id: '2',
    effectiveTime: '2026-01-01 00:00',
    linkedPlan: '否',
    name: '按2026年医保物价管理条例要求变更物价项目...',
    stats: '启用3; 停用4',
    scope: '鑫亿云医院; 鑫亿未来医院',
    status: 'Published',
  },
];

const clinicalTableData: ClinicalItem[] = [
  {
    key: '1',
    detail: {
      clinicName: "前牙美容修复术",
      clinicCode: "C00903",
      clinicClassName: "处置",
      unit: "套",
      priceList: [
        {
          itemCode: "P001",
          itemName: "前牙美容修复术",
          quantity: 1,
          unit: "套",
          id: "p1"
        },
        {
          itemCode: "P002",
          itemName: "术中护理",
          quantity: 1,
          unit: "次",
          id: "p2"
        }
      ]
    },
    active: '否',
    source: '价表联动新增',
  },
];

const adjustClinicalTableData: ClinicalItem[] = [
  {
    key: '1',
    adjustType: 'U',
    changes: '{}',
    priceItemList: [
      {
        outRcptName: "检查费",
        itemClassName: "检查",
        itemCode: "I200416",
        changes: "{}",
        remark: "【项目内涵：】含计算机图文处理、储存；【说明：】与\"计算机图文报告（220800008）\"不能同时收取;",
        wbCode: "IINRX()",
        spec: "/",
        priceList: [
          {
            retaBasicPrice: 20,
            priceCode: "220800009",
            processTimeStamp: 1745750946302,
            priceLevelCode: "3",
            province: "320000",
            itemCode: "I200416",
            beginTime: "2023-05-18 21:26:32",
            id: "856686285648035840",
            provinceName: "江苏省",
            priceLevelUniqueCode: "320000_3"
          },
          {
            retaBasicPrice: 10,
            priceCode: "220800009",
            processTimeStamp: 1745750946308,
            priceLevelCode: "2",
            province: "320000",
            itemCode: "I200416",
            beginTime: "2023-11-13 16:02:00",
            id: "921472041658351616",
            provinceName: "江苏省",
            priceLevelUniqueCode: "320000_2"
          }
        ],
        itemName: "彩色胶片报告",
        statisTypeName: "其它检查费",
        inRcptCode: "E",
        hpFeeName: "临床诊断项目费",
        id: "856686285635452928",
        mnBillQty: 1,
        nationChargeItemName: "彩色胶片报告",
        processTimeStamp: 1745750946288,
        catalogList: [
          { srvCtlName: "云医院", id: "711912746777575424" },
          { srvCtlName: "南河镇分院", id: "1037000793053462528" },
          { srvCtlName: "模拟医院", id: "909521624921800704" }
        ],
        adjustType: "U",
        sybChargeItemCode: "220800009",
        hpFeeType: "8",
        reviewStatusName: "未审核",
        unit: "片",
        inRcptName: "检查费",
        statisTypeCode: "1003",
        itemClass: "D",
        outRcptCode: "E",
        nationChargeItemCode: "002208000060000",
        pyCode: "CSJPBGCS",
        status: 0
      },
      {
        outRcptName: "检查费",
        itemClassName: "检查",
        itemCode: "I201900",
        changes: "{}",
        remark: "【项目内涵：】含活检；",
        wbCode: "YTQS",
        spec: "/",
        priceList: [
          {
            retaBasicPrice: 180,
            priceCode: "310903005",
            processTimeStamp: 1692707689170,
            priceLevelCode: "3",
            province: "320000",
            itemCode: "I201900",
            beginTime: "2023-05-18 21:25:00",
            id: "856685897440034816",
            provinceName: "江苏省",
            priceLevelUniqueCode: "320000_3"
          }
        ],
        itemName: "纤维结肠镜检查",
        statisTypeName: "其它检查费",
        inRcptCode: "E",
        hpFeeName: "临床诊断项目费",
        id: "856685897314205696",
        mnBillQty: 1,
        processTimeStamp: 1692707689153,
        catalogList: [
          { srvCtlName: "云医院", id: "711912746777575424" }
        ],
        adjustType: "U",
        sybChargeItemCode: "310903005",
        hpFeeType: "8",
        reviewStatusName: "未审核",
        unit: "次",
        inRcptName: "检查费",
        statisTypeCode: "1003",
        itemClass: "D",
        outRcptCode: "E",
        nationChargeItemCode: "003109030050000",
        pyCode: "XWJCJJC",
        status: 0
      }
    ],
    detail: {
      clinicName: "肠镜（体检）",
      processTimeStamp: 1775875877540,
      inpEnable: "1",
      empNo: "000003",
      wbCode: "YTPY",
      orderIndicators: "0,1",
      priceList: [
        {
          itemClassCode: "D",
          itemName: "彩色胶片报告",
          unit: "片",
          quantity: 1,
          clinicClassCode: "D",
          itemCode: "I200416",
          clinicCode: "C001219",
          id: "902330788345851904",
          isHostItem: 0,
          spec: "/",
          serialNo: "3"
        },
        {
          itemClassCode: "D",
          itemName: "纤维结肠镜检查",
          unit: "次",
          quantity: 1,
          clinicClassCode: "D",
          itemCode: "I201900",
          clinicCode: "C001219",
          id: "902330788345851905",
          isHostItem: 0,
          spec: "/",
          serialNo: "2"
        },
        {
          itemClassCode: "D",
          itemName: "消化系统(电子纤维内镜加收)",
          unit: "次",
          quantity: 1,
          clinicClassCode: "D",
          itemCode: "I201856",
          clinicCode: "C001219",
          id: "902330788350046208",
          isHostItem: 0,
          spec: "/",
          serialNo: "1"
        }
      ],
      clinicClassCode: "D",
      clinicClassName: "检查",
      lastModifyTime: "2026-04-11 10:51:17",
      daysLimit: 3,
      clinicCode: "C001219",
      id: "902330788320686080",
      continueFlag: "0",
      outpEnable: "1",
      pyCode: "CJTJ",
      lastUpdateTime: "2026-04-11 10:51:17"
    }
  },
];

export const clinicalProjectService = {
  getPlans: async () => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await fetch('/adjust/clinical-plans');
      return response.json();
    }
    return clinicalPlanList;
  },
  getItems: async (params: { planId: string; queryString: string; adjustTypes: string[]; pageNum: number; pageSize: number }) => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await fetch('/api/adjust/clinic/detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return response.json();
    }
    // Mock logic based on adjustTypes
    if (params.adjustTypes.includes('I')) return clinicalTableData;
    if (params.adjustTypes.includes('U')) return adjustClinicalTableData;
    return [];
  },
  deleteItems: async (params: { planId: string; idList: string[] }): Promise<{ code: string; sucMsg: string }> => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await fetch('/adjust/clinical-items/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return response.json();
    }
    // Mock success
    console.log('Mock Batch Delete:', params);
    return { code: 'SUCCESS', sucMsg: '批量删除成功' };
  }
};

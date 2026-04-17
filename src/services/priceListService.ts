/**
 * Mock Service for 价表项目调整计划 (Price List Item Adjustment Plan)
 */

import { request } from './request';

export interface PricePlan {
  id: string;
  effectiveTime: string;
  name: string;
  policy: string;
  stats: string;
  scope: string;
  status: 'Draft' | 'Published' | 'Active' | 'Obsolete';
}

export interface PriceItem {
  key: string;
  id?: string;
  active?: string;
  code?: string;
  name?: string;
  spec?: string;
  unit?: string;
  price3?: string;
  price2?: string;
  price1?: string;
  oldPrice3?: string;
  oldPrice2?: string;
  oldPrice1?: string;
  newPrice3?: string;
  newPrice2?: string;
  newPrice1?: string;
  natCode?: string;
  natName?: string;
  itemCode?: string;
  category?: string;
  repCode?: string;
  repName?: string;
  repUnit?: string;
  remarks?: string;
  otherChanges?: string;
  repItemCode?: string;
  status?: string | number;
  // New fields for adjustment details
  adjustType?: string;
  changes?: string;
  changeSummary?: string;
  detail?: any;
  priceLevelList?: any[];
  clinicList?: any[];
  origPrice1?: any;
  origPrice2?: any;
  origPrice3?: any;
}

export interface LinkedClinicalItem {
  clinicCode: string;
  clinicName: string;
  key: string;
  priceItemId?: string;
  code: string;
  category: string;
  name: string;
  linkedItems: string;
  adjustType: string;
}

const planList: PricePlan[] = [
  {
    id: '1',
    effectiveTime: '2026-02-01 00:00',
    name: '按2026年医保物价管理条例要求变更物价项目',
    policy: '江苏省医保医疗服务价格调整公式[202607...',
    stats: '启用3; 调整5; 停用4',
    scope: '不限',
    status: 'Draft',
  },
  {
    id: '2',
    effectiveTime: '2026-01-01 00:00',
    name: '按2026年医保物价管理条例要求变更物价项目',
    policy: '江苏省医保医疗服务价格调整公式[202607...',
    stats: '启用3; 停用4',
    scope: '鑫亿云医院; 鑫亿未来医院',
    status: 'Published',
  },
  {
    id: '3',
    effectiveTime: '2025-09-30 00:00',
    name: '调整价表项目',
    policy: '江苏省医保医疗服务价格调整公式[202607...',
    stats: '停用4',
    scope: '不限',
    status: 'Active',
  },
  {
    id: '4',
    effectiveTime: '2025-09-30 00:00',
    name: '调整价表项目',
    policy: '江苏省医保医疗服务价格调整公式[202607...',
    stats: '停用4',
    scope: '不限',
    status: 'Obsolete',
  },
];

const tableData: PriceItem[] = [
  {
    key: '1',
    active: '否',
    code: '20251121001',
    name: '前牙美容修复术',
    spec: '/',
    unit: '套',
    price3: '200',
    price2: '180',
    price1: '',
    natCode: '001109000010000',
    natName: '前牙美容修复术',
    remarks: '指医务人员技术劳务性服务',
  },
  {
    key: '2',
    active: '否',
    code: '20251121002',
    name: '多学科诊疗费',
    spec: '/',
    unit: '套',
    price3: '48',
    price2: '32',
    price1: '',
    natCode: '001109000010000',
    natName: '多学科诊疗费',
    remarks: '含诊查、护理等',
  },
];

const adjustTableData: PriceItem[] = [
  {
    key: '1',
    adjustType: 'U',
    changes: '{"itemName":{"before":"234","after":"测试项目名称"}}',
    priceLevelList: [],
    clinicList: [],
    detail: {
      outRcptName: "诊察费",
      processTimeStamp: 1776066839196,
      itemClassName: "检验",
      itemCode: "I243035",
      hpFeeType: "1",
      wbCode: "234",
      spec: "324",
      priceList: [
        {
          retaBasicPrice: 23,
          priceCode: "4234",
          processTimeStamp: 1776066839335,
          priceLevelCode: "1",
          province: "320000",
          itemCode: "I243035",
          beginTime: "2026-04-10 11:39:09",
          id: "2042447265439682561",
          provinceName: "江苏省",
          priceLevelUniqueCode: "320000_1"
        }
      ],
      reviewStatusName: "未审核",
      itemName: "234",
      unit: "次",
      inRcptName: "诊察费",
      statisTypeCode: "1207",
      statisTypeName: "微波治疗",
      inRcptCode: "Q",
      itemClass: "C",
      outRcptCode: "Q",
      hpFeeName: "一般医疗服务费",
      id: "2042447265188024322",
      mnBillQty: 1,
      pyCode: "234",
      status: 0
    }
  },
];

const deactivateTableData: PriceItem[] = [
  {
    id: 'deactivate_1',
    key: '1',
    active: '否',
    code: '20251121001',
    name: '前牙美容修复术',
    spec: '/',
    unit: '套',
    itemCode: '10000',
    category: '处置',
    repCode: '',
    repName: '',
    repUnit: '',
    repItemCode: '',
    status: '已完成',
    clinicList: [
      {
        id: 'clinic_1',
        clinicCode: 'C001',
        clinicClassName: '处置',
        clinicName: '前牙美容修复临床项目',
        adjustType: '',
      },
      {
        id: 'clinic_2',
        clinicCode: 'C002',
        clinicClassName: '处置',
        clinicName: '前牙美容修复辅助项目',
        adjustType: '替换',
      }
    ]
  },
];

const linkedClinicalData: LinkedClinicalItem[] = [
  {
    key: '1',
    clinicCode: '20011',
    clinicName: 'EB病毒抗体六联检',
    code: '20011',
    category: '检验',
    name: 'EB病毒抗体六联检',
    linkedItems: 'EB病毒抗体 (早期抗原IgM) x1; EB病毒抗体 (核心抗原Igc) x1; E...',
    adjustType: '',
  },
];

export const priceListService = {
  getPlans: async () => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>('/adjust/price-plans');
      return response;
    }
    return planList;
  },
  getItems: async (params: { planId: string; queryString: string; adjustTypes: string[]; planStatus: string[]; pageNum: number; pageSize: number }) => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>('/api/adjust/price/detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return response;
    }
    // Mock logic based on adjustTypes
    if (params.adjustTypes.includes('I')) return tableData;
    if (params.adjustTypes.includes('U')) return adjustTableData;
    if (params.adjustTypes.includes('D')) return deactivateTableData;
    return [];
  },
  getLinkedClinicalItems: async () => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>('/adjust/linked-clinical-items');
      return response;
    }
    return linkedClinicalData;
  },
  batchSave: async (params: { planId: string; itemList: PriceItem[] }): Promise<{ code: string; sucMsg: string }> => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>('/api/adjust/price/batch/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return response;
    }
    // Mock success
    console.log('Mock Batch Save Price:', params);
    return { code: 'SUCCESS', sucMsg: '保存成功' };
  },
  batchDelete: async (params: { planId: string; idList: string[] }): Promise<{ code: string; sucMsg: string }> => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>('/api/adjust/item/batch-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return response;
    }
    // Mock success
    console.log('Mock Batch Delete Price:', params);
    return { code: 'SUCCESS', sucMsg: '删除成功' };
  },
  queryClinicItemByPriceCode: async (itemCode: string) => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>(`/api/clinic-item-dict/queryClinicItemByPriceCode?itemCode=${itemCode}`);
      return response;
    }
    // Mock data
    return {
      code: 'SUCCESS',
      data: {
        dataInfo: [
          {
            clinicName: "彩色多普勒超声常规检查（胆）",
            stopFlag: "0",
            processTimeStamp: 1775728936951,
            inpEnable: "1",
            empNo: "000003",
            wbCode: "GIJNQRSTQS",
            orderIndicators: "0",
            unit: "次",
            internetClinicFlag: "0",
            clinicClassCode: "D",
            lastModifyTime: "2026-04-09 18:02:16",
            clinicCode: "245933",
            id: "856691127418355712",
            continueFlag: "0",
            highRiskFlag: 0,
            outpEnable: "1",
            pyCode: "CSDPLCSCGJCD",
            lastUpdateTime: "2026-04-09 18:02:16"
          }
        ]
      },
      sucMsg: "操作成功"
    };
  }
};

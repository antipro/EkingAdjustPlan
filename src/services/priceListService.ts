/**
 * Mock Service for 价表项目调整计划 (Price List Item Adjustment Plan)
 */

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
  active: string;
  code: string;
  name: string;
  specs: string;
  unit: string;
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
  remarks?: string;
  otherChanges?: string;
  itemCode?: string;
  category?: string;
  repCode?: string;
  repName?: string;
  repUnit?: string;
  repItemCode?: string;
  status?: string;
}

export interface LinkedClinicalItem {
  key: string;
  code: string;
  category: string;
  name: string;
  linkedItems: string;
  processType: string;
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
    specs: '/',
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
    specs: '/',
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
    active: '否',
    code: '20251121001',
    name: '前牙美容修复术',
    specs: '/',
    unit: '套',
    oldPrice3: '200',
    oldPrice2: '180',
    oldPrice1: '',
    newPrice3: '180',
    newPrice2: '160',
    newPrice1: '',
    otherChanges: '项目名称: 前牙美容修复术 -> 前牙美容修复术...',
  },
];

const deactivateTableData: PriceItem[] = [
  {
    key: '1',
    active: '否',
    code: '20251121001',
    name: '前牙美容修复术',
    specs: '/',
    unit: '套',
    itemCode: '10000',
    category: '处置',
    repCode: '',
    repName: '',
    repUnit: '',
    repItemCode: '',
    status: '已完成',
  },
];

const linkedClinicalData: LinkedClinicalItem[] = [
  {
    key: '1',
    code: '20011',
    category: '检验',
    name: 'EB病毒抗体六联检',
    linkedItems: 'EB病毒抗体 (早期抗原IgM) x1; EB病毒抗体 (核心抗原Igc) x1; E...',
    processType: '',
  },
];

export const priceListService = {
  getPlans: async () => planList,
  getItems: async (tab: string) => {
    if (tab === '1') return tableData;
    if (tab === '2') return adjustTableData;
    if (tab === '3') return deactivateTableData;
    return [];
  },
  getLinkedClinicalItems: async () => linkedClinicalData,
};

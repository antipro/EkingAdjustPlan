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
  active: string;
  source: string;
  code: string;
  category: string;
  name: string;
  unit: string;
  totalPrice: string;
  linkedItems: string;
  highRisk?: string;
  specialType?: string;
  remarks?: string;
  infoChanges?: string;
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
    active: '否',
    source: '价表联动新增',
    code: 'C00903',
    category: '处置',
    name: '前牙美容修复术',
    unit: '套',
    totalPrice: '180',
    linkedItems: '前牙美容修复术: 150; 术中护理: 30',
    highRisk: '是',
    specialType: '',
    remarks: '',
  },
];

const adjustClinicalTableData: ClinicalItem[] = [
  {
    key: '1',
    active: '否',
    source: '价表联动替换',
    code: 'C00903',
    category: '处置',
    name: '前牙美容修复术',
    unit: '套',
    totalPrice: '180',
    linkedItems: '前牙美容修复术: 150; 术中护理: 30',
    infoChanges: '项目名称: 前牙美容修复术->前牙美容修复手术; XX变动项XX: [空]->SS变动后信息XXX',
  },
];

export const clinicalProjectService = {
  getPlans: async () => clinicalPlanList,
  getItems: async (tab: string) => {
    if (tab === '1') return clinicalTableData;
    if (tab === '2') return adjustClinicalTableData;
    return [];
  },
};

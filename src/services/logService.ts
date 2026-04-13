/**
 * Mock Service for 临床价表调整日志 (Clinical Price List Adjustment Log)
 */

export interface LogEntry {
  key: string;
  category: string;
  code: string;
  projectCategory: string;
  name: string;
  unit: string;
  specs: string;
  planEffectiveTime: string;
  adjustmentType: string;
  status: string;
  effectiveTime: string;
}

const logData: LogEntry[] = [
  {
    key: '1',
    category: '临床',
    code: 'C00903',
    projectCategory: '处置',
    name: '前牙美容修复术',
    unit: '套',
    specs: '',
    planEffectiveTime: '2026-04-01 00:00:00',
    adjustmentType: '启用',
    status: '成功',
    effectiveTime: '2026-04-01 00:01:23',
  },
  {
    key: '2',
    category: '临床',
    code: 'C00904',
    projectCategory: '其他',
    name: '多学科诊疗费',
    unit: '套',
    specs: '',
    planEffectiveTime: '2026-04-01 00:00:00',
    adjustmentType: '调整',
    status: '成功',
    effectiveTime: '2026-04-01 00:01:23',
  },
  {
    key: '3',
    category: '价表',
    code: 'C00905',
    projectCategory: '其他',
    name: '挂号费',
    unit: '次',
    specs: '',
    planEffectiveTime: '2026-04-01 00:00:00',
    adjustmentType: '停用',
    status: '成功',
    effectiveTime: '2026-04-01 00:01:23',
  },
  {
    key: '4',
    category: '价表',
    code: 'C00906',
    projectCategory: '其他',
    name: '诊疗费',
    unit: '次',
    specs: '',
    planEffectiveTime: '2026-04-01 00:00:00',
    adjustmentType: '启用',
    status: '失败',
    effectiveTime: '',
  },
  {
    key: '5',
    category: '价表',
    code: 'C00907',
    projectCategory: '其他',
    name: '门诊病历手册',
    unit: '册',
    specs: '',
    planEffectiveTime: '2026-04-01 00:00:00',
    adjustmentType: '调整',
    status: '失败',
    effectiveTime: '',
  },
];

export const logService = {
  getLogs: async () => logData,
};

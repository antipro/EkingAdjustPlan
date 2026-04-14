/**
 * Mock Service for 临床项目综合基础维护 (Clinical Project Comprehensive Basic Maintenance)
 */

export interface MaintenanceItem {
  key: string;
  code: string;
  category: string;
  name: string;
  unit: string;
  price: string;
  linkedPriceItems: string;
  isHighRisk: string;
  isSurgery: string;
  isAnesthesia: string;
  isMaterial: string;
  isDrug: string;
}

const maintenanceData: MaintenanceItem[] = [
  {
    key: '1',
    code: 'C00903',
    category: '处置',
    name: '前牙美容修复术',
    unit: '套',
    price: '180',
    linkedPriceItems: '前牙美容修复术: 150; 术中护理: 30',
    isHighRisk: '是',
    isSurgery: '否',
    isAnesthesia: '否',
    isMaterial: '否',
    isDrug: '否',
  },
  {
    key: '2',
    code: 'C00904',
    category: '其他',
    name: '多学科诊疗费',
    unit: '套',
    price: '50',
    linkedPriceItems: '多学科诊疗费:50',
    isHighRisk: '否',
    isSurgery: '否',
    isAnesthesia: '否',
    isMaterial: '否',
    isDrug: '否',
  },
];

export const maintenanceService = {
  getMaintenanceData: async () => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await fetch('/api/maintenance-data');
      return response.json();
    }
    return maintenanceData;
  },
};

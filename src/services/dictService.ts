/**
 * Service for Dictionary/Cache data
 */

import { request, ApiResponse } from './request';

export interface DictOption {
  label: string;
  value: string;
  [key: string]: any;
}

export interface DictData {
  dataInfo: DictOption[];
}

export const dictService = {
  getItemTypeCodes: async (): Promise<ApiResponse<DictData>> => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<DictData>('/api/app-core/cache/range-content-dict/itemTypeCode?itemTypeCode=DOMBILL_BILL_CLASS_DICT', {
        method: 'GET',
      });
      return response;
    }

    // Mock data
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      code: "SUCCESS",
      data: {
        dataInfo: [
          { label: "药品", value: "A" },
          { label: "检验", value: "C" },
          { label: "检查", value: "D" },
          { label: "处置", value: "E" },
          { label: "手术", value: "F" },
          { label: "麻醉", value: "G" },
          { label: "护理", value: "H" },
          { label: "膳食", value: "I" },
          { label: "材料", value: "L" },
          { label: "其它", value: "Z" },
          { label: "病理", value: "P" },
          { label: "输血", value: "M" },
          { label: "治疗", value: "T" }
        ]
      },
      sucMsg: "操作成功",
      serial: "mock-serial"
    };
  }
};

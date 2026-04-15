/**
 * Service for Organizations (使用机构)
 */

import { request } from './request';

export interface OrgEntry {
  id: string;
  hspName: string;
  hspNo: string;
  orgCode: string;
  alias?: string;
  priceLevelName?: string;
  priceLevelCode?: string;
}

export interface OrgResponse {
  code: string;
  data: {
    dataInfo: OrgEntry[];
    pageInfo: {
      pageSize: number;
      totalCount: number;
      totalPageNum: number;
      pageNum: number;
    };
  };
  sucMsg: string;
  serial?: string;
}

export const orgService = {
  getOrgList: async (params: { 
    pageNum: number; 
    pageSize: number; 
    query: string;
  }): Promise<OrgResponse> => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const queryStr = new URLSearchParams({
        query: params.query,
        pageSize: params.pageSize.toString(),
        pageNum: params.pageNum.toString(),
      }).toString();
      
      const response = await request<any>(`/uc/hospital/hospital-list?${queryStr}`);
      return response;
    }

    // Mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockOrgs: OrgEntry[] = [
      {
        id: "711912746777575424",
        hspName: "智慧云医院",
        hspNo: "H06",
        orgCode: "46728588X",
        alias: "云医院",
        priceLevelName: "三级",
        priceLevelCode: "3",
      },
      {
        id: "909521624921800704",
        hspName: "温泉镇分院",
        hspNo: "H02",
        orgCode: "46728587X",
        priceLevelName: "二级",
        priceLevelCode: "2",
      },
      {
        id: "1037000793053462528",
        hspName: "南河镇分院",
        hspNo: "H04",
        orgCode: "11",
        priceLevelName: "二级",
        priceLevelCode: "2",
      }
    ];

    return {
      code: "SUCCESS",
      data: {
        dataInfo: mockOrgs,
        pageInfo: {
          totalCount: 3,
          totalPageNum: 1,
          pageSize: params.pageSize,
          pageNum: params.pageNum
        }
      },
      sucMsg: "操作成功"
    };
  }
};

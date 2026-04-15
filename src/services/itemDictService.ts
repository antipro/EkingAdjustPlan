/**
 * Service for Item Dictionary (项目字典)
 */

import { request } from './request';

export interface ItemDictEntry {
  id: string;
  itemCode: string;
  itemName: string;
  spec: string;
  unit: string;
  itemClass: string;
  itemClassName: string;
  hpFeeCode?: string;
  hpFeeName?: string;
  status?: number | string;
  priceCode?: string;
  sybChargeItemCode?: string;
  pyCode?: string;
  wbCode?: string;
  outRcptName?: string;
  inRcptName?: string;
  statisTypeName?: string;
  nationChargeItemCode?: string;
}

export interface ItemDictResponse {
  code: string;
  data: {
    dataInfo: ItemDictEntry[];
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

export const itemDictService = {
  getPageList: async (params: { 
    pageNum: number; 
    pageSize: number; 
    status: string; 
    search: string; 
    itemClass: string;
  }): Promise<ItemDictResponse> => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>(`/api/item-dict/pageList?pageNum=${params.pageNum}&pageSize=${params.pageSize}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: params.status,
          search: params.search,
          itemClass: params.itemClass
        }),
      });
      return response;
    }

    // Mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockItems: ItemDictEntry[] = Array.from({ length: 50 }).map((_, i) => ({
      id: `dict-${i}`,
      itemCode: `I24300${i}`,
      itemName: i % 2 === 0 ? `交叉配血 ${i}` : `疑难交叉配血 ${i}`,
      spec: '/',
      unit: '次',
      itemClass: params.itemClass || 'C',
      itemClassName: params.itemClass === 'C' ? '检查' : '检验',
      sybChargeItemCode: `26000001${i}`,
      pyCode: 'JCPX',
      wbCode: 'LWIJQRSU',
      status: 0
    }));

    return {
      code: "SUCCESS",
      data: {
        dataInfo: mockItems.slice((params.pageNum - 1) * params.pageSize, params.pageNum * params.pageSize),
        pageInfo: {
          totalCount: 50,
          totalPageNum: 3,
          pageSize: params.pageSize,
          pageNum: params.pageNum
        }
      },
      sucMsg: "操作成功"
    };
  }
};

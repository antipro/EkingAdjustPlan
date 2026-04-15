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
  priceList?: any[];
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
  },
  queryDetail: async (itemCode: string, empNo: string = '000023'): Promise<any> => {
    if (import.meta.env.VITE_MOCK === 'false') {
      const response = await request<any>(`/api/item-dict/queryDetail?itemCode=${itemCode}&empNo=${empNo}`, {
        method: 'GET',
      });
      return response;
    }

    // Mock data
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      code: "SUCCESS",
      data: {
        dataInfo: {
          outRcptName: "诊察费",
          processTimeStamp: 1776234221442,
          itemClassName: "检验",
          itemCode: itemCode,
          hpFeeType: "1",
          wbCode: "234",
          spec: "324",
          priceList: [
            {
              retaBasicPrice: 33,
              priceCode: "4234",
              processTimeStamp: 1776234221476,
              priceLevelCode: "1",
              province: "320000",
              itemCode: itemCode,
              beginTime: "2026-04-15 14:23:41",
              id: Math.random().toString(),
              provinceName: "江苏省",
              priceLevelUniqueCode: "320000_1"
            }
          ],
          reviewStatusName: "未审核",
          itemName: "测试项目名称",
          unit: "次",
          inRcptName: "诊察费",
          statisTypeCode: "1207",
          statisTypeName: "微波治疗",
          inRcptCode: "Q",
          itemClass: "C",
          outRcptCode: "Q",
          hpFeeName: "一般医疗服务费",
          id: Math.random().toString(),
          mnBillQty: 1,
          pyCode: "234",
          status: 0
        }
      },
      sucMsg: "操作成功"
    };
  }
};

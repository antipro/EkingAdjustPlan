/**
 * Service for Item Dictionary (项目字典)
 */

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
  status?: string;
  priceCode?: string;
}

export interface ItemDictResponse {
  code: string;
  data: {
    data: ItemDictEntry[];
    totalNum: number;
    totalPage: number;
    pageSize: number;
    pageNum: number;
  };
  sucMsg: string;
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
      const response = await fetch(`/api/item-dict/pageList?pageNum=${params.pageNum}&pageSize=${params.pageSize}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: params.status,
          search: params.search,
          itemClass: params.itemClass
        }),
      });
      return response.json();
    }

    // Mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockItems: ItemDictEntry[] = Array.from({ length: 50 }).map((_, i) => ({
      id: `dict-${i}`,
      itemCode: `1000${i}`,
      itemName: `项目名称 ${i}`,
      spec: '/',
      unit: '次',
      itemClass: params.itemClass || 'C',
      itemClassName: params.itemClass === 'C' ? '检查' : '其他',
      priceCode: 'XXXXX'
    }));

    return {
      code: "SUCCESS",
      data: {
        data: mockItems.slice((params.pageNum - 1) * params.pageSize, params.pageNum * params.pageSize),
        totalNum: 50,
        totalPage: 3,
        pageSize: params.pageSize,
        pageNum: params.pageNum
      },
      sucMsg: "操作成功"
    };
  }
};

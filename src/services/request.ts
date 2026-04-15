import * as antd from 'antd';

export interface ApiResponse<T = any> {
  code: string;
  data: T;
  serial: string;
  sucMsg: string;
  failMsg?: string;
  failDetail?: string;
}

/**
 * Centralized request utility to handle API calls and global error handling.
 * Acts as an interceptor for the "FAIL" code.
 */
export async function request<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    const result: ApiResponse<T> = await response.json();

    if (result.code === 'FAIL') {
      antd.Modal.error({
        title: result.failMsg || '操作失败',
        content: result.failDetail || '未知错误',
        okText: '确定',
      });
      // We still return the result so the caller can handle it if needed, 
      // but the global error has been shown.
    }

    return result;
  } catch (error) {
    console.error('API Request Error:', error);
    antd.message.error('网络请求失败，请稍后重试');
    throw error;
  }
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import * as antd from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { itemDictService, ItemDictEntry } from '../services/itemDictService';
import { priceListService, PriceItem } from '../services/priceListService';

const { 
  Modal, 
  Tabs, 
  Input, 
  Checkbox, 
  Button, 
  Table, 
  Space,
} = antd;

interface ReplacementItemModalProps {
  visible: boolean;
  planId?: string;
  record?: any;
  onCancel: () => void;
  onSave: (selectedItem: any) => void;
}

const ReplacementItemModal: React.FC<ReplacementItemModalProps> = ({ visible, planId, record, onCancel, onSave }) => {
  const [activeTab, setActiveTab] = useState('1');
  const [selectedRowKey, setSelectedRowKey] = useState<React.Key | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({ pageNum: 1, pageSize: 20 });

  useEffect(() => {
    if (visible) {
      if (activeTab === '1') {
        fetchNewItems();
      } else {
        fetchExistingItems();
      }
    }
  }, [visible, activeTab, params.pageNum, params.pageSize]);

  const fetchNewItems = async () => {
    setLoading(true);
    try {
      const res = await priceListService.getItems({
        planId: planId || '',
        queryString: searchText,
        adjustTypes: ['I', 'E'],
        planStatus: ['0', '1', '2', '3', '4'],
        pageNum: params.pageNum,
        pageSize: params.pageSize,
      });
      const list = Array.isArray(res) ? res : (res.data?.dataInfo?.data || []);
      setData(list);
      setTotal(list.length);
    } catch (e) {
      console.error(e);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingItems = async () => {
    setLoading(true);
    try {
      const res: any = await itemDictService.getPageList({
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        status: '0',
        search: searchText,
        itemClass: '',
      });
      const list = Array.isArray(res) ? res : (res.data?.dataInfo || []);
      setData(list);
      setTotal(list.length);
    } catch (e) {
      console.error(e);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setParams(prev => ({ ...prev, pageNum: 1 }));
    if (activeTab === '1') {
      fetchNewItems();
    } else {
      fetchExistingItems();
    }
  };

  const handleTableChange = (page: number, size: number) => {
    setParams({ pageNum: page, pageSize: size });
  };

  const columns = [
    { title: '项目收费编码', dataIndex: 'itemCode', key: 'itemCode' },
    { title: '项目名称', dataIndex: 'itemName', key: 'itemName' },
    { title: '项目代码', dataIndex: 'itemCode', key: 'itemCode2' },
    { title: '项目分类', dataIndex: 'itemClassName', key: 'itemClassName' },
    { title: '规格', dataIndex: 'spec', key: 'spec' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    ...(activeTab === '1' ? [
      { title: '计划启用时间', dataIndex: 'effectiveTime', key: 'effectiveTime' },
      { title: '计划状态', dataIndex: 'status', key: 'status' },
    ] : []),
  ];

  const handleSave = () => {
    if (!selectedRowKey) {
      antd.message.warning('请选择一个替换项');
      return;
    }
    const selectedItem = data.find(item => item.id === selectedRowKey);
    onSave(selectedItem);
  };

  return (
    <Modal
      title="选择替换项"
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      width={900}
      okText="确定"
      cancelText="取消"
      styles={{ body: { padding: '0 24px 24px' } }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: '1', label: '新增项' },
          { key: '2', label: '现有项目' },
        ]}
      />
      
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space size={16}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>价表项目:</span>
            <Input 
              placeholder="项目名称/代码/项目收费编码" 
              style={{ width: 250 }} 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </div>
          {activeTab === '1' && <Checkbox>本次计划新增</Checkbox>}
        </Space>
        <Button type="primary" ghost icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
      </div>

      <Table
        rowKey="id"
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
          onChange: (keys) => setSelectedRowKey(keys[0]),
        }}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={activeTab === '2' ? {
          current: params.pageNum,
          pageSize: params.pageSize,
          total: total,
          onChange: handleTableChange,
        } : false}
        size="small"
        bordered
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default ReplacementItemModal;

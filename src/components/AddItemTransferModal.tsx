/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import * as antd from 'antd';
import { SearchOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { itemDictService, ItemDictEntry } from '../services/itemDictService';
import { dictService, DictOption } from '../services/dictService';

const { Modal, Table, Row, Col, Input, Select, Button, Space, Typography } = antd;
const { Text } = Typography;

interface AddItemTransferModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (selectedItems: ItemDictEntry[]) => void;
  title?: string;
  status?: string;
  provinceCode?: string;
}

const AddItemTransferModal: React.FC<AddItemTransferModalProps> = ({
  visible,
  onCancel,
  onSave,
  title = "添加价表项目",
  status = '0',
  provinceCode
}) => {
  // Left side: Selected Items (已选项目)
  const [selectedItems, setSelectedItems] = useState<ItemDictEntry[]>([]);
  const [leftSelectedRowKeys, setLeftSelectedRowKeys] = useState<React.Key[]>([]);
  const [leftSearch, setLeftSearch] = useState('');
  const [leftCategory, setLeftCategory] = useState('');

  // Right side: Alternative Items (备选项目)
  const [alternativeItems, setAlternativeItems] = useState<ItemDictEntry[]>([]);
  const [rightSelectedRowKeys, setRightSelectedRowKeys] = useState<React.Key[]>([]);
  const [rightSearch, setRightSearch] = useState('');
  const [rightCategory, setRightCategory] = useState('');
  const [rightLoading, setRightLoading] = useState(false);
  const [categories, setCategories] = useState<DictOption[]>([]);
  const [rightPagination, setRightPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });

  const fetchAlternativeItems = useCallback(async (pageNum: number = 1, pageSize: number = 20) => {
    setRightLoading(true);
    try {
      const res = await itemDictService.getPageList({
        pageNum,
        pageSize,
        status,
        search: rightSearch,
        itemClass: rightCategory || 'C'
      });
      if (res.code === 'SUCCESS') {
        setAlternativeItems(res.data.dataInfo);
        setRightPagination({
          current: res.data.pageInfo.pageNum,
          pageSize: res.data.pageInfo.pageSize,
          total: res.data.pageInfo.totalCount
        });
      }
    } finally {
      setRightLoading(false);
    }
  }, [rightSearch, rightCategory]);

  useEffect(() => {
    if (visible) {
      fetchAlternativeItems();
      setSelectedItems([]);
      setLeftSelectedRowKeys([]);
      setRightSelectedRowKeys([]);
      
      // Fetch categories
      dictService.getItemTypeCodes().then(res => {
        if (res.code === 'SUCCESS') {
          setCategories(res.data.dataInfo);
        }
      });
    }
  }, [visible, fetchAlternativeItems]);

  const handleTransferToLeft = () => {
    const itemsToAdd = alternativeItems.filter(item => rightSelectedRowKeys.includes(item.id));
    // Avoid duplicates
    const newSelected = [...selectedItems];
    itemsToAdd.forEach(item => {
      if (!newSelected.find(s => s.id === item.id)) {
        newSelected.push(item);
      }
    });
    setSelectedItems(newSelected);
    setRightSelectedRowKeys([]);
  };

  const handleTransferToRight = () => {
    const newSelected = selectedItems.filter(item => !leftSelectedRowKeys.includes(item.id));
    setSelectedItems(newSelected);
    setLeftSelectedRowKeys([]);
  };

  const columns = [
    { title: '项目收费编码', dataIndex: 'sybChargeItemCode', key: 'sybChargeItemCode', width: 120 },
    { title: '项目名称', dataIndex: 'itemName', key: 'itemName', width: 150, ellipsis: true },
    { title: '规格', dataIndex: 'spec', key: 'spec', width: 60 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '项目代码', dataIndex: 'itemCode', key: 'itemCode', width: 100 },
    { title: '项目分类', dataIndex: 'itemClassName', key: 'itemClassName', width: 100 },
  ];

  const filteredSelectedItems = selectedItems.filter(item => {
    const matchSearch = item.itemName.includes(leftSearch) || 
                       item.itemCode.includes(leftSearch) || 
                       (item.sybChargeItemCode && item.sybChargeItemCode.includes(leftSearch));
    const matchCategory = leftCategory ? item.itemClass === leftCategory : true;
    return matchSearch && matchCategory;
  });

  const handleSave = async () => {
    if (selectedItems.length === 0) {
      onCancel();
      return;
    }

    setRightLoading(true);
    try {
      const detailedItems = await Promise.all(
        selectedItems.map(async (item) => {
          try {
            const res = await itemDictService.queryDetail(item.itemCode);
            if (res.code === 'SUCCESS') {
              const detail = res.data.dataInfo;
              // Filter priceList by provinceCode if provided
              if (provinceCode && detail.priceList) {
                detail.priceList = detail.priceList.filter((p: any) => p.province === provinceCode);
              }
              
              // Merge the detail data into the item
              return {
                ...item,
                ...detail,
                // Ensure we keep the original ID if needed, or use the one from detail
                id: detail.id || item.id
              };
            }
          } catch (e) {
            console.error(`Failed to fetch detail for ${item.itemCode}`, e);
          }
          return item;
        })
      );
      onSave(detailedItems);
    } finally {
      setRightLoading(false);
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      width={1200}
      okText="保存"
      cancelText="取消"
      confirmLoading={rightLoading}
      styles={{ body: { padding: '12px 16px' } }}
    >
      <Row gutter={16} align="middle">
        {/* Left Table: Selected Items */}
        <Col span={11}>
          <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, padding: 8 }}>
            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Text strong style={{ color: '#1890ff', marginRight: 8 }}>| 已选项目</Text>
            </div>
            <Row gutter={8} style={{ marginBottom: 8 }}>
              <Col span={8}>
                <Select 
                  placeholder="项目分类" 
                  style={{ width: '100%' }} 
                  value={leftCategory}
                  onChange={setLeftCategory}
                  options={[
                    { value: '', label: '全部' },
                    ...categories
                  ]}
                />
              </Col>
              <Col span={12}>
                <Input 
                  placeholder="项目名称/代码/项目收费编码" 
                  value={leftSearch}
                  onChange={e => setLeftSearch(e.target.value)}
                />
              </Col>
              <Col span={4}>
                <Button type="primary" ghost icon={<SearchOutlined />}>查询</Button>
              </Col>
            </Row>
            <Table
              rowSelection={{
                selectedRowKeys: leftSelectedRowKeys,
                onChange: setLeftSelectedRowKeys
              }}
              columns={columns}
              dataSource={filteredSelectedItems}
              rowKey="id"
              size="small"
              pagination={{
                size: 'small',
                showTotal: (total) => `共${total}条`,
                pageSize: 10
              }}
              scroll={{ y: 400 }}
              bordered
            />
          </div>
        </Col>

        {/* Transfer Buttons */}
        <Col span={2} style={{ textAlign: 'center' }}>
          <Space direction="vertical">
            <Button 
              icon={<LeftOutlined />} 
              onClick={handleTransferToLeft} 
              disabled={rightSelectedRowKeys.length === 0}
            />
            <Button 
              icon={<RightOutlined />} 
              onClick={handleTransferToRight} 
              disabled={leftSelectedRowKeys.length === 0}
            />
          </Space>
        </Col>

        {/* Right Table: Alternative Items */}
        <Col span={11}>
          <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, padding: 8 }}>
            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Text strong style={{ color: '#1890ff', marginRight: 8 }}>| 备选项目</Text>
            </div>
            <Row gutter={8} style={{ marginBottom: 8 }}>
              <Col span={8}>
                <Select 
                  placeholder="项目分类" 
                  style={{ width: '100%' }} 
                  value={rightCategory}
                  onChange={setRightCategory}
                  options={[
                    { value: '', label: '全部' },
                    ...categories
                  ]}
                />
              </Col>
              <Col span={12}>
                <Input 
                  placeholder="项目名称/代码/项目收费编码" 
                  value={rightSearch}
                  onChange={e => setRightSearch(e.target.value)}
                  onPressEnter={() => fetchAlternativeItems(1)}
                />
              </Col>
              <Col span={4}>
                <Button 
                  type="primary" 
                  ghost 
                  icon={<SearchOutlined />} 
                  onClick={() => fetchAlternativeItems(1)}
                >
                  查询
                </Button>
              </Col>
            </Row>
            <Table
              rowSelection={{
                selectedRowKeys: rightSelectedRowKeys,
                onChange: setRightSelectedRowKeys
              }}
              columns={columns}
              dataSource={alternativeItems}
              rowKey="id"
              size="small"
              loading={rightLoading}
              pagination={{
                ...rightPagination,
                size: 'small',
                showTotal: (total) => `共${total}条`,
                onChange: (page, size) => fetchAlternativeItems(page, size)
              }}
              scroll={{ y: 400 }}
              bordered
            />
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default AddItemTransferModal;

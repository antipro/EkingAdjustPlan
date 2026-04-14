/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as antd from 'antd';
import { SearchOutlined } from '@ant-design/icons';

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
  onCancel: () => void;
  onSave: (selectedItem: any) => void;
}

const ReplacementItemModal: React.FC<ReplacementItemModalProps> = ({ visible, onCancel, onSave }) => {
  const [activeTab, setActiveTab] = useState('1');
  const [selectedRowKey, setSelectedRowKey] = useState<React.Key | null>(null);

  const columns = [
    { title: '项目收费编码', dataIndex: 'chargeCode', key: 'chargeCode' },
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { title: '项目代码', dataIndex: 'itemCode', key: 'itemCode' },
    { title: '项目分类', dataIndex: 'category', key: 'category' },
    { title: '规格', dataIndex: 'specs', key: 'specs' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    ...(activeTab === '1' ? [
      { title: '计划启用时间', dataIndex: 'effectiveTime', key: 'effectiveTime' },
      { title: '计划状态', dataIndex: 'status', key: 'status' },
    ] : []),
  ];

  const mockData = [
    { key: '1', chargeCode: 'XXXXX', name: '体检费（单位）', itemCode: '10000', category: '检查', specs: '/', unit: '套', effectiveTime: '2026-02-01 00:00', status: '草稿' },
    { key: '2', chargeCode: 'XXXXX', name: '体检费（单位）', itemCode: '10001', category: '检查', specs: '/', unit: '套', effectiveTime: '2026-02-01 00:00', status: '草稿' },
    { key: '3', chargeCode: 'XXXXX', name: '挂号费', itemCode: '10002', category: '其他', specs: '/', unit: '次', effectiveTime: '2026-02-01 00:00', status: '草稿' },
    { key: '4', chargeCode: 'XXXXX', name: '诊疗费', itemCode: '10003', category: '其他', specs: '/', unit: '次', effectiveTime: '2026-02-01 00:00', status: '草稿' },
    { key: '5', chargeCode: 'XXXXX', name: '门诊病历手册', itemCode: '10004', category: '其他', specs: '/', unit: '册', effectiveTime: '2026-02-01 00:00', status: '草稿' },
    { key: '6', chargeCode: 'XXXXX', name: '急诊诊察费', itemCode: '10005', category: '其他', specs: '/', unit: '次', effectiveTime: '2026-02-01 00:00', status: '草稿' },
    { key: '7', chargeCode: 'XXXXX', name: '职工子女门诊统筹诊察费', itemCode: '10006', category: '其他', specs: '/', unit: '次', effectiveTime: '2026-02-01 00:00', status: '草稿' },
    { key: '8', chargeCode: 'XXXXX', name: '副主任医师门诊诊察费（儿科）', itemCode: '10007', category: '其他', specs: '/', unit: '次', effectiveTime: '2026-01-01 00:00', status: '已发布' },
    { key: '9', chargeCode: 'XXXXX', name: '主任医师门诊诊察费（儿科）', itemCode: '10008', category: '其他', specs: '/', unit: '次', effectiveTime: '2026-01-01 00:00', status: '已发布' },
    { key: '10', chargeCode: 'XXXXX', name: '普通门诊诊察费', itemCode: '10009', category: '其他', specs: '/', unit: '次', effectiveTime: '2026-01-01 00:00', status: '已发布' },
  ];

  const handleSave = () => {
    if (!selectedRowKey) {
      antd.message.warning('请选择一个替换项');
      return;
    }
    const selectedItem = mockData.find(item => item.key === selectedRowKey);
    onSave(selectedItem);
  };

  return (
    <Modal
      title="选择替换项"
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      width={900}
      okText="保存"
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
            <Input placeholder="项目名称/代码/项目收费编码" style={{ width: 250 }} />
          </div>
          {activeTab === '1' && <Checkbox>本次计划新增</Checkbox>}
        </Space>
        <Button type="primary" ghost icon={<SearchOutlined />}>查询</Button>
      </div>

      <Table
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
          onChange: (keys) => setSelectedRowKey(keys[0]),
        }}
        columns={columns}
        dataSource={mockData}
        pagination={false}
        size="small"
        bordered
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default ReplacementItemModal;

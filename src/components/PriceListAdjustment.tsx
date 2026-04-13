/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import * as antd from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ImportOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { priceListService, PriceItem, LinkedClinicalItem } from '../services/priceListService';
import PlanList from './PlanList';

const { 
  Table,
  Button,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Input,
  Select,
  Tabs,
  DatePicker,
  Dropdown,
} = antd;

const { Title, Text } = Typography;

// Mock Data for Plan List
// Removed as it is now fetched from priceListService

// Mock Data for Table
// Removed as it is now fetched from priceListService

// Mock Data for Adjust Table
// Removed as it is now fetched from priceListService

// Mock Data for Deactivate Table
// Removed as it is now fetched from priceListService

// Mock Data for Linked Clinical Projects
// Removed as it is now fetched from priceListService

const PriceListAdjustment: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('1');
  const [items, setItems] = useState<PriceItem[]>([]);
  const [linkedItems, setLinkedItems] = useState<LinkedClinicalItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const data = await priceListService.getItems(activeTab);
      setItems(data);
      if (activeTab === '3') {
        const linkedData = await priceListService.getLinkedClinicalItems();
        setLinkedItems(linkedData);
      }
      setLoading(false);
    };
    fetchItems();
  }, [activeTab]);

  const columns = [
    { title: '生效', dataIndex: 'active', key: 'active', width: 60 },
    { title: '收费项目编码', dataIndex: 'code', key: 'code', width: 120 },
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '规格', dataIndex: 'specs', key: 'specs', width: 60 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '物价(三级)', dataIndex: 'price3', key: 'price3', width: 100 },
    { title: '物价(二级)', dataIndex: 'price2', key: 'price2', width: 100 },
    { title: '物价(一级)', dataIndex: 'price1', key: 'price1', width: 100 },
    { title: '国家收费项目编码', dataIndex: 'natCode', key: 'natCode', width: 150 },
    { title: '国家收费项目名称', dataIndex: 'natName', key: 'natName', width: 150 },
    { title: '备注说明', dataIndex: 'remarks', key: 'remarks' },
  ];

  const adjustColumns = [
    { title: '生效', dataIndex: 'active', key: 'active', width: 60 },
    { title: '收费项目编码', dataIndex: 'code', key: 'code', width: 120 },
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '规格', dataIndex: 'specs', key: 'specs', width: 60 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '原价(三级)', dataIndex: 'oldPrice3', key: 'oldPrice3', width: 100 },
    { title: '原价(二级)', dataIndex: 'oldPrice2', key: 'oldPrice2', width: 100 },
    { title: '原价(一级)', dataIndex: 'oldPrice1', key: 'oldPrice1', width: 100 },
    { 
      title: '调价(三类)', 
      dataIndex: 'newPrice3', 
      key: 'newPrice3', 
      width: 100,
      render: (text: string) => <Input size="small" defaultValue={text} style={{ border: '1px solid #1890ff' }} />
    },
    { 
      title: '调价(二类)', 
      dataIndex: 'newPrice2', 
      key: 'newPrice2', 
      width: 100,
      render: (text: string) => <Input size="small" defaultValue={text} style={{ border: '1px solid #1890ff' }} />
    },
    { 
      title: '调价(一类)', 
      dataIndex: 'newPrice1', 
      key: 'newPrice1', 
      width: 100,
      render: (text: string) => <Input size="small" defaultValue={text} style={{ border: '1px solid #1890ff' }} />
    },
    { title: '其他信息变更', dataIndex: 'otherChanges', key: 'otherChanges' },
  ];

  const deactivateColumns = [
    { title: '生效', dataIndex: 'active', key: 'active', width: 60 },
    {
      title: '停用项目',
      children: [
        { title: '收费项目编码', dataIndex: 'code', key: 'code', width: 120 },
        { title: '项目名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
        { title: '项目代码', dataIndex: 'itemCode', key: 'itemCode', width: 100 },
        { title: '项目分类', dataIndex: 'category', key: 'category', width: 100 },
      ],
    },
    {
      title: '替换项目',
      children: [
        { title: '收费项目编码', dataIndex: 'repCode', key: 'repCode', width: 120 },
        { title: '项目名称', dataIndex: 'repName', key: 'repName', width: 150 },
        { title: '单位', dataIndex: 'repUnit', key: 'repUnit', width: 60 },
        { title: '项目代码', dataIndex: 'repItemCode', key: 'repItemCode', width: 100 },
      ],
    },
    { title: '处理', dataIndex: 'status', key: 'status', width: 80 },
    { 
      title: '操作', 
      key: 'action', 
      width: 120,
      render: () => (
        <Space>
          <Button type="link" size="small" style={{ padding: 0 }}>替换项</Button>
          <Button type="link" size="small" danger style={{ padding: 0 }}>移除</Button>
        </Space>
      )
    },
  ];

  const linkedClinicalColumns = [
    { title: '项目代码', dataIndex: 'code', key: 'code', width: 100 },
    { title: '项目分类', dataIndex: 'category', key: 'category', width: 100 },
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '关联的价表项目', dataIndex: 'linkedItems', key: 'linkedItems', width: 300 },
    { 
      title: '处理方式', 
      dataIndex: 'processType', 
      key: 'processType', 
      width: 150,
      render: (text: string) => (
        <Select 
          defaultValue={text} 
          style={{ width: '100%' }}
          options={[
            { value: '', label: '请选择' },
            { value: '替换', label: '替换' },
            { value: '移除', label: '移除' },
            { value: '停用临床', label: '停用临床' },
            { value: '调整', label: '调整' },
          ]}
        />
      )
    },
    { 
      title: '操作', 
      key: 'action', 
      width: 120,
      render: () => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small">查看</Button>
        </Space>
      )
    },
  ];

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Draft': return <Tag color="blue" style={{ float: 'right' }}>草稿</Tag>;
      case 'Published': return <Tag color="orange" style={{ float: 'right' }}>发布</Tag>;
      case 'Active': return <Tag color="green" style={{ float: 'right' }}>生效</Tag>;
      case 'Obsolete': return <Tag color="default" style={{ float: 'right' }}>作废</Tag>;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      {/* Left Plan List Panel */}
      <div style={{ width: 300, background: '#fff', borderRight: '1px solid #e8e8e8' }}>
        <PlanList 
          planType="100" 
          onSelect={(plan) => setSelectedPlan(plan)}
        />
      </div>

      {/* Right Detail Panel */}
      <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={5} style={{ margin: 0 }}>
            {selectedPlan ? `${selectedPlan.beginDatetime} (${selectedPlan.planName})` : '请选择计划'}
          </Title>
        </div>
        <div style={{ padding: '0 20px' }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              { key: '1', label: '新增/启用' },
              { key: '2', label: '调整' },
              { key: '3', label: '停用' },
            ]} 
          />
        </div>
        <div style={{ padding: '12px 20px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          {activeTab === '2' ? (
            <>
              <Row gutter={16} align="middle">
                <Col span={4}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>项目分类:</span>
                    <Select 
                      defaultValue="all" 
                      style={{ width: '100%' }}
                      options={[{ value: 'all', label: '全部' }]}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>价表项目:</span>
                    <Input placeholder="项目名称/代码/收费项目编码" />
                  </div>
                </Col>
                <Col span={8}>
                  <Space size={16}>
                    <antd.Checkbox>无变动</antd.Checkbox>
                    <antd.Checkbox>仅价格变动</antd.Checkbox>
                  </Space>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Button type="primary" ghost icon={<SearchOutlined />}>查询</Button>
                </Col>
              </Row>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  <Button type="primary" size="small" icon={<PlusOutlined />}>添加</Button>
                  <Dropdown menu={{ items: [{ key: '1', label: '导入' }] }}>
                    <Button size="small" icon={<ImportOutlined />}>导入 <DownOutlined /></Button>
                  </Dropdown>
                </Space>
                <Dropdown menu={{ items: [{ key: '1', label: '移除' }] }} danger>
                  <Button size="small" danger>批量移除 <DownOutlined /></Button>
                </Dropdown>
              </div>
            </>
          ) : activeTab === '3' ? (
            <>
              <Row gutter={16} align="middle">
                <Col span={4}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>项目分类:</span>
                    <Select 
                      defaultValue="all" 
                      style={{ width: '100%' }}
                      options={[{ value: 'all', label: '全部' }]}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>价表项目:</span>
                    <Input placeholder="项目名称/代码/收费项目编码" />
                  </div>
                </Col>
                <Col span={4}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>处理:</span>
                    <Select 
                      placeholder="完成/未完成" 
                      style={{ width: '100%' }}
                      options={[
                        { value: 'done', label: '完成' },
                        { value: 'todo', label: '未完成' }
                      ]}
                    />
                  </div>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                  <Button type="primary" ghost icon={<SearchOutlined />}>查询</Button>
                </Col>
              </Row>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  <Button type="primary" size="small" icon={<PlusOutlined />}>添加</Button>
                  <Dropdown menu={{ items: [{ key: '1', label: '导入' }] }}>
                    <Button size="small" icon={<ImportOutlined />}>导入 <DownOutlined /></Button>
                  </Dropdown>
                  <Button size="small" type="primary">导出临床项目</Button>
                </Space>
                <Dropdown menu={{ items: [{ key: '1', label: '移除' }] }} danger>
                  <Button size="small" danger>批量移除 <DownOutlined /></Button>
                </Dropdown>
              </div>
            </>
          ) : (
            <>
              <Row gutter={16} align="middle">
                <Col span={4}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>项目分类:</span>
                    <Select 
                      defaultValue="all" 
                      style={{ width: '100%' }}
                      options={[{ value: 'all', label: '全部' }]}
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>价表项目:</span>
                    <Input placeholder="项目名称/代码/收费项目编码" />
                  </div>
                </Col>
                <Col span={4}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>来源:</span>
                    <Select placeholder="请选择" style={{ width: '100%' }} />
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>1对1创建临床项目:</span>
                    <Select 
                      defaultValue="yes" 
                      style={{ width: '100%' }}
                      options={[{ value: 'yes', label: '是/否' }]}
                    />
                  </div>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Button type="primary" ghost icon={<SearchOutlined />}>查询</Button>
                </Col>
              </Row>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  <Button type="primary" size="small" icon={<PlusOutlined />}>新增</Button>
                  <Dropdown menu={{ items: [{ key: '1', label: '导入' }] }}>
                    <Button size="small" icon={<ImportOutlined />}>导入 <DownOutlined /></Button>
                  </Dropdown>
                  <Button size="small">添加停用项</Button>
                  <Dropdown menu={{ items: [{ key: '1', label: '创建' }] }}>
                    <Button size="small" type="primary">1对1创建临床项目 <DownOutlined /></Button>
                  </Dropdown>
                </Space>
                <Dropdown menu={{ items: [{ key: '1', label: '删除' }] }} danger>
                  <Button size="small" danger>批量删除 <DownOutlined /></Button>
                </Dropdown>
              </div>
            </>
          )}
        </div>
        <div style={{ flex: 1, padding: 0, overflowY: 'auto' }}>
          <Table 
            rowSelection={{ type: 'checkbox' }}
            columns={activeTab === '2' ? adjustColumns : activeTab === '3' ? deactivateColumns : columns} 
            dataSource={items} 
            loading={loading}
            pagination={false}
            size="small"
            bordered
            scroll={{ x: 1500, y: activeTab === '3' ? 300 : 'calc(100vh - 350px)' }}
          />
          {activeTab === '3' && (
            <div style={{ marginTop: 20, border: '1px solid #1890ff', borderRadius: 4 }}>
              <div style={{ padding: '8px 16px', background: '#e6f7ff', borderBottom: '1px solid #1890ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <span style={{ color: '#1890ff', fontWeight: 'bold' }}>| 关联的临床项目</span>
                  <antd.Checkbox style={{ marginLeft: 20 }}>仅显示未设置处理方式的项目</antd.Checkbox>
                </Space>
                <Space>
                  <Button size="small" type="primary" ghost>替换</Button>
                  <Button size="small" danger ghost>移除</Button>
                  <Button size="small" type="primary" ghost>停用临床</Button>
                </Space>
              </div>
              <Table 
                rowSelection={{ type: 'checkbox' }}
                columns={linkedClinicalColumns} 
                dataSource={linkedItems} 
                pagination={false}
                size="small"
                bordered
                scroll={{ x: 1000, y: 300 }}
              />
              <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">共6条</Text>
                <Space>
                  <Button type="primary">处理完成</Button>
                  <Button>暂存</Button>
                </Space>
              </div>
            </div>
          )}
          <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0' }}>
            <Text type="secondary">共5条</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceListAdjustment;

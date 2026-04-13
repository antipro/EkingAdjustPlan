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
  InfoCircleOutlined,
} from '@ant-design/icons';
import { clinicalProjectService, ClinicalItem } from '../services/clinicalProjectService';
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
  Checkbox,
} = antd;

const { Title, Text } = Typography;

// Mock Data for Clinical Plan List
// Removed as it is now fetched from clinicalProjectService

// Mock Data for Clinical Table (新增/启用)
// Removed as it is now fetched from clinicalProjectService

// Mock Data for Clinical Adjust Table
// Removed as it is now fetched from clinicalProjectService

const ClinicalProjectAdjustment: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('1');
  const [items, setItems] = useState<ClinicalItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const data = await clinicalProjectService.getItems(activeTab);
      setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, [activeTab]);

  const columns = [
    { title: '生效', dataIndex: 'active', key: 'active', width: 60 },
    { title: '来源', dataIndex: 'source', key: 'source', width: 120 },
    { title: '项目代码', dataIndex: 'code', key: 'code', width: 100 },
    { title: '项目分类', dataIndex: 'category', key: 'category', width: 100 },
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '总价', dataIndex: 'totalPrice', key: 'totalPrice', width: 80 },
    { title: '关联的价表项目', dataIndex: 'linkedItems', key: 'linkedItems', width: 250 },
    { title: '高风险', dataIndex: 'highRisk', key: 'highRisk', width: 80 },
    { title: '特殊医嘱类型', dataIndex: 'specialType', key: 'specialType', width: 120 },
    { title: '备注说明', dataIndex: 'remarks', key: 'remarks' },
  ];

  const adjustColumns = [
    { title: '生效', dataIndex: 'active', key: 'active', width: 60 },
    { title: '来源', dataIndex: 'source', key: 'source', width: 120 },
    { title: '项目代码', dataIndex: 'code', key: 'code', width: 100 },
    { title: '项目分类', dataIndex: 'category', key: 'category', width: 100 },
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '总价', dataIndex: 'totalPrice', key: 'totalPrice', width: 80 },
    { title: '关联的价表项目', dataIndex: 'linkedItems', key: 'linkedItems', width: 250 },
    { title: '信息变更', dataIndex: 'infoChanges', key: 'infoChanges' },
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
          planType="200" 
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
                <Col span={6}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>临床项目:</span>
                    <Input placeholder="项目名称/项目代码" />
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
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>包含价表项目:</span>
                    <Select placeholder="请选择" style={{ width: '100%' }} />
                  </div>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Space>
                    <Checkbox>无变动</Checkbox>
                    <Button type="primary" ghost icon={<SearchOutlined />}>查询</Button>
                  </Space>
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
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>临床项目:</span>
                    <Input placeholder="项目名称/项目代码" />
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
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>包含价表项目:</span>
                    <Select placeholder="请选择" style={{ width: '100%' }} />
                  </div>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Space>
                    <Checkbox>总价为0</Checkbox>
                    <Button type="primary" ghost icon={<SearchOutlined />}>查询</Button>
                  </Space>
                </Col>
              </Row>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  <Button type="primary" size="small" icon={<PlusOutlined />}>新增</Button>
                  <Dropdown menu={{ items: [{ key: '1', label: '导入' }] }}>
                    <Button size="small" icon={<ImportOutlined />}>导入 <DownOutlined /></Button>
                  </Dropdown>
                  <Button size="small">添加停用项</Button>
                </Space>
                <Dropdown menu={{ items: [{ key: '1', label: '移除' }] }} danger>
                  <Button size="small" danger>批量移除 <DownOutlined /></Button>
                </Dropdown>
              </div>
            </>
          )}
        </div>
        <div style={{ flex: 1, padding: 0 }}>
          <Table 
            rowSelection={{ type: 'checkbox' }}
            columns={activeTab === '2' ? adjustColumns : columns} 
            dataSource={items} 
            loading={loading}
            pagination={false}
            size="small"
            bordered
            scroll={{ x: 1500, y: 'calc(100vh - 350px)' }}
          />
          <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
            <Text type="secondary" style={{ marginRight: 16 }}>共5条</Text>
            <Space>
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
              <Text type="secondary" style={{ color: '#1890ff' }}>提示: 导入后请手动关联价表项目、持续性计费规则等</Text>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalProjectAdjustment;

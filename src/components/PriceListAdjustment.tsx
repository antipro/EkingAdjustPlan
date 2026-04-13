/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as antd from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ImportOutlined,
  DownOutlined,
} from '@ant-design/icons';

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
const planList = [
  {
    id: '1',
    effectiveTime: '2026-02-01 00:00',
    name: '按2026年医保物价管理条例要求变更物价项目',
    policy: '江苏省医保医疗服务价格调整公式[202607...',
    stats: '启用3; 调整5; 停用4',
    scope: '不限',
    status: 'Draft',
  },
  {
    id: '2',
    effectiveTime: '2026-01-01 00:00',
    name: '按2026年医保物价管理条例要求变更物价项目',
    policy: '江苏省医保医疗服务价格调整公式[202607...',
    stats: '启用3; 停用4',
    scope: '鑫亿云医院; 鑫亿未来医院',
    status: 'Published',
  },
  {
    id: '3',
    effectiveTime: '2025-09-30 00:00',
    name: '调整价表项目',
    policy: '江苏省医保医疗服务价格调整公式[202607...',
    stats: '停用4',
    scope: '不限',
    status: 'Active',
  },
  {
    id: '4',
    effectiveTime: '2025-09-30 00:00',
    name: '调整价表项目',
    policy: '江苏省医保医疗服务价格调整公式[202607...',
    stats: '停用4',
    scope: '不限',
    status: 'Obsolete',
  },
];

// Mock Data for Table
const tableData = [
  {
    key: '1',
    active: '否',
    code: '20251121001',
    name: '前牙美容修复术',
    specs: '/',
    unit: '套',
    price3: '200',
    price2: '180',
    price1: '',
    natCode: '001109000010000',
    natName: '前牙美容修复术',
    remarks: '指医务人员技术劳务性服务',
  },
  {
    key: '2',
    active: '否',
    code: '20251121002',
    name: '多学科诊疗费',
    specs: '/',
    unit: '套',
    price3: '48',
    price2: '32',
    price1: '',
    natCode: '001109000010000',
    natName: '多学科诊疗费',
    remarks: '含诊查、护理等',
  },
  {
    key: '3',
    active: '否',
    code: 'XXXXXXXX',
    name: '挂号费',
    specs: '/',
    unit: '次',
    price3: '24',
    price2: '20',
    price1: '',
    natCode: '001109000030000',
    natName: '挂号费',
    remarks: 'XXXXXX',
  },
  {
    key: '4',
    active: '否',
    code: 'XXXXXXXX',
    name: '诊疗费',
    specs: '/',
    unit: '次',
    price3: '50',
    price2: '40',
    price1: '',
    natCode: '001109000031000',
    natName: '诊疗费',
    remarks: 'XXXXXX',
  },
  {
    key: '5',
    active: '否',
    code: 'XXXXXXXX',
    name: '门诊病历手册',
    specs: '/',
    unit: '册',
    price3: '4',
    price2: '2',
    price1: '',
    natCode: '001109000032000',
    natName: '门诊病历手册',
    remarks: 'XXXXXX',
  },
];

const PriceListAdjustment: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('1');

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
      <div style={{ width: 300, background: '#fff', borderRight: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Select 
                defaultValue="js" 
                style={{ width: '100%' }}
                options={[{ value: 'js', label: '江苏省' }]}
              />
            </Col>
            <Col span={12}>
              <DatePicker placeholder="生效日期开始" style={{ width: '100%' }} />
            </Col>
            <Col span={24}>
              <Select 
                placeholder="计划状态" 
                style={{ width: '100%' }}
                options={[{ value: 'all', label: '全部' }]}
              />
            </Col>
          </Row>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <Button type="primary" size="small" icon={<PlusOutlined />}>新建</Button>
            <Button size="small">日志</Button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {planList.map(plan => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              style={{ 
                padding: '12px 16px', 
                cursor: 'pointer',
                borderLeft: selectedPlan === plan.id ? '3px solid #1890ff' : '3px solid transparent',
                background: selectedPlan === plan.id ? '#e6f7ff' : '#fff',
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              <div style={{ marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>生效时间 </Text>
                <Text strong style={{ fontSize: 12 }}>{plan.effectiveTime}</Text>
                {getStatusTag(plan.status)}
              </div>
              <div style={{ marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>计划名称 </Text>
                <Text style={{ fontSize: 12 }}>{plan.name}</Text>
              </div>
              <div style={{ marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>政策文件 </Text>
                <Text style={{ fontSize: 12 }}>{plan.policy}</Text>
              </div>
              <div style={{ marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>计划条数 </Text>
                <Text style={{ fontSize: 12 }}>{plan.stats}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>适用机构 </Text>
                <Text style={{ fontSize: 12 }}>{plan.scope}</Text>
              </div>
              {plan.status === 'Draft' && (
                <div style={{ textAlign: 'right' }}>
                  <Space>
                    <Button size="small">提交</Button>
                    <Button size="small">修改</Button>
                    <Button size="small" danger>删除</Button>
                  </Space>
                </div>
              )}
              {plan.status === 'Published' && (
                <div style={{ textAlign: 'right' }}>
                  <Button size="small">作废</Button>
                </div>
              )}
              {plan.status === 'Obsolete' && (
                <div style={{ textAlign: 'right' }}>
                  <Button size="small">复制计划</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Detail Panel */}
      <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={5} style={{ margin: 0 }}>
            2026-02-01 00:00 (按2026年医保物价管理条例要求变更物价项目)
          </Title>
        </div>
        <div style={{ padding: '0 20px' }}>
          <Tabs defaultActiveKey="1" items={[
            { key: '1', label: '新增/启用' },
            { key: '2', label: '调整' },
            { key: '3', label: '停用' },
          ]} />
        </div>
        <div style={{ padding: '12px 20px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
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
        </div>
        <div style={{ flex: 1, padding: 0 }}>
          <Table 
            rowSelection={{ type: 'checkbox' }}
            columns={columns} 
            dataSource={tableData} 
            pagination={false}
            size="small"
            bordered
            scroll={{ x: 1500, y: 'calc(100vh - 350px)' }}
          />
          <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0' }}>
            <Text type="secondary">共5条</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceListAdjustment;

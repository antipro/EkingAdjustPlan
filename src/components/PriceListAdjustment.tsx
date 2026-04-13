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

// Mock Data for Adjust Table
const adjustTableData = [
  // ... (existing data)
];

// Mock Data for Deactivate Table
const deactivateTableData = [
  {
    key: '1',
    active: '否',
    code: '20251121001',
    name: '前牙美容修复术',
    unit: '套',
    itemCode: '10000',
    category: '处置',
    repCode: '',
    repName: '',
    repUnit: '',
    repItemCode: '',
    status: '已完成',
  },
  {
    key: '2',
    active: '否',
    code: '20251121002',
    name: '呼吸道病毒抗原 (腺病毒)',
    unit: '次',
    itemCode: '10001',
    category: '其他',
    repCode: '202511343',
    repName: '呼吸道病毒抗原快速测定',
    repUnit: '次',
    repItemCode: '90001',
    status: '未完成',
  },
  {
    key: '3',
    active: '否',
    code: 'XXXXXXXX',
    name: '挂号费',
    unit: '次',
    itemCode: '10002',
    category: '其他',
    repCode: 'XXXXXXXX',
    repName: 'XXXXXXXX',
    repUnit: '次',
    repItemCode: '10002',
    status: '未完成',
  },
  {
    key: '4',
    active: '否',
    code: 'XXXXXXXX',
    name: '诊疗费',
    unit: '次',
    itemCode: '10003',
    category: '其他',
    repCode: 'XXXXXXXX',
    repName: 'XXXXXXXX',
    repUnit: '次',
    repItemCode: '10003',
    status: '未完成',
  },
  {
    key: '5',
    active: '否',
    code: 'XXXXXXXX',
    name: '门诊病历手册',
    unit: '册',
    itemCode: '10004',
    category: '其他',
    repCode: '',
    repName: '',
    repUnit: '',
    repItemCode: '',
    status: '未完成',
  },
];

// Mock Data for Linked Clinical Projects
const linkedClinicalData = [
  {
    key: '1',
    code: '20011',
    category: '检验',
    name: 'EB病毒抗体六联检',
    linkedItems: 'EB病毒抗体 (早期抗原IgM) x1; EB病毒抗体 (核心抗原Igc) x1; E...',
    processType: '',
  },
  {
    key: '2',
    code: '20012',
    category: '检验',
    name: '呼吸道相关抗原鉴定二项(甲,乙流病毒)',
    linkedItems: '呼吸道病毒抗原 (甲型流感) x1; 呼吸道病毒抗原 (腺病毒) x1',
    processType: '替换',
  },
  {
    key: '3',
    code: '20013',
    category: '检验',
    name: '呼吸道相关抗原鉴定四项(甲,乙,合胞,腺病毒)',
    linkedItems: '呼吸道病毒抗原 (腺病毒) x1; 呼吸道病毒抗原 (甲型流感) x1; 呼...',
    processType: '移除',
  },
  {
    key: '4',
    code: '20014',
    category: '检验',
    name: '呼吸道相关抗原鉴定五项',
    linkedItems: '呼吸道病毒抗原 (腺病毒) x1; 呼吸道病毒抗原 (甲型流感) x1; 呼...',
    processType: '停用临床',
  },
  {
    key: '5',
    code: '20015',
    category: '检验',
    name: '肌酐测定 (酶促动力学法)',
    linkedItems: '肌酐测定 (酶促动力学法) x1; 呼吸道病毒抗原 (腺病毒)',
    processType: '调整',
  },
  {
    key: '6',
    code: '20016',
    category: '检验',
    name: '呼吸道病毒抗原 (腺病毒)',
    linkedItems: '呼吸道病毒抗原 (腺病毒)',
    processType: '',
  },
];

const PriceListAdjustment: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('1');
  const [activeTab, setActiveTab] = useState('1');

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
            dataSource={activeTab === '2' ? adjustTableData : activeTab === '3' ? deactivateTableData : tableData} 
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
                dataSource={linkedClinicalData} 
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

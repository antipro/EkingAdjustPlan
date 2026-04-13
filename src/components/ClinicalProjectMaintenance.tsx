/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as antd from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  InfoCircleOutlined,
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
  Checkbox,
  Alert,
} = antd;

const { Text } = Typography;

// Mock Data for Maintenance Plan List
const maintenancePlanList = [
  {
    id: '1',
    effectiveTime: '2026-02-01 00:00',
    linkedPlan: '是 (价表项目调整: 按2026年医保物价...)',
    name: '按2026年医保物价管理条例要求变更物价项目...',
    stats: '启用3; 调整5; 停用4',
    scope: '不限',
    status: 'Draft',
  },
  {
    id: '2',
    effectiveTime: '2026-01-01 00:00',
    linkedPlan: '否',
    name: '按2026年医保物价管理条例要求变更物价项目...',
    stats: '启用3; 停用4',
    scope: '鑫亿云医院; 鑫亿未来医院',
    status: 'Published',
  },
  {
    id: '3',
    effectiveTime: '2025-09-30 00:00',
    linkedPlan: '是 (价表项目调整: 按2026年医保物价...)',
    name: '调整临床项目',
    stats: '停用4',
    scope: '不限',
    status: 'Active',
  },
];

// Mock Data for Maintenance Table
const maintenanceTableData = [
  {
    key: '1',
    code: 'C00903',
    category: '处置',
    name: 'XXXXX',
    unit: '套',
    totalPrice: '180',
    linkedItems: 'XXXXX',
    execDept: '',
    reqCategory: '',
    examSite: '',
    specimenType: '',
    filmSurcharge: '',
    linkedCharge: '',
  },
  {
    key: '2',
    code: 'C00904',
    category: '检查',
    name: 'XXXXX',
    unit: '套',
    totalPrice: '50',
    linkedItems: 'XXXXX',
    execDept: '超声室; 安图分...',
    reqCategory: 'CT-超声',
    examSite: '有',
    specimenType: '',
    filmSurcharge: '',
    linkedCharge: '',
  },
  {
    key: '3',
    code: '209585',
    category: '检验',
    name: 'XXXXX',
    unit: '次',
    totalPrice: '12',
    linkedItems: 'XXXXX',
    execDept: '检验科',
    reqCategory: '检验-临检',
    examSite: '',
    specimenType: '有',
    filmSurcharge: '',
    linkedCharge: '',
  },
  {
    key: '4',
    code: 'C00906',
    category: '治疗',
    name: 'XXXXX',
    unit: '次',
    totalPrice: '10',
    linkedItems: 'XXXXX',
    execDept: '康复科',
    reqCategory: '治疗-康复医学',
    examSite: '有',
    specimenType: '',
    filmSurcharge: '',
    linkedCharge: '',
  },
  {
    key: '5',
    code: 'C00907',
    category: '病理',
    name: 'XXXXX',
    unit: '册',
    totalPrice: '2',
    linkedItems: 'XXXXX',
    execDept: '病理科',
    reqCategory: '病理-门诊妇产',
    examSite: '',
    specimenType: '',
    filmSurcharge: '',
    linkedCharge: '',
  },
];

const ClinicalProjectMaintenance: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('2');

  const columns = [
    { title: '项目代码', dataIndex: 'code', key: 'code', width: 100 },
    { title: '项目分类', dataIndex: 'category', key: 'category', width: 100 },
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 120 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '总价', dataIndex: 'totalPrice', key: 'totalPrice', width: 80 },
    { title: '关联的价表项目', dataIndex: 'linkedItems', key: 'linkedItems', width: 150 },
    { title: '执行科室 (业务单元)', dataIndex: 'execDept', key: 'execDept', width: 180 },
    { title: '申请单分类', dataIndex: 'reqCategory', key: 'reqCategory', width: 150 },
    { title: '检查部位', dataIndex: 'examSite', key: 'examSite', width: 100 },
    { title: '标本类型', dataIndex: 'specimenType', key: 'specimenType', width: 100 },
    { title: '胶片加收', dataIndex: 'filmSurcharge', key: 'filmSurcharge', width: 100 },
    { title: '联动收费', dataIndex: 'linkedCharge', key: 'linkedCharge', width: 100 },
  ];

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Draft': return <Tag color="blue" style={{ float: 'right' }}>草稿</Tag>;
      case 'Published': return <Tag color="orange" style={{ float: 'right' }}>已发布</Tag>;
      case 'Active': return <Tag color="green" style={{ float: 'right' }}>已生效</Tag>;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      {/* Top Alert */}
      <Alert
        message="仅显示【计划启用】的项目并提供综合配置功能，调整和停用的临床项目无需修改配置"
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ borderRadius: 0, border: 'none', borderBottom: '1px solid #e8e8e8' }}
      />

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
                <Space>
                  <Checkbox>草稿</Checkbox>
                  <Checkbox>发布</Checkbox>
                  <Checkbox>生效</Checkbox>
                </Space>
              </Col>
            </Row>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {maintenancePlanList.map(plan => (
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
                  <Text type="secondary" style={{ fontSize: 12 }}>关联计划 </Text>
                  <Text style={{ fontSize: 12 }}>{plan.linkedPlan}</Text>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>计划名称 </Text>
                  <Text style={{ fontSize: 12 }}>{plan.name}</Text>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>计划条数 </Text>
                  <Text style={{ fontSize: 12 }}>{plan.stats}</Text>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>适用机构 </Text>
                  <Text style={{ fontSize: 12 }}>{plan.scope}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail Panel */}
        <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0 20px' }}>
            <Tabs defaultActiveKey="1" items={[
              { key: '1', label: '全部' },
              { key: '2', label: '检查拓展信息' },
              { key: '3', label: '检验拓展信息' },
              { key: '4', label: '治疗拓展信息' },
              { key: '5', label: '病理拓展信息' },
              { key: '6', label: '其他项目拓展信息' },
            ]} />
          </div>
          <div style={{ padding: '12px 20px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
            <Row gutter={[16, 12]} align="middle">
              <Col span={6}>
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
                  <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>项目检索:</span>
                  <Input placeholder="项目名称/项目代码" />
                </div>
              </Col>
              <Col span={10} style={{ textAlign: 'right' }}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />}>查询</Button>
                  <Button type="primary" icon={<ReloadOutlined />}>重新校验</Button>
                  <Button icon={<ExportOutlined />}>导出</Button>
                </Space>
              </Col>
              <Col span={24}>
                <Space size={16} wrap>
                  <Checkbox>总价为0</Checkbox>
                  <Checkbox>无执行科室</Checkbox>
                  <Checkbox>无申请单分类</Checkbox>
                  <Checkbox>检查项目无部位</Checkbox>
                  <Checkbox>检验项目无标本</Checkbox>
                  <Checkbox>检查项目未设置胶片</Checkbox>
                  <Checkbox>无联动收费</Checkbox>
                </Space>
              </Col>
            </Row>
          </div>
          <div style={{ flex: 1, padding: 0 }}>
            <Table 
              columns={columns} 
              dataSource={maintenanceTableData} 
              pagination={false}
              size="small"
              bordered
              scroll={{ x: 1800, y: 'calc(100vh - 380px)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalProjectMaintenance;

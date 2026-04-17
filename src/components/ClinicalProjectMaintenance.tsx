/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import * as antd from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { maintenanceService, MaintenanceItem } from '../services/maintenanceService';
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
  Checkbox,
  Alert,
} = antd;

const { Text } = Typography;

// Mock Data for Maintenance Plan List
// Removed as it is now fetched from planService via Vue component

// Mock Data for Maintenance Table
// Removed as it is now fetched from maintenanceService

const ClinicalProjectMaintenance: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [data, setData] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(false);

  const isEditable = selectedPlan?.status === '0' || selectedPlan?.status === '3';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await maintenanceService.getMaintenanceData();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, []);

  const columns = [
    { title: '项目代码', dataIndex: 'code', key: 'code', width: 100 },
    { title: '项目分类', dataIndex: 'category', key: 'category', width: 100 },
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 120 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '总价', dataIndex: 'price', key: 'price', width: 80 },
    { title: '关联的价表项目', dataIndex: 'linkedPriceItems', key: 'linkedPriceItems', width: 150 },
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
        <div style={{ width: 300, background: '#fff', borderRight: '1px solid #e8e8e8' }}>
          <PlanList 
            planType="400" 
            onSelect={(plan) => setSelectedPlan(plan)}
          />
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
                  <Button type="primary" icon={<ReloadOutlined />} disabled={!isEditable}>重新校验</Button>
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
              dataSource={data} 
              loading={loading}
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

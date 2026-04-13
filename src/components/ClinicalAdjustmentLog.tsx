/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import * as antd from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { logService, LogEntry } from '../services/logService';

const { 
  Table,
  Button,
  Space,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
} = antd;

const { RangePicker } = DatePicker;

// Mock Data for Adjustment Log
// Removed as it is now fetched from logService

const ClinicalAdjustmentLog: React.FC = () => {
  const [data, setData] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await logService.getLogs();
      // Map service data to component expected structure if needed
      // For now, I'll just use the service data directly but might need mapping
      // The service data is slightly different from the component's mock data
      // I'll update the service to match the component's structure or vice versa
      setData(result); 
      setLoading(false);
    };
    fetchData();
  }, []);

  const columns = [
    { title: '类别', dataIndex: 'category', key: 'category', width: 80 },
    { title: '项目代码', dataIndex: 'code', key: 'code', width: 100 },
    { title: '项目分类', dataIndex: 'projectCategory', key: 'projectCategory', width: 100 },
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 180 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '规格', dataIndex: 'specs', key: 'specs', width: 80 },
    { title: '计划生效时间', dataIndex: 'planEffectiveTime', key: 'planEffectiveTime', width: 180 },
    { title: '调整类型', dataIndex: 'adjustmentType', key: 'adjustmentType', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
    { title: '生效时间', dataIndex: 'effectiveTime', key: 'effectiveTime', width: 180 },
    { 
      title: '操作', 
      key: 'action', 
      render: (_: any, record: any) => (
        record.status === '失败' ? <Button type="link" size="small">查看失败原因</Button> : null
      )
    },
  ];

  return (
    <div style={{ padding: '12px 20px', flex: 1, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Filters */}
      <div style={{ marginBottom: 16, padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
        <Row gutter={[16, 12]} align="middle">
          <Col>
            <Space>
              <span>计划生效时间:</span>
              <RangePicker style={{ width: 240 }} placeholder={['开始日期', '结束日期']} />
            </Space>
          </Col>
          <Col>
            <Space>
              <span>状态:</span>
              <Select 
                placeholder="成功/失败" 
                style={{ width: 120 }} 
                options={[
                  { value: 'success', label: '成功' },
                  { value: 'fail', label: '失败' }
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <span>项目类别:</span>
              <Select 
                placeholder="价表/临床" 
                style={{ width: 120 }} 
                options={[
                  { value: 'price', label: '价表' },
                  { value: 'clinical', label: '临床' }
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <span>调整类型:</span>
              <Select 
                placeholder="启用/调整/停用" 
                style={{ width: 140 }} 
                options={[
                  { value: 'enable', label: '启用' },
                  { value: 'adjust', label: '调整' },
                  { value: 'disable', label: '停用' }
                ]}
              />
            </Space>
          </Col>
          <Col flex="auto">
            <Space style={{ width: '100%' }}>
              <span>项目名称:</span>
              <Input placeholder="请输入项目名称" style={{ width: 200 }} />
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          </Col>
        </Row>
      </div>

      {/* Table */}
      <div style={{ flex: 1 }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          loading={loading}
          pagination={false}
          size="small"
          bordered
          scroll={{ x: 1300, y: 'calc(100vh - 200px)' }}
        />
      </div>
    </div>
  );
};

export default ClinicalAdjustmentLog;

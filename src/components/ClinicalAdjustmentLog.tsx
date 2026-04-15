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
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 20,
    queryString: '',
    itemType: undefined as string | undefined,
    adjustType: undefined as string | undefined,
    beginDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await logService.getLogs({
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        queryString: params.queryString,
        itemType: params.itemType,
        adjustType: params.adjustType,
        beginDate: params.beginDate,
        endDate: params.endDate,
      });
      if (result.code === 'SUCCESS') {
        setData(result.data.dataInfo.data);
        setTotal(result.data.dataInfo.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.pageNum, params.pageSize]);

  const handleSearch = () => {
    setParams(prev => ({ ...prev, pageNum: 1 }));
    fetchData();
  };

  const columns = [
    { title: '类别', dataIndex: 'itemTypeName', key: 'itemTypeName', width: 80 },
    { title: '项目代码', dataIndex: 'itemCode', key: 'itemCode', width: 100 },
    { title: '项目分类', dataIndex: 'itemClassName', key: 'itemClassName', width: 100 },
    { title: '项目名称', dataIndex: 'itemName', key: 'itemName', width: 180 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '规格', dataIndex: 'spec', key: 'spec', width: 80 },
    { title: '计划生效时间', dataIndex: 'planBeginTime', key: 'planBeginTime', width: 180 },
    { 
      title: '调整类型', 
      dataIndex: 'adjustType', 
      key: 'adjustType', 
      width: 100,
      render: (text: string) => {
        if (text === 'U') return '调整';
        if (text === 'A') return '启用';
        if (text === 'D') return '停用';
        return text;
      }
    },
    { 
      title: '状态', 
      dataIndex: ['latestLog', 'result'], 
      key: 'status', 
      width: 80,
      render: (result: number) => result === 1 ? '成功' : '失败'
    },
    { title: '生效时间', dataIndex: ['latestLog', 'executionTime'], key: 'executionTime', width: 180 },
    { 
      title: '操作', 
      key: 'action', 
      render: (_: any, record: LogEntry) => {
        if (record.latestLog?.result === 1) {
          const type = record.adjustType;
          if (type === 'U') return '调整';
          if (type === 'A') return '启用';
          if (type === 'D') return '停用';
          return type;
        }
        return <Button type="link" size="small">查看失败原因</Button>;
      }
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
              <RangePicker 
                style={{ width: 240 }} 
                placeholder={['开始日期', '结束日期']} 
                onChange={(dates) => {
                  setParams(prev => ({
                    ...prev,
                    beginDate: dates?.[0]?.format('YYYY-MM-DD'),
                    endDate: dates?.[1]?.format('YYYY-MM-DD'),
                  }));
                }}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <span>项目类别:</span>
              <Select 
                placeholder="全部" 
                style={{ width: 120 }} 
                allowClear
                value={params.itemType}
                onChange={(val) => setParams(prev => ({ ...prev, itemType: val }))}
                options={[
                  { value: '100', label: '价表' },
                  { value: '200', label: '临床' },
                  { value: '400', label: '临床拓展' }
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <span>调整类型:</span>
              <Select 
                placeholder="全部" 
                style={{ width: 140 }} 
                allowClear
                value={params.adjustType}
                onChange={(val) => setParams(prev => ({ ...prev, adjustType: val }))}
                options={[
                  { value: 'A', label: '启用' },
                  { value: 'U', label: '调整' },
                  { value: 'D', label: '停用' }
                ]}
              />
            </Space>
          </Col>
          <Col flex="auto">
            <Space style={{ width: '100%' }}>
              <span>项目名称:</span>
              <Input 
                placeholder="请输入名称或编码" 
                style={{ width: 200 }} 
                value={params.queryString}
                onChange={(e) => setParams(prev => ({ ...prev, queryString: e.target.value }))}
                onPressEnter={handleSearch}
              />
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
          </Col>
        </Row>
      </div>

      {/* Table */}
      <div style={{ flex: 1 }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          loading={loading}
          pagination={{
            current: params.pageNum,
            pageSize: params.pageSize,
            total: total,
            showSizeChanger: true,
            onChange: (page, size) => setParams(prev => ({ ...prev, pageNum: page, pageSize: size })),
            showTotal: (total) => `共 ${total} 条`,
          }}
          size="small"
          bordered
          scroll={{ x: 1300, y: 'calc(100vh - 250px)' }}
        />
      </div>
    </div>
  );
};

export default ClinicalAdjustmentLog;

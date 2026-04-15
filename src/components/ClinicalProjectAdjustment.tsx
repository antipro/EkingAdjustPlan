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
import ClinicalItemModal from './ClinicalItemModal';
import AdjustLinkedPriceItemsModal from './AdjustLinkedPriceItemsModal';

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
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ClinicalItem | null>(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 20,
    queryString: '',
  });

  const fetchItems = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    
    let adjustTypes: string[] = [];
    if (activeTab === '1') adjustTypes = ['I', 'E'];
    else if (activeTab === '2') adjustTypes = ['U'];
    else if (activeTab === '3') adjustTypes = ['D'];

    const result = await clinicalProjectService.getItems({
      planId: selectedPlan.id,
      queryString: params.queryString,
      adjustTypes,
      pageNum: params.pageNum,
      pageSize: params.pageSize,
    });

    if (Array.isArray(result)) {
      setItems(result);
      setTotal(result.length);
    } else if (result?.code === 'SUCCESS') {
      setItems(result.data.dataInfo.data);
      setTotal(result.data.dataInfo.totalNum);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab, selectedPlan, params.pageNum, params.pageSize]);

  const handleSearch = () => {
    setParams(prev => ({ ...prev, pageNum: 1 }));
    fetchItems();
  };

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      antd.message.warning('请先选择要删除的项目');
      return;
    }

    antd.Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个项目吗？`,
      onOk: async () => {
        try {
          const res = await clinicalProjectService.deleteItems({
            planId: selectedPlan?.id || '1241369796516249600',
            idList: selectedRowKeys.map(key => key.toString()),
          });
          if (res.code === 'SUCCESS') {
            antd.message.success(res.sucMsg);
            setSelectedRowKeys([]);
            fetchItems();
          }
        } catch (e) {
          antd.message.error('删除失败');
        }
      }
    });
  };

  const columns = [
    { title: '生效', dataIndex: 'active', key: 'active', width: 60 },
    { title: '来源', dataIndex: 'source', key: 'source', width: 120 },
    { title: '项目代码', dataIndex: ['detail', 'clinicCode'], key: 'clinicCode', width: 100 },
    { title: '项目分类', dataIndex: ['detail', 'clinicClassName'], key: 'clinicClassName', width: 100 },
    { title: '项目名称', dataIndex: ['detail', 'clinicName'], key: 'clinicName', width: 150 },
    { title: '单位', dataIndex: ['detail', 'unit'], key: 'unit', width: 60 },
    { 
      title: '关联的价表项目', 
      key: 'linkedItems', 
      width: 300,
      render: (record: ClinicalItem) => {
        const priceList = record.detail?.priceList || [];
        return (
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            {priceList.map((p: any) => (
              <div key={p.id} style={{ fontSize: 12, borderBottom: '1px solid #f0f0f0', padding: '2px 0' }}>
                <Text type="secondary">[{p.itemCode}] </Text>
                <Text>{p.itemName}</Text>
                <Text type="warning" style={{ marginLeft: 4 }}>x{p.quantity}{p.unit}</Text>
              </div>
            ))}
          </Space>
        );
      }
    },
    { title: '备注说明', dataIndex: ['detail', 'remark'], key: 'remarks' },
  ];

  const adjustColumns = [
    { 
      title: '调整类型', 
      dataIndex: 'adjustType', 
      key: 'adjustType', 
      width: 80,
      render: (text: string) => {
        if (text === 'U') return <Tag color="orange">修改</Tag>;
        if (text === 'A') return <Tag color="green">新增</Tag>;
        if (text === 'D') return <Tag color="red">停用</Tag>;
        return text;
      }
    },
    { title: '项目代码', dataIndex: ['detail', 'clinicCode'], key: 'clinicCode', width: 100 },
    { title: '项目分类', dataIndex: ['detail', 'clinicClassName'], key: 'clinicClassName', width: 100 },
    { 
      title: '项目名称', 
      dataIndex: ['detail', 'clinicName'], 
      key: 'clinicName', 
      width: 150,
      render: (text: string, record: ClinicalItem) => {
        try {
          const changes = JSON.parse(record.changes || '{}');
          if (changes.clinicName) {
            return (
              <span>
                <Text delete type="secondary">{changes.clinicName.before}</Text>
                <br />
                <Text type="success">{changes.clinicName.after}</Text>
              </span>
            );
          }
        } catch (e) {}
        return text;
      }
    },
    { title: '单位', dataIndex: ['detail', 'unit'], key: 'unit', width: 60 },
    { 
      title: '关联的价表项目', 
      key: 'linkedItems', 
      width: 300,
      render: (record: ClinicalItem) => {
        const priceList = record.detail?.priceList || [];
        return (
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            {priceList.map((p: any) => (
              <div key={p.id} style={{ fontSize: 12, borderBottom: '1px solid #f0f0f0', padding: '2px 0' }}>
                <Text type="secondary">[{p.itemCode}] </Text>
                <Text>{p.itemName}</Text>
                <Text type="warning" style={{ marginLeft: 4 }}>x{p.quantity}{p.unit}</Text>
              </div>
            ))}
          </Space>
        );
      }
    },
    { 
      title: '变动详情', 
      dataIndex: 'changes', 
      key: 'changes',
      render: (text: string) => {
        try {
          const changes = JSON.parse(text || '{}');
          const fieldMap: Record<string, string> = {
            clinicName: '项目名称',
            clinicCode: '项目编码',
            spec: '规格',
            unit: '单位',
            clinicClassName: '项目分类',
            inpEnable: '住院开立',
            outpEnable: '门诊开立',
            daysLimit: '开立限定天数',
          };

          const changeList = Object.entries(changes).map(([key, value]: [string, any]) => {
            const label = fieldMap[key] || key;
            return (
              <div key={key} style={{ marginBottom: 2 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>{label}: </Text>
                <Text delete type="secondary" style={{ fontSize: 12 }}>{value.before || '[空]'}</Text>
                <Text style={{ margin: '0 4px', fontSize: 12 }}>{'->'}</Text>
                <Text type="success" strong style={{ fontSize: 12 }}>{value.after || '[空]'}</Text>
              </div>
            );
          });

          return changeList.length > 0 ? <div>{changeList}</div> : <Text type="secondary">无变动</Text>;
        } catch (e) {
          return text;
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (record: ClinicalItem) => (
        <Space>
          <Button type="link" size="small" onClick={() => {
            setEditingItem(record);
            setAdjustModalVisible(true);
          }}>编辑</Button>
          <Button type="link" size="small" danger>移除</Button>
        </Space>
      )
    }
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
                    <Input 
                      placeholder="项目名称/项目代码" 
                      value={params.queryString}
                      onChange={(e) => setParams(prev => ({ ...prev, queryString: e.target.value }))}
                      onPressEnter={handleSearch}
                    />
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
                    <Button type="primary" ghost icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                  </Space>
                </Col>
              </Row>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>添加</Button>
                  <Dropdown menu={{ items: [{ key: '1', label: '移除', onClick: handleBatchDelete }] }}>
                    <Button size="small" icon={<ImportOutlined />}>导入 <DownOutlined /></Button>
                  </Dropdown>
                </Space>
                <Dropdown menu={{ items: [{ key: '1', label: '移除', onClick: handleBatchDelete }] }} danger>
                  <Button size="small" danger onClick={handleBatchDelete}>批量移除 <DownOutlined /></Button>
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
                    <Input 
                      placeholder="项目名称/项目代码" 
                      value={params.queryString}
                      onChange={(e) => setParams(prev => ({ ...prev, queryString: e.target.value }))}
                      onPressEnter={handleSearch}
                    />
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
                    <Button type="primary" ghost icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                  </Space>
                </Col>
              </Row>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>新增</Button>
                  <Dropdown menu={{ items: [{ key: '1', label: '导入' }] }}>
                    <Button size="small" icon={<ImportOutlined />}>导入 <DownOutlined /></Button>
                  </Dropdown>
                  <Button size="small">添加停用项</Button>
                </Space>
                <Dropdown menu={{ items: [{ key: '1', label: '移除', onClick: handleBatchDelete }] }} danger>
                  <Button size="small" danger onClick={handleBatchDelete}>批量移除 <DownOutlined /></Button>
                </Dropdown>
              </div>
            </>
          )}
        </div>
        <div style={{ flex: 1, padding: 0 }}>
          <Table 
            rowSelection={{ 
              type: 'checkbox',
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys)
            }}
            columns={activeTab === '2' ? adjustColumns : columns} 
            dataSource={items} 
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
            scroll={{ x: 1500, y: 'calc(100vh - 400px)' }}
          />
          <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
            <Text type="secondary" style={{ marginRight: 16 }}>共{items.length}条</Text>
            <Space>
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
              <Text type="secondary" style={{ color: '#1890ff' }}>提示: 导入后请手动关联价表项目、持续性计费规则等</Text>
            </Space>
          </div>
        </div>
      </div>
      <ClinicalItemModal 
        visible={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        onOk={(values) => {
          console.log('New Clinical Item:', values);
          setModalVisible(false);
          antd.message.success('添加成功');
        }}
      />
      <AdjustLinkedPriceItemsModal
        visible={adjustModalVisible}
        item={editingItem}
        onCancel={() => setAdjustModalVisible(false)}
        onSave={(data) => {
          console.log('Adjusted Price Items:', data);
          setAdjustModalVisible(false);
          antd.message.success('保存成功');
        }}
      />
    </div>
  );
};

export default ClinicalProjectAdjustment;

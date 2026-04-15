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
import PriceItemModal from './PriceItemModal';
import ReplacementItemModal from './ReplacementItemModal';
import AdjustLinkedPriceItemsModal from './AdjustLinkedPriceItemsModal';
import AddItemTransferModal from './AddItemTransferModal';

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
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferModalStatus, setTransferModalStatus] = useState('0');
  const [replacementModalVisible, setReplacementModalVisible] = useState(false);
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [editingLinkedItem, setEditingLinkedItem] = useState<LinkedClinicalItem | null>(null);

  const isEditable = selectedPlan?.status === '0' || selectedPlan?.status === '3';

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

    const result = await priceListService.getItems({
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

    if (activeTab === '3') {
      const linkedData = await priceListService.getLinkedClinicalItems();
      setLinkedItems(linkedData);
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

  const handleBatchSave = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    try {
      const res = await priceListService.batchSave({
        planId: selectedPlan.id,
        itemList: items,
      });
      if (res.code === 'SUCCESS') {
        antd.message.success('保存成功');
      } else {
        antd.message.error(res.sucMsg || '保存失败');
      }
    } catch (e) {
      antd.message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

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
    { 
      title: '调整类型', 
      dataIndex: 'adjustType', 
      key: 'adjustType', 
      width: 80,
      render: (text: string) => {
        if (text === 'U') return <Tag color="orange">修改</Tag>;
        if (text === 'I') return <Tag color="green">新增</Tag>;
        if (text === 'E') return <Tag color="cyan">启用</Tag>;
        if (text === 'D') return <Tag color="red">停用</Tag>;
        if (text === 'A') return <Tag color="green">新增</Tag>; // Keep A for backward compatibility with mock
        return text;
      }
    },
    { title: '收费项目编码', dataIndex: ['detail', 'itemCode'], key: 'itemCode', width: 120 },
    { 
      title: '项目名称', 
      dataIndex: ['detail', 'itemName'], 
      key: 'itemName', 
      width: 150,
      render: (text: string, record: PriceItem) => {
        try {
          const changes = JSON.parse(record.changes || '{}');
          if (changes.itemName) {
            return (
              <span>
                <Text delete type="secondary">{changes.itemName.before}</Text>
                <br />
                <Text type="success">{changes.itemName.after}</Text>
              </span>
            );
          }
        } catch (e) {}
        return text;
      }
    },
    { title: '规格', dataIndex: ['detail', 'spec'], key: 'spec', width: 100 },
    { title: '单位', dataIndex: ['detail', 'unit'], key: 'unit', width: 60 },
    { 
      title: '价格变动', 
      key: 'priceChanges', 
      width: 200,
      render: (record: PriceItem) => {
        const priceList = record.detail?.priceList || [];
        return (
          <Space direction="vertical" size={0}>
            {priceList.map((p: any) => (
              <div key={p.priceLevelUniqueCode}>
                <Text type="secondary">等级{p.priceLevelCode}: </Text>
                <Text strong>{p.retaBasicPrice}</Text>
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
            itemName: '项目名称',
            itemCode: '项目编码',
            spec: '规格',
            unit: '单位',
            itemClassName: '项目分类',
            hpFeeName: '医保费用名称',
            statisTypeName: '统计分类名称',
            outRcptName: '门诊发票名称',
            inRcptName: '住院发票名称',
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
      width: 100,
      render: () => (
        <Space>
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small" danger disabled={!isEditable}>移除</Button>
        </Space>
      )
    }
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
          <Button type="link" size="small" style={{ padding: 0 }} onClick={() => setReplacementModalVisible(true)} disabled={!isEditable}>替换项</Button>
          <Button type="link" size="small" danger style={{ padding: 0 }} disabled={!isEditable}>移除</Button>
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
      render: (text: string, record: LinkedClinicalItem) => (
        <Select 
          value={text} 
          style={{ width: '100%' }}
          onChange={(value) => {
            if (!isEditable) return;
            const newLinkedItems = linkedItems.map(item => 
              item.key === record.key ? { ...item, processType: value } : item
            );
            setLinkedItems(newLinkedItems);
          }}
          disabled={!isEditable}
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
      render: (_: any, record: LinkedClinicalItem) => {
        const disabled = !isEditable || ['替换', '停用临床', '移除'].includes(record.processType);
        return (
          <Space>
            <Button 
              type="link" 
              size="small" 
              disabled={disabled}
              onClick={() => {
                setEditingLinkedItem(record);
                setAdjustModalVisible(true);
              }}
            >
              编辑
            </Button>
            <Button type="link" size="small">查看</Button>
          </Space>
        );
      }
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
                    <Input 
                      placeholder="项目名称/代码/收费项目编码" 
                      value={params.queryString}
                      onChange={(e) => setParams(prev => ({ ...prev, queryString: e.target.value }))}
                      onPressEnter={handleSearch}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <Space size={16}>
                    <antd.Checkbox>无变动</antd.Checkbox>
                    <antd.Checkbox>仅价格变动</antd.Checkbox>
                  </Space>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Button type="primary" ghost icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                </Col>
              </Row>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => {
                    setTransferModalStatus('0');
                    setTransferModalVisible(true);
                  }} disabled={!isEditable}>添加</Button>
                  <Dropdown menu={{ items: [{ key: '1', label: '导入' }] }} disabled={!isEditable}>
                    <Button size="small" icon={<ImportOutlined />} disabled={!isEditable}>导入 <DownOutlined /></Button>
                  </Dropdown>
                </Space>
                <Dropdown menu={{ items: [{ key: '1', label: '移除' }] }} danger disabled={!isEditable}>
                  <Button size="small" danger disabled={!isEditable}>批量移除 <DownOutlined /></Button>
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
                    <Input 
                      placeholder="项目名称/代码/收费项目编码" 
                      value={params.queryString}
                      onChange={(e) => setParams(prev => ({ ...prev, queryString: e.target.value }))}
                      onPressEnter={handleSearch}
                    />
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
                  <Button type="primary" ghost icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                </Col>
              </Row>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => {
                    setTransferModalStatus('0');
                    setTransferModalVisible(true);
                  }} disabled={!isEditable}>添加</Button>
                  <Dropdown menu={{ items: [{ key: '1', label: '导入' }] }} disabled={!isEditable}>
                    <Button size="small" icon={<ImportOutlined />} disabled={!isEditable}>导入 <DownOutlined /></Button>
                  </Dropdown>
                  <Button size="small" type="primary">导出临床项目</Button>
                </Space>
                <Dropdown menu={{ items: [{ key: '1', label: '移除' }] }} danger disabled={!isEditable}>
                  <Button size="small" danger disabled={!isEditable}>批量移除 <DownOutlined /></Button>
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
                    <Input 
                      placeholder="项目名称/代码/收费项目编码" 
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
                    <span style={{ whiteSpace: 'nowrap', marginRight: 8 }}>1对1创建临床项目:</span>
                    <Select 
                      defaultValue="yes" 
                      style={{ width: '100%' }}
                      options={[{ value: 'yes', label: '是/否' }]}
                    />
                  </div>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Button type="primary" ghost icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                </Col>
              </Row>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setModalVisible(true)} disabled={!isEditable}>新增</Button>
                  <Dropdown menu={{ items: [{ key: '1', label: '导入' }] }} disabled={!isEditable}>
                    <Button size="small" icon={<ImportOutlined />} disabled={!isEditable}>导入 <DownOutlined /></Button>
                  </Dropdown>
                  <Button size="small" onClick={() => {
                    setTransferModalStatus('1');
                    setTransferModalVisible(true);
                  }} disabled={!isEditable}>添加停用项</Button>
                  <Dropdown menu={{ items: [{ key: '1', label: '创建' }] }} disabled={!isEditable}>
                    <Button size="small" type="primary" disabled={!isEditable}>1对1创建临床项目 <DownOutlined /></Button>
                  </Dropdown>
                </Space>
                <Dropdown menu={{ items: [{ key: '1', label: '删除' }] }} danger disabled={!isEditable}>
                  <Button size="small" danger disabled={!isEditable}>批量删除 <DownOutlined /></Button>
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
            scroll={{ x: 1500, y: activeTab === '3' ? 300 : 'calc(100vh - 400px)' }}
          />
          {activeTab === '3' && (
            <div style={{ marginTop: 20, border: '1px solid #1890ff', borderRadius: 4 }}>
              <div style={{ padding: '8px 16px', background: '#e6f7ff', borderBottom: '1px solid #1890ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <span style={{ color: '#1890ff', fontWeight: 'bold' }}>| 关联的临床项目</span>
                  <antd.Checkbox style={{ marginLeft: 20 }}>仅显示未设置处理方式的项目</antd.Checkbox>
                </Space>
                <Space>
                  <Button size="small" type="primary" ghost disabled={!isEditable}>替换</Button>
                  <Button size="small" danger ghost disabled={!isEditable}>移除</Button>
                  <Button size="small" type="primary" ghost disabled={!isEditable}>停用临床</Button>
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
                  <Button type="primary" disabled={!isEditable}>处理完成</Button>
                  <Button disabled={!isEditable}>暂存</Button>
                </Space>
              </div>
            </div>
          )}
          <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary">共{items.length}条</Text>
            <Button type="primary" onClick={handleBatchSave} disabled={!isEditable}>保存</Button>
          </div>
        </div>
      </div>
      <PriceItemModal 
        visible={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        onOk={(values) => {
          const newItem: PriceItem = {
            key: Math.random().toString(36).substring(7),
            name: values.name,
            code: values.itemCode,
            specs: values.specs,
            unit: values.unit,
            category: values.category,
            adjustType: 'I',
            remarks: values.remarks,
          };
          setItems(prev => [newItem, ...prev]);
          setModalVisible(false);
          antd.message.success('新增成功');
        }} 
      />
      <AddItemTransferModal
        visible={transferModalVisible}
        status={transferModalStatus}
        onCancel={() => setTransferModalVisible(false)}
        onSave={(selectedItems) => {
          let type = 'U';
          if (activeTab === '1') type = 'E';
          else if (activeTab === '3') type = 'D';

          const newItems: PriceItem[] = selectedItems.map(item => ({
            key: item.id,
            name: item.itemName,
            code: item.itemCode,
            specs: item.spec,
            unit: item.unit,
            category: item.itemClassName,
            adjustType: type,
            detail: item
          }));

          setItems(prev => [...newItems, ...prev]);
          setTransferModalVisible(false);
          antd.message.success(`成功添加 ${selectedItems.length} 个项目`);
        }}
      />
      <ReplacementItemModal
        visible={replacementModalVisible}
        onCancel={() => setReplacementModalVisible(false)}
        onSave={(item) => {
          console.log('Selected Replacement Item:', item);
          setReplacementModalVisible(false);
          antd.message.success('替换项保存成功');
        }}
      />
      <AdjustLinkedPriceItemsModal
        visible={adjustModalVisible}
        item={editingLinkedItem}
        onCancel={() => setAdjustModalVisible(false)}
        onSave={(data) => {
          console.log('Adjusted Linked Items:', data);
          setAdjustModalVisible(false);
          antd.message.success('保存成功');
        }}
      />
    </div>
  );
};

export default PriceListAdjustment;

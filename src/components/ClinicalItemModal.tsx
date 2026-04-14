/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as antd from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Row, 
  Col, 
  Button, 
  Table, 
  Checkbox, 
  Divider,
  Tag,
  Radio,
} = antd;

interface ClinicalItemModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const ClinicalItemModal: React.FC<ClinicalItemModalProps> = ({ visible, onCancel, onOk }) => {
  const [form] = Form.useForm();

  const ruleColumns = [
    { title: '规则代码', dataIndex: 'ruleCode', key: 'ruleCode' },
    { title: '最小计价数量', dataIndex: 'minQty', key: 'minQty' },
    { title: '舍入规则', dataIndex: 'roundRule', key: 'roundRule' },
    { 
      title: '操作', 
      key: 'action',
      width: 60,
      render: () => <Button type="link" danger icon={<DeleteOutlined />} size="small" />
    },
  ];

  const priceItemColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 50 },
    { 
      title: '主项', 
      dataIndex: 'isMain', 
      key: 'isMain', 
      width: 50,
      render: (val: boolean) => <Checkbox checked={val} />
    },
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { title: '规格', dataIndex: 'specs', key: 'specs' },
    { title: '单价', dataIndex: 'price', key: 'price' },
    { title: '数量', dataIndex: 'qty', key: 'qty', width: 80, render: (val: number) => <Input size="small" defaultValue={val} /> },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '物价码', dataIndex: 'priceCode', key: 'priceCode' },
    { 
      title: '计费', 
      dataIndex: 'isCharge', 
      key: 'isCharge', 
      width: 50,
      render: (val: boolean) => <Checkbox checked={val} />
    },
    { title: '项目', dataIndex: 'item', key: 'item' },
    { 
      title: '操作', 
      key: 'action',
      width: 60,
      render: () => <Button type="link" danger icon={<DeleteOutlined />} size="small" />
    },
  ];

  const mockRuleData = [
    { key: '1', ruleCode: '首日规则', minQty: 1, roundRule: '向上取整' },
    { key: '2', ruleCode: '末日规则', minQty: 1, roundRule: '向下取整' },
  ];

  const mockPriceItemData = [
    { 
      key: '1', 
      index: 1, 
      isMain: false, 
      name: '心电监测 / 7 小时81260', 
      specs: '/', 
      price: 7, 
      qty: 1, 
      unit: '小时', 
      priceCode: '310701022', 
      isCharge: true 
    },
    { 
      key: '2', 
      index: 2, 
      isMain: false, 
      name: '门体静脉断流术 / 3200 次 82240', 
      specs: '/', 
      price: 3200, 
      qty: 1, 
      unit: '次', 
      priceCode: '331008026', 
      isCharge: true 
    },
  ];

  return (
    <Modal
      title="临床价表项目"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={1000}
      okText="确认"
      cancelText="取消"
      styles={{ body: { padding: '0 24px 24px' } }}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onOk}
        initialValues={{
          category: '处置',
          itemCode: 'C000115',
          name: '持续心电监测',
          scope: ['住院使用'],
          limit: '不限',
          highRisk: '非高风险',
          unit: '小时',
          pyCode: 'CXXDJC',
          isContinuous: true,
        }}
        size="small"
      >
        <Divider orientation="left" plain style={{ margin: '16px 0 8px', fontSize: 12, color: '#999' }}>基本信息</Divider>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="项目分类" name="category" rules={[{ required: true }]}>
              <Select options={[{ value: '处置', label: '处置' }]} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="项目代码" name="itemCode">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="项目名称" name="name" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="别名" name="alias" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="link" icon={<PlusOutlined />} size="small">添加</Button>
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="适用范围" name="scope" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
              <Checkbox.Group options={['门诊使用', '住院使用', '体检使用']} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="长临限制" name="limit" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
              <Radio.Group optionType="button" buttonStyle="solid">
                <Radio.Button value="不限">不限</Radio.Button>
                <Radio.Button value="长期">长期</Radio.Button>
                <Radio.Button value="临时">临时</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="互联网医院" name="isInternet" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} valuePropName="checked">
              <Checkbox />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="处置划价" name="priceType" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
              <Select placeholder="请选择" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="适宜技术" name="isSuitable" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} valuePropName="checked">
              <Checkbox />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="治疗属性" name="attr" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
              <Checkbox.Group options={['康复治疗', '放射治疗', '营养治疗']} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="特殊医嘱类型" name="specialType" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
              <Select placeholder="选择特殊医嘱" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="高风险标识" name="highRisk">
              <Radio.Group optionType="button" buttonStyle="solid">
                <Radio.Button value="非高风险">非高风险</Radio.Button>
                <Radio.Button value="高风险">高风险</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="拼音码" name="pyCode">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="单位" name="unit" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="规格" name="specs">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="备注说明" name="remarks" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="开立限定天数" name="daysLimit">
              <Input suffix="天" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain style={{ margin: '16px 0 8px', fontSize: 12, color: '#999' }}>规则</Divider>
        
        <Form.Item name="isContinuous" valuePropName="checked" style={{ marginBottom: 8 }}>
          <Checkbox>持续性标识</Checkbox>
        </Form.Item>

        <Table 
          columns={ruleColumns} 
          dataSource={mockRuleData} 
          pagination={false} 
          size="small" 
          bordered 
        />
        
        <Button icon={<PlusOutlined />} style={{ marginTop: 8 }} size="small">添加</Button>

        <Divider orientation="left" plain style={{ margin: '16px 0 8px', fontSize: 12, color: '#999' }}>对应价表项目</Divider>
        
        <Form.Item name="isNoCharge" valuePropName="checked" style={{ marginBottom: 8 }}>
          <Checkbox>非计价</Checkbox>
        </Form.Item>

        <Table 
          columns={priceItemColumns} 
          dataSource={mockPriceItemData} 
          pagination={false} 
          size="small" 
          bordered 
          scroll={{ x: 800 }}
        />
        
        <Button icon={<PlusOutlined />} style={{ marginTop: 8 }} size="small">添加</Button>
      </Form>
    </Modal>
  );
};

export default ClinicalItemModal;

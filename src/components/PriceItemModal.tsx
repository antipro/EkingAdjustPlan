/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as antd from 'antd';
import { PlusOutlined } from '@ant-design/icons';

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
} = antd;

import { PriceItem } from '../services/priceListService';

interface PriceItemModalProps {
  visible: boolean;
  item?: PriceItem | null;
  categories?: any[];
  onCancel: () => void;
  onOk: (values: any) => void;
}

const PriceItemModal: React.FC<PriceItemModalProps> = ({ visible, item, categories = [], onCancel, onOk }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (item) {
        const detail = item.detail || {};
        form.setFieldsValue({
          category: item.category || detail.itemClassName || '其它',
          itemCode: item.code || item.itemCode || detail.itemCode,
          name: item.name || detail.itemName,
          specs: item.specs || detail.spec || '/',
          unit: item.unit || detail.unit || '次',
          outRcpt: detail.outRcptName || '诊察费',
          inRcpt: detail.inRcptName || '诊察费',
          recordFront: detail.recordFrontName || '其他费',
          statisType: detail.statisTypeName || '诊察费',
          pyCode: detail.pyCode || '',
          natCode: item.natCode || detail.natCode,
          natName: item.natName || detail.natName,
          remarks: item.remarks || detail.remarks,
          alias: detail.alias,
          outFront: detail.outFront,
          accLarge: detail.accLarge,
          accSmall: detail.accSmall,
          provCode: detail.provCode,
          insLimit: detail.insLimit,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, item, form]);

  const priceColumns = [
    { title: '省', dataIndex: 'province', key: 'province' },
    { title: '物价编码', dataIndex: 'priceCode', key: 'priceCode' },
    { title: '物价等级', dataIndex: 'priceLevel', key: 'priceLevel' },
    { title: '价格', dataIndex: 'price', key: 'price' },
    { 
      title: '操作', 
      key: 'action',
      render: () => <Checkbox>禁用</Checkbox>
    },
  ];

  const mockPriceData = [
    {
      key: '1',
      province: '江苏省',
      priceCode: '20251121002',
      priceLevel: '三级',
      price: '50',
    }
  ];

  return (
    <Modal
      title="价表项目"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
      okText="确认"
      cancelText="取消"
      styles={{ body: { padding: '0 24px 24px' } }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onOk}
        initialValues={{
          category: '其它',
          itemCode: 'I243019',
          name: '多学科诊疗费(每增加一个学科专家加收)',
          specs: '/',
          unit: '次',
          outRcpt: '诊察费',
          inRcpt: '诊察费',
          recordFront: '其他费',
          statisType: '诊察费',
          pyCode: 'DXKLFMZJYGXKZJJS',
        }}
      >
        <Divider orientation="left" plain style={{ margin: '16px 0 8px', fontSize: 12, color: '#999' }}>基本信息</Divider>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="项目分类" name="category" rules={[{ required: true }]}>
              <Select options={categories.length > 0 ? categories : [{ value: '其它', label: '其它' }]} />
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
            <Form.Item label="项目名称" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="别名" name="alias">
              <div style={{ display: 'flex', gap: 8 }}>
                <Tag icon={<PlusOutlined />} style={{ cursor: 'pointer', borderStyle: 'dashed' }}>添加</Tag>
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="规格" name="specs" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="单位" name="unit" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="门诊收据类别" name="outRcpt" rules={[{ required: true }]}>
              <Select options={[{ value: '诊察费', label: '诊察费' }]} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="住院收据类别" name="inRcpt" rules={[{ required: true }]}>
              <Select options={[{ value: '诊察费', label: '诊察费' }]} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="国家收费编码" name="natCode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="国家收费项目名称" name="natName">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="病案首页类别" name="recordFront" rules={[{ required: true }]}>
              <Select options={[{ value: '其他费', label: '其他费' }]} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="统计类别" name="statisType" rules={[{ required: true }]}>
              <Select options={[{ value: '诊察费', label: '诊察费' }]} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="拼音码" name="pyCode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="门诊首页费用类别" name="outFront">
              <Select placeholder="请选择类别" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="会计科目大类" name="accLarge">
              <Select placeholder="请选择类别" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="会计科目小类" name="accSmall">
              <Select placeholder="请选择类别" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="备注说明" name="remarks">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="原省医保编码" name="provCode">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="医保限制信息" name="insLimit">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain style={{ margin: '16px 0 8px', fontSize: 12, color: '#999' }}>按区域及物价等级定价</Divider>
        
        <div style={{ marginBottom: 8, textAlign: 'right' }}>
          <Checkbox>显示全部</Checkbox>
        </div>

        <Table 
          columns={priceColumns} 
          dataSource={mockPriceData} 
          pagination={false} 
          size="small" 
          bordered 
        />
        
        <Button icon={<PlusOutlined />} style={{ marginTop: 12 }} type="primary" ghost>添加</Button>
      </Form>
    </Modal>
  );
};

export default PriceItemModal;

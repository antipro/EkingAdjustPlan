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
  outRcptDict?: any[];
  inRcptDict?: any[];
  mrFeeDict?: any[];
  statisDict?: any[];
  outMrFeeDict?: any[];
  accLargeDict?: any[];
  accSmallDict?: any[];
  unitDict?: any[];
  provinceDict?: any[];
  onCancel: () => void;
  onOk: (values: any) => void;
}

const PriceItemModal: React.FC<PriceItemModalProps> = ({ 
  visible, 
  item, 
  categories = [], 
  outRcptDict = [],
  inRcptDict = [],
  mrFeeDict = [],
  statisDict = [],
  outMrFeeDict = [],
  accLargeDict = [],
  accSmallDict = [],
  unitDict = [],
  provinceDict = [],
  onCancel, 
  onOk 
}) => {
  const [form] = Form.useForm();
  const [priceList, setPriceList] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (visible) {
      if (item) {
        const detail = item.detail || {};
        setPriceList(detail.priceList || []);
        form.setFieldsValue({
          category: detail.itemClassName || '其它',
          itemCode: detail.itemCode,
          name: detail.itemName,
          spec: detail.spec || '/',
          unit: detail.unit || '次',
          outRcpt: detail.outRcptName || '诊察费',
          outRcptCode: detail.outRcptCode,
          inRcpt: detail.inRcptName || '诊察费',
          inRcptCode: detail.inRcptCode,
          recordFront: detail.recordFrontName || '其他费',
          recordFrontCode: detail.recordFrontCode,
          statisType: detail.statisTypeName || '诊察费',
          statisTypeCode: detail.statisTypeCode,
          pyCode: detail.pyCode || '',
          nationChargeItemCode: detail.nationChargeItemCode,
          nationChargeItemName: detail.nationChargeItemName,
          remarks: detail.remarks,
          alias: detail.alias,
          outFront: detail.outFront,
          outFrontCode: detail.outFrontCode,
          accLarge: detail.accLarge,
          accLargeCode: detail.accLargeCode,
          accSmall: detail.accSmall,
          accSmallCode: detail.accSmallCode,
          sybChargeItemCode: detail.sybChargeItemCode,
          insLimit: detail.insLimit,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, item, form]);

  const getCodeFromDict = (value: string, dict: any[]) => {
    const found = dict.find(d => d.label === value || d.value === value);
    return found?.value || '';
  };

  const handleOutRcptChange = (value: string) => {
    const found = outRcptDict.find(d => d.label === value || d.value === value);
    form.setFieldsValue({ outRcpt: found?.label || value, outRcptCode: found?.value });
  };

  const handleInRcptChange = (value: string) => {
    const found = inRcptDict.find(d => d.label === value || d.value === value);
    form.setFieldsValue({ inRcpt: found?.label || value, inRcptCode: found?.value });
  };

  const handleRecordFrontChange = (value: string) => {
    const found = mrFeeDict.find(d => d.label === value || d.value === value);
    form.setFieldsValue({ recordFront: found?.label || value, recordFrontCode: found?.value });
  };

  const handleStatisTypeChange = (value: string) => {
    const found = statisDict.find(d => d.label === value || d.value === value);
    form.setFieldsValue({ statisType: found?.label || value, statisTypeCode: found?.value });
  };

  const handleOutFrontChange = (value: string) => {
    const found = outMrFeeDict.find(d => d.label === value || d.value === value);
    form.setFieldsValue({ outFront: found?.label || value, outFrontCode: found?.value });
  };

  const handleAccLargeChange = (value: string) => {
    const found = accLargeDict.find(d => d.label === value || d.value === value);
    form.setFieldsValue({ accLarge: found?.label || value, accLargeCode: found?.value, accSmall: undefined, accSmallCode: undefined });
  };

  const handleAccSmallChange = (value: string) => {
    const found = accSmallDict.find(d => d.label === value || d.value === value);
    form.setFieldsValue({ accSmall: found?.label || value, accSmallCode: found?.value });
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const updatedValues = {
        ...values,
        priceList,
      };
      onOk(updatedValues);
    });
  };

  const handlePriceListChange = (index: number, field: string, value: any) => {
    const newList = [...priceList];
    newList[index] = { ...newList[index], [field]: value };
    
    // If province changes, update provinceName
    if (field === 'province') {
      const province = provinceDict.find(p => p.value === value);
      if (province) {
        newList[index].provinceName = province.label;
      }
    }
    
    setPriceList(newList);
  };

  const handleAddPriceRow = () => {
    const newRow = {
      priceLevelUniqueCode: `new_${Date.now()}`,
      province: provinceDict[0]?.value || '',
      provinceName: provinceDict[0]?.label || '',
      priceCode: '',
      priceLevelCode: '1',
      retaBasicPrice: 0,
    };
    setPriceList([...priceList, newRow]);
  };

  const priceColumns = [
    { 
      title: '省', 
      dataIndex: 'province', 
      key: 'province',
      render: (text: string, record: any, index: number) => (
        <Select 
          showSearch
          value={text} 
          style={{ width: '100%' }}
          options={provinceDict}
          placeholder="选择省份"
          disabled
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          onChange={(val) => handlePriceListChange(index, 'province', val)}
        />
      )
    },
    { 
      title: '物价编码', 
      dataIndex: 'priceCode', 
      key: 'priceCode',
      render: (text: string, record: any, index: number) => (
        <Input 
          value={text} 
          onChange={(e) => handlePriceListChange(index, 'priceCode', e.target.value)}
        />
      )
    },
    { 
      title: '物价等级', 
      dataIndex: 'priceLevelCode', 
      key: 'priceLevelCode',
      render: (text: string, record: any, index: number) => (
        <Select 
          value={text} 
          style={{ width: '100%' }}
          options={[
            { label: '1 一级', value: '1' },
            { label: '2 二级', value: '2' },
            { label: '3 三级', value: '3' },
          ]}
          onChange={(val) => handlePriceListChange(index, 'priceLevelCode', val)}
        />
      )
    },
    { 
      title: '价格', 
      dataIndex: 'retaBasicPrice', 
      key: 'retaBasicPrice',
      render: (text: number, record: any, index: number) => (
        <antd.InputNumber 
          value={text} 
          style={{ width: '100%' }}
          onChange={(val) => handlePriceListChange(index, 'retaBasicPrice', val)}
        />
      )
    },
    { 
      title: '操作', 
      key: 'action',
      render: (_: any, __: any, index: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox>禁用</Checkbox>
          <Button 
            type="link" 
            danger 
            size="small" 
            onClick={() => {
              const newList = [...priceList];
              newList.splice(index, 1);
              setPriceList(newList);
            }}
          >
            删除
          </Button>
        </div>
      )
    },
  ];

  return (
      <Modal
        title="价表项目"
        open={visible}
        onCancel={onCancel}
        onOk={handleOk}
        width={800}
      okText="确认"
      cancelText="取消"
      styles={{ body: { padding: '0 24px 24px' } }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          category: '其它',
          itemCode: 'I243019',
          name: '多学科诊疗费(每增加一个学科专家加收)',
          spec: '/',
          unit: '次',
          outRcpt: '诊察费',
          inRcpt: '诊察费',
          recordFront: '其他费',
          statisType: '诊察费',
          pyCode: 'DXKLFMZJYGXKZJJS',
        }}
      >
        <Form.Item name="outRcptCode" hidden />
        <Form.Item name="inRcptCode" hidden />
        <Form.Item name="recordFrontCode" hidden />
        <Form.Item name="statisTypeCode" hidden />
        <Form.Item name="outFrontCode" hidden />
        <Form.Item name="accLargeCode" hidden />
        <Form.Item name="accSmallCode" hidden />
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
            <Form.Item label="规格" name="spec" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="单位" name="unit" rules={[{ required: true }]}>
              <Select options={unitDict.length > 0 ? unitDict : [{ value: '次', label: '次' }]} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="门诊收据类别" name="outRcpt" rules={[{ required: true }]}>
              <Select options={outRcptDict.length > 0 ? outRcptDict : [{ value: '诊察费', label: '诊察费' }]} onChange={handleOutRcptChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="住院收据类别" name="inRcpt" rules={[{ required: true }]}>
              <Select options={inRcptDict.length > 0 ? inRcptDict : [{ value: '诊察费', label: '诊察费' }]} onChange={handleInRcptChange} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="国家收费编码" name="nationChargeItemCode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="国家收费项目名称" name="nationChargeItemName">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="病案首页类别" name="recordFront" rules={[{ required: true }]}>
              <Select options={mrFeeDict.length > 0 ? mrFeeDict : [{ value: '其他费', label: '其他费' }]} onChange={handleRecordFrontChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="统计类别" name="statisType" rules={[{ required: true }]}>
              <Select options={statisDict.length > 0 ? statisDict : [{ value: '诊察费', label: '诊察费' }]} onChange={handleStatisTypeChange} />
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
              <Select options={outMrFeeDict} placeholder="请选择类别" onChange={handleOutFrontChange} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="会计科目大类" name="accLarge">
              <Select options={accLargeDict} placeholder="请选择类别" onChange={handleAccLargeChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="会计科目小类" name="accSmall">
              <Select options={accSmallDict} placeholder="请选择类别" onChange={handleAccSmallChange} />
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
            <Form.Item label="原省医保编码" name="sybChargeItemCode">
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
          dataSource={priceList} 
          rowKey="priceLevelUniqueCode"
          pagination={false} 
          size="small" 
          bordered 
        />
        
        <Button 
          icon={<PlusOutlined />} 
          style={{ marginTop: 12 }} 
          type="primary" 
          ghost
          onClick={handleAddPriceRow}
        >
          添加
        </Button>
      </Form>
    </Modal>
  );
};

export default PriceItemModal;

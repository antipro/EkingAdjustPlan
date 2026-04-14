/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as antd from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { 
  Modal, 
  Table, 
  Checkbox, 
  Button, 
  Input, 
  Space, 
  Divider,
  Typography,
  Select,
  Row,
  Col,
} = antd;

const { Text } = Typography;

interface AdjustLinkedPriceItemsModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (data: any) => void;
  item?: any;
}

const AdjustLinkedPriceItemsModal: React.FC<AdjustLinkedPriceItemsModalProps> = ({ 
  visible, 
  onCancel, 
  onSave,
  item 
}) => {
  const columns = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' as const },
    { 
      title: '主项', 
      dataIndex: 'isMain', 
      key: 'isMain', 
      width: 60,
      align: 'center' as const,
      render: (val: boolean) => <Checkbox checked={val} />
    },
    { 
      title: '项目名称', 
      dataIndex: 'name', 
      key: 'name', 
      width: 350,
      render: (text: string, record: any) => {
        if (record.key === '2') {
          return (
            <Select 
              value={text} 
              style={{ width: '100%' }} 
              options={[{ value: text, label: text }]}
            />
          );
        }
        return text;
      }
    },
    { title: '规格', dataIndex: 'specs', key: 'specs', width: 100, align: 'center' as const },
    { title: '单价', dataIndex: 'price', key: 'price', width: 100, align: 'center' as const },
    { 
      title: '数量', 
      dataIndex: 'qty', 
      key: 'qty', 
      width: 100,
      render: (val: number) => <Input size="small" defaultValue={val} style={{ textAlign: 'center' }} />
    },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80, align: 'center' as const, render: (text: string) => <Text type="secondary">{text}</Text> },
    { title: '物价码', dataIndex: 'priceCode', key: 'priceCode', width: 120, align: 'center' as const },
    { 
      title: '计费', 
      dataIndex: 'isCharge', 
      key: 'isCharge', 
      width: 60,
      align: 'center' as const,
      render: (val: boolean) => <Checkbox checked={val} />
    },
    { title: '项目', dataIndex: 'item', key: 'item', width: 60, align: 'center' as const },
    { 
      title: '操作', 
      key: 'action',
      width: 60,
      align: 'center' as const,
      render: () => <Button type="link" danger icon={<DeleteOutlined />} size="small" style={{ border: '1px solid #ffccc7', borderRadius: 4, padding: '0 4px' }} />
    },
  ];

  const mockData = [
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
      isCharge: true,
      item: ''
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
      isCharge: true,
      item: ''
    },
  ];

  return (
    <Modal
      title="调整临床项目的对应价表项目"
      open={visible}
      onCancel={onCancel}
      onOk={() => onSave(mockData)}
      width={1000}
      okText="保存"
      cancelText="取消"
      styles={{ body: { padding: '24px' } }}
    >
      <div style={{ marginBottom: 24 }}>
        <Row gutter={48}>
          <Col>
            <Text type="secondary">项目代码：</Text>
            <Text>{item?.detail?.clinicCode || item?.code || 'XXXXX'}</Text>
          </Col>
          <Col>
            <Text type="secondary">项目名称：</Text>
            <Text>{item?.detail?.clinicName || item?.name || 'XXXXX'}</Text>
          </Col>
        </Row>
      </div>

      <Divider orientation="left" plain style={{ margin: '0 0 16px', borderTopColor: '#d9d9d9' }}>
        <Text strong>对应价表项目</Text>
      </Divider>

      <Table 
        columns={columns} 
        dataSource={mockData} 
        pagination={false} 
        size="small" 
        bordered 
        scroll={{ x: 1100 }}
        style={{ marginBottom: 12 }}
      />
      
      <Button icon={<PlusOutlined />} size="small" style={{ background: '#fff' }}>添加</Button>
    </Modal>
  );
};

export default AdjustLinkedPriceItemsModal;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import * as antd from 'antd';
import dayjs from 'dayjs';

const { 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Typography 
} = antd;

const { Text } = Typography;

interface PlanModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  initialValues?: any;
  titlePrefix: string; // "价表项目" or "临床项目"
  mode: 'create' | 'edit';
}

const PlanModal: React.FC<PlanModalProps> = ({ 
  visible, 
  onCancel, 
  onOk, 
  initialValues, 
  titlePrefix,
  mode 
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialValues) {
        form.setFieldsValue({
          ...initialValues,
          beginDatetime: initialValues.beginDatetime ? dayjs(initialValues.beginDatetime) : null,
          orgIdList: initialValues.orgIdList || [],
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          beginDatetime: dayjs('2026-01-01 00:00:00'),
          orgIdList: [],
        });
      }
    }
  }, [visible, mode, initialValues, form]);

  const title = `${mode === 'create' ? '新建' : '修改'}${titlePrefix}调整计划`;

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
      okText="确定"
      cancelText="取消"
      destroyOnHidden
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        onFinish={onOk}
        style={{ marginTop: 16 }}
      >
        <Form.Item 
          label="生效时间" 
          name="beginDatetime" 
          rules={[{ required: true, message: '请选择生效时间' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item 
          label="计划名称" 
          name="planName" 
          rules={[{ required: true, message: '请输入计划名称' }]}
        >
          <Input placeholder="请输入计划名称" />
        </Form.Item>

        <Form.Item 
          label="政策文件名" 
          name="policy"
        >
          <Input placeholder="请输入政策文件名" />
        </Form.Item>

        <Form.Item 
          label="适用机构" 
          name="orgIdList"
        >
          <Select 
            mode="multiple" 
            placeholder="请选择适用机构"
            options={[
              { value: '711912746777575424', label: '鑫亿云医院' },
              { value: '909521624921800704', label: '鑫亿未来医院' },
              { value: '1037000793053462528', label: '南河镇分院' },
            ]}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5, span: 19 }} style={{ marginBottom: 0 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            新增价表及临床项目启用时自动关联机构，若不设置则关联全部机构。
          </Text>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PlanModal;

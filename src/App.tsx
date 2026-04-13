/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as antd from 'antd';
import {
  AppstoreOutlined,
  DesktopOutlined,
  FileTextOutlined,
  HistoryOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  ImportOutlined,
  DownOutlined,
} from '@ant-design/icons';

import PriceListAdjustment from './components/PriceListAdjustment';
import ClinicalProjectAdjustment from './components/ClinicalProjectAdjustment';
import ClinicalProjectMaintenance from './components/ClinicalProjectMaintenance';
import ClinicalAdjustmentLog from './components/ClinicalAdjustmentLog';

const { 
  Layout,
  Menu,
  Typography,
  ConfigProvider,
  Avatar,
  Badge,
  Space,
} = antd;

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function App() {
  const [activeMenu, setActiveMenu] = useState('2');

  const renderContent = () => {
    switch (activeMenu) {
      case '2':
        return <PriceListAdjustment />;
      case '3':
        return <ClinicalProjectAdjustment />;
      case '4':
        return <ClinicalProjectMaintenance />;
      case '5':
        return <ClinicalAdjustmentLog />;
      default:
        return <PriceListAdjustment />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 2,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        {/* Top Header */}
        <Header style={{ background: '#001529', padding: '0 20px', display: 'flex', alignItems: 'center', height: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#fff', marginRight: 40 }}>
            <AppstoreOutlined style={{ fontSize: 20, marginRight: 8 }} />
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>鑫亿云医院</Text>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ flex: 1, background: 'transparent', lineHeight: '48px' }}
            items={[
              { key: '1', label: '工作台' },
              { key: '2', label: '价表项目调整计划' },
            ]}
          />
          <Space size={20} style={{ color: '#fff' }}>
            <Badge dot><BellOutlined style={{ fontSize: 18 }} /></Badge>
            <SettingOutlined style={{ fontSize: 18 }} />
            <Space>
              <Avatar size="small" icon={<UserOutlined />} />
              <Text style={{ color: '#fff', fontSize: 12 }}>王鹏华, 早上好</Text>
            </Space>
          </Space>
        </Header>

        <Layout>
          {/* Left Sidebar */}
          <Sider width={200} theme="light" style={{ borderRight: '1px solid #e8e8e8' }}>
            <div style={{ padding: '12px 16px', background: '#002140', color: '#fff', fontSize: 14 }}>
              医疗服务字典 <HistoryOutlined style={{ float: 'right' }} />
            </div>
            <Menu
              mode="inline"
              selectedKeys={[activeMenu]}
              onClick={({ key }) => setActiveMenu(key)}
              style={{ height: 'calc(100% - 46px)', borderRight: 0 }}
              items={[
                { key: '2', icon: <FileTextOutlined />, label: '价表项目调整计划' },
                { key: '3', icon: <DesktopOutlined />, label: '临床项目调整计划' },
                { key: '4', icon: <SettingOutlined />, label: '临床项目综合基础维护' },
                { key: '5', icon: <HistoryOutlined />, label: '临床价表调整日志' },
              ]}
            />
          </Sider>

          {/* Main Content */}
          <Content style={{ padding: 0, display: 'flex' }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

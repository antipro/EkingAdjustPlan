/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Typography, Empty } from 'antd';

const { Title } = Typography;

const ClinicalAdjustmentLog: React.FC = () => {
  return (
    <div style={{ padding: 24, flex: 1, background: '#fff' }}>
      <Title level={4}>临床价表调整日志</Title>
      <Empty description="暂无数据，等待截图更新" />
    </div>
  );
};

export default ClinicalAdjustmentLog;

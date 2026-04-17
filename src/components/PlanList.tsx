import React, { useState, useEffect, useCallback } from 'react';
import * as antd from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { planService, PlanInfo, PageInfo } from '../services/planService';
import PlanModal from './PlanModal';

const { 
  Select, 
  DatePicker, 
  Button, 
  Tag, 
  Space, 
  Pagination, 
  Typography,
  Checkbox,
  message,
  Modal: AntdModal
} = antd;

const { Text } = Typography;

interface PlanListProps {
  planType?: string;
  initialSelectedId?: string;
  onSelect?: (plan: PlanInfo) => void;
  onCreate?: () => void;
  onViewLogs?: () => void;
  onSubmit?: (plan: PlanInfo) => void;
  onEdit?: (plan: PlanInfo) => void;
  onDelete?: (plan: PlanInfo) => void;
}

const PlanList: React.FC<PlanListProps> = ({
  planType,
  initialSelectedId,
  onSelect,
  onCreate,
  onViewLogs,
  onSubmit,
  onEdit,
  onDelete
}) => {
  const [plans, setPlans] = useState<PlanInfo[]>([]);
  const [selectedId, setSelectedId] = useState(initialSelectedId || '');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PageInfo>({
    pageSize: 20,
    totalCount: 0,
    totalPageNum: 0,
    pageNum: 1,
  });

  const [searchParams, setSearchParams] = useState({
    region: 'js',
    date: null,
    status: 'all',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingPlan, setEditingPlan] = useState<PlanInfo | null>(null);

  const fetchPlans = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await planService.getPlans({
        pageNum: pageNum,
        pageSize: pagination.pageSize,
        planType: planType,
      });
      if (response.code === 'SUCCESS') {
        setPlans(response.data.dataInfo);
        setPagination(response.data.pageInfo);
        
        // Auto-select first plan if none selected
        if (!selectedId && response.data.dataInfo.length > 0) {
          const firstPlan = response.data.dataInfo[0];
          setSelectedId(firstPlan.id);
          onSelect?.(firstPlan);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [planType, pagination.pageSize, selectedId, onSelect]);

  useEffect(() => {
    fetchPlans(1);
  }, [planType]);

  const handleSelect = (plan: PlanInfo) => {
    setSelectedId(plan.id);
    onSelect?.(plan);
  };

  const handlePageChange = (page: number) => {
    fetchPlans(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '0': return 'blue'; // Draft
      case '1': return 'orange'; // Published
      case '2': return 'green'; // Active
      default: return 'default';
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setEditingPlan(null);
    setModalVisible(true);
    onCreate?.();
  };

  const handleEdit = (plan: PlanInfo) => {
    setModalMode('edit');
    setEditingPlan(plan);
    setModalVisible(true);
    onEdit?.(plan);
  };

  const handleModalOk = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        beginDatetime: values.beginDatetime.format('YYYY-MM-DD HH:mm:ss'),
        planType: planType,
        id: editingPlan?.id,
      };
      
      const response = await planService.savePlan(payload);
      if (response.code === 'SUCCESS') {
        message.success(`${modalMode === 'create' ? '新建' : '修改'}成功`);
        setModalVisible(false);
        fetchPlans(pagination.pageNum);
      } else {
        message.error(response.sucMsg || '保存失败');
      }
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (plan: PlanInfo) => {
    setLoading(true);
    try {
      const res = await planService.submitPlan(plan.id);
      if (res.code === 'SUCCESS') {
        message.success('提交成功');
        fetchPlans(pagination.pageNum);
        onSubmit?.(plan);
      } else {
        message.error(res.sucMsg || '提交失败');
      }
    } catch (e) {
      message.error('提交失败');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (plan: PlanInfo) => {
    setLoading(true);
    try {
      const res = await planService.withdrawPlan(plan.id);
      if (res.code === 'SUCCESS') {
        message.success('撤回成功');
        fetchPlans(pagination.pageNum);
      } else {
        message.error(res.sucMsg || '撤回失败');
      }
    } catch (e) {
      message.error('撤回失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (plan: PlanInfo) => {
    AntdModal.confirm({
      title: '确认作废',
      content: `确定要作废计划 "${plan.planName}" 吗？`,
      onOk: async () => {
        setLoading(true);
        try {
          const res = await planService.cancelPlan(plan.id);
          if (res.code === 'SUCCESS') {
            message.success('作废成功');
            fetchPlans(pagination.pageNum);
          } else {
            message.error(res.sucMsg || '作废失败');
          }
        } catch (e) {
          message.error('作废失败');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleCopy = async (plan: PlanInfo) => {
    setLoading(true);
    try {
      const res = await planService.copyPlan(plan.id);
      if (res.code === 'SUCCESS') {
        message.success('复制成功');
        fetchPlans(1);
      } else {
        message.error(res.sucMsg || '复制失败');
      }
    } catch (e) {
      message.error('复制失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (plan: PlanInfo) => {
    AntdModal.confirm({
      title: '确认删除',
      content: `确定要删除计划 "${plan.planName}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        try {
          const res = await planService.deletePlan(plan.id);
          if (res.code === 'SUCCESS') {
            message.success('删除成功');
            fetchPlans(pagination.pageNum);
            onDelete?.(plan);
          } else {
            message.error(res.sucMsg || '删除失败');
          }
        } catch (e) {
          message.error('删除失败');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Select 
              value={searchParams.region} 
              style={{ width: '50%' }}
              placeholder="选择地区"
              options={[{ value: 'js', label: '江苏省' }]}
              onChange={(val) => setSearchParams(prev => ({ ...prev, region: val }))}
            />
            <DatePicker 
              style={{ width: '50%' }} 
              placeholder="生效日期"
              onChange={(date) => setSearchParams(prev => ({ ...prev, date: date as any }))}
            />
            -
            <DatePicker 
              style={{ width: '50%' }} 
              placeholder="结束"
              onChange={(date) => setSearchParams(prev => ({ ...prev, date: date as any }))}
            />
          </div>
          <Select 
            value={searchParams.status} 
            style={{ width: '100%' }}
            placeholder="计划状态"
            options={[{ value: 'all', label: '全部' }]}
            onChange={(val) => setSearchParams(prev => ({ ...prev, status: val }))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleCreate}>
              新建
            </Button>
            <Button size="small" onClick={onViewLogs}>日志</Button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
            <antd.Spin />
          </div>
        )}
        {plans.map(plan => (
          <div 
            key={plan.id}
            className={`plan-item ${selectedId === plan.id ? 'active' : ''}`}
            onClick={() => handleSelect(plan)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderBottom: '1px solid #f0f0f0',
              transition: 'all 0.3s',
              borderLeft: '3px solid transparent',
              background: selectedId === plan.id ? '#e6f7ff' : '#fff',
              borderLeftColor: selectedId === plan.id ? '#1890ff' : 'transparent'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>生效时间 </Text>
              <Text strong style={{ fontSize: 12 }}>{plan.beginDatetime}</Text>
              <Tag color={getStatusColor(plan.status)} style={{ marginLeft: 'auto' }}>{plan.statusName}</Tag>
            </div>
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>计划名称 </Text>
              <Text style={{ fontSize: 12 }}>{plan.planName}</Text>
            </div>
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>政策文件 </Text>
              <Text style={{ fontSize: 12 }}>{plan.policy}</Text>
            </div>
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>计划条数 </Text>
              <Text style={{ fontSize: 12 }}>{plan.changeSummary}</Text>
            </div>
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>适用机构 </Text>
              <Text style={{ fontSize: 12 }}>{plan.orgNames}</Text>
            </div>
            {plan.linkedPlanName && (
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>关联计划 </Text>
                <Text style={{ fontSize: 12, color: '#1890ff' }}>{plan.linkedPlanName}</Text>
              </div>
            )}
            
            {selectedId === plan.id && (
              <div style={{ textAlign: 'right' }}>
                <Space>
                  {(plan.status === '0' || plan.status === '3') && (
                    <>
                      {!plan.linkedPlanName && <Button size="small" onClick={(e) => { e.stopPropagation(); handleSubmit(plan); }}>提交</Button>}
                      <Button size="small" onClick={(e) => { e.stopPropagation(); handleEdit(plan); }}>修改</Button>
                      {!plan.linkedPlanName && <Button size="small" danger onClick={(e) => { e.stopPropagation(); handleDelete(plan); }}>删除</Button>}
                    </>
                  )}
                  {plan.status === '1' && (
                    <>
                      <Button size="small" onClick={(e) => { e.stopPropagation(); handleWithdraw(plan); }}>撤回</Button>
                      <Button size="small" onClick={(e) => { e.stopPropagation(); handleCopy(plan); }}>复制</Button>
                    </>
                  )}
                  {plan.status === '2' && (
                    <>
                      <Button size="small" onClick={(e) => { e.stopPropagation(); handleCancel(plan); }}>作废</Button>
                      <Button size="small" onClick={(e) => { e.stopPropagation(); handleCopy(plan); }}>复制</Button>
                    </>
                  )}
                </Space>
              </div>
            )}
          </div>
        ))}
        
        <div style={{ padding: 8, borderTop: '1px solid #f0f0f0', background: '#fff', position: 'sticky', bottom: 0 }}>
          <Pagination
            current={pagination.pageNum}
            pageSize={pagination.pageSize}
            total={pagination.totalCount}
            size="small"
            showSizeChanger={false}
            onChange={handlePageChange}
          />
        </div>
      </div>
      <PlanModal 
        visible={modalVisible}
        mode={modalMode}
        initialValues={editingPlan}
        titlePrefix={planType === '200' ? '临床项目' : (planType === '400' ? '临床综合维护' : '价表项目')}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
      />
    </div>
  );
};

export default PlanList;

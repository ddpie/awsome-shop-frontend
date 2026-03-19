import { useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TollIcon from '@mui/icons-material/Toll';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useOrderStore } from '../../stores/order.store';
import type { OrderStatus } from '../../types/order.types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending:    { label: '待发货', color: '#92400E', bg: '#FEF3C7' },
  processing: { label: '处理中', color: '#1E40AF', bg: '#DBEAFE' },
  shipped:    { label: '已发货', color: '#1E40AF', bg: '#DBEAFE' },
  completed:  { label: '已完成', color: '#166534', bg: '#DCFCE7' },
  cancelled:  { label: '已取消', color: '#991B1B', bg: '#FEE2E2' },
  PENDING:    { label: '待发货', color: '#92400E', bg: '#FEF3C7' },
  PROCESSING: { label: '处理中', color: '#1E40AF', bg: '#DBEAFE' },
  SHIPPED:    { label: '已发货', color: '#1E40AF', bg: '#DBEAFE' },
  COMPLETED:  { label: '已完成', color: '#166534', bg: '#DCFCE7' },
  CANCELLED:  { label: '已取消', color: '#991B1B', bg: '#FEE2E2' },
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B', px: 3, pt: 2.5, pb: 2 }}>{title}</Typography>
      <Divider sx={{ borderColor: '#F1F5F9' }} />
      <Box sx={{ px: 3, py: 2.5 }}>{children}</Box>
    </Paper>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75 }}>
      <Typography sx={{ fontSize: 13, color: '#64748B' }}>{label}</Typography>
      {typeof value === 'string'
        ? <Typography sx={{ fontSize: 13, fontWeight: 500, color: valueColor ?? '#1E293B' }}>{value}</Typography>
        : value}
    </Box>
  );
}

// Build a simple timeline from order status
function buildTimeline(status: OrderStatus, createdAt: string, updatedAt?: string) {
  const steps = [
    { label: '订单创建成功', done: true, time: createdAt },
    { label: '管理员确认发货', done: status === 'shipped' || status === 'completed', time: status === 'shipped' || status === 'completed' ? (updatedAt ?? '') : '' },
    { label: '等待收货', done: status === 'completed', time: '' },
    { label: '完成', done: status === 'completed', time: '' },
  ];
  if (status === 'cancelled') {
    return [
      { label: '订单创建成功', done: true, time: createdAt },
      { label: '订单已取消', done: true, time: updatedAt ?? '' },
    ];
  }
  return steps;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentOrder, loading, error, fetchOrderById } = useOrderStore();

  useEffect(() => {
    if (id) fetchOrderById(id);
  }, [id, fetchOrderById]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !currentOrder) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error ?? t('common.error', '加载失败')}</Alert>
        <Button onClick={() => navigate('/orders')} sx={{ mt: 2 }}>
          {t('employee.orderDetail.backToList')}
        </Button>
      </Box>
    );
  }

  const order = currentOrder;
  const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const timeline = buildTimeline(order.status, order.createdAt, order.updatedAt);

  return (
    <Box sx={{ p: '24px 32px', display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Breadcrumbs sx={{ fontSize: 13, mb: 1 }}>
            <Link component={RouterLink} to="/orders" underline="hover" sx={{ fontSize: 13, color: '#64748B' }}>
              {t('employee.orders.title')}
            </Link>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>{t('employee.orderDetail.breadcrumb')}</Typography>
          </Breadcrumbs>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>
              {t('employee.orderDetail.title')}
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#94A3B8' }}>{order.orderNo}</Typography>
            <Chip label={statusCfg.label} size="small"
              sx={{ bgcolor: statusCfg.bg, color: statusCfg.color, fontWeight: 600, fontSize: 12, height: 24 }} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 3 }}>
        {/* Left column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Order status timeline */}
          <SectionCard title={t('employee.orderDetail.statusTitle')}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {timeline.map((step, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FiberManualRecordIcon sx={{ fontSize: 14, color: step.done ? '#2563EB' : '#CBD5E1', mt: '3px' }} />
                    {i < timeline.length - 1 && (
                      <Box sx={{ width: 2, flex: 1, bgcolor: step.done ? '#BFDBFE' : '#F1F5F9', my: '2px', minHeight: 24 }} />
                    )}
                  </Box>
                  <Box sx={{ pb: i < timeline.length - 1 ? 2 : 0 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: step.done ? 600 : 400, color: step.done ? '#1E293B' : '#94A3B8' }}>
                      {step.label}
                    </Typography>
                    {step.time && (
                      <Typography sx={{ fontSize: 12, color: '#94A3B8', mt: 0.25 }}>{step.time}</Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </SectionCard>

          {/* Product info */}
          <SectionCard title={t('employee.orderDetail.productInfo')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 64, height: 64, borderRadius: '10px', bgcolor: '#DBEAFE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, overflow: 'hidden',
              }}>
                {order.productImage ? (
                  <Box component="img" src={order.productImage} alt={order.productName}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ShoppingBagIcon sx={{ fontSize: 32, color: '#2563EB' }} />
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{order.productName}</Typography>
                <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.5 }}>
                  ×{order.quantity}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                <TollIcon sx={{ fontSize: 20, color: '#D97706' }} />
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#D97706' }}>{order.pointsCost.toLocaleString()}</Typography>
                <Typography sx={{ fontSize: 13, color: '#D97706' }}>{t('employee.pointsUnit', '积分')}</Typography>
              </Box>
            </Box>
          </SectionCard>

          {/* Points breakdown */}
          <SectionCard title={t('employee.orderDetail.pointsBreakdown')}>
            <InfoRow label={t('employee.orderConfirm.unitPrice')} value={`${order.pointsCost.toLocaleString()} ${t('employee.pointsUnit', '积分')}`} />
            <Divider sx={{ borderColor: '#F1F5F9', my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{t('employee.orderDetail.totalPoints')}</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>
                {order.pointsCost.toLocaleString()} {t('employee.pointsUnit', '积分')}
              </Typography>
            </Box>
          </SectionCard>

          {/* Delivery info */}
          {order.deliveryInfo && (
            <SectionCard title={t('employee.orderDetail.deliveryInfo')}>
              <InfoRow label={t('employee.orderConfirm.recipient')} value={order.deliveryInfo.recipientName} />
              <InfoRow label={t('employee.orderDetail.phone', '联系电话')} value={order.deliveryInfo.phone} />
              <InfoRow label={t('employee.orderConfirm.address')} value={order.deliveryInfo.address} />
              {order.deliveryInfo.note && (
                <InfoRow label={t('employee.orderDetail.remark')} value={order.deliveryInfo.note} />
              )}
            </SectionCard>
          )}

          {/* Order info */}
          <SectionCard title={t('employee.orderDetail.orderInfo')}>
            <InfoRow label={t('employee.orderDetail.orderNo')} value={order.orderNo} />
            <InfoRow label={t('employee.orderDetail.orderTime')} value={order.createdAt} />
            {order.updatedAt && (
              <InfoRow label={t('employee.orderDetail.payTime')} value={order.updatedAt} />
            )}
          </SectionCard>

        </Box>

        {/* Right: action panel */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button variant="outlined" fullWidth onClick={() => navigate('/orders')}
              sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 500, borderColor: '#E2E8F0', color: '#475569' }}>
              {t('employee.orderDetail.backToList')}
            </Button>
            {order.status !== 'cancelled' && order.status !== 'completed' && (
              <Button variant="text" fullWidth
                sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 500, color: '#94A3B8', '&:hover': { color: '#DC2626' } }}>
                {t('employee.orders.refund')}
              </Button>
            )}
          </Paper>
        </Box>
      </Box>

    </Box>
  );
}

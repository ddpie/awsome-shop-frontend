import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useOrderStore } from '../../stores/order.store';

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: '待发货', color: '#D97706', bg: '#FFF7ED' },
  READY:     { label: '已发货', color: '#1E40AF', bg: '#EFF6FF' },
  SHIPPED:   { label: '已发货', color: '#1E40AF', bg: '#EFF6FF' },
  COMPLETED: { label: '已完成', color: '#166534', bg: '#F0FDF4' },
  CANCELLED: { label: '已取消', color: '#991B1B', bg: '#FEF2F2' },
};

const CARD = { borderRadius: '12px', border: '1px solid #F1F5F9', bgcolor: '#fff' };
const TITLE = { fontSize: 16, fontWeight: 600, color: '#1E293B' };
const LBL = { fontSize: 13, color: '#64748B' };
const VAL = { fontSize: 13, fontWeight: 500, color: '#1E293B' };

function Row({ label, value, vc }: { label: string; value: string; vc?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Typography sx={LBL}>{label}</Typography>
      <Typography sx={{ ...VAL, color: vc ?? '#1E293B', textAlign: 'right', maxWidth: 220 }}>{value}</Typography>
    </Box>
  );
}

function TimelineItem({ done, active, label, time }: { done: boolean; active?: boolean; label: string; time?: string }) {
  return (
    <Box sx={{ display: 'flex', gap: '14px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {done ? (
          <CheckCircleIcon sx={{ fontSize: 20, color: '#2563EB' }} />
        ) : active ? (
          <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: '#2563EB' }} />
        ) : (
          <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: '#CBD5E1' }} />
        )}
        <Box sx={{ width: 2, flexGrow: 1, bgcolor: done ? '#2563EB' : '#E2E8F0', minHeight: 24 }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', pb: 2 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: done || active ? '#1E293B' : '#94A3B8' }}>{label}</Typography>
        {time && <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>{time}</Typography>}
      </Box>
    </Box>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { adminCurrentOrder: order, adminLoading: loading, adminError: error, fetchAdminOrderById, updateAdminOrderStatus } = useOrderStore();

  useEffect(() => { if (id) fetchAdminOrderById(id); }, [id, fetchAdminOrderById]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (error || !order) return <Box sx={{ p: 4 }}><Alert severity="error">{error ?? t('admin.orderDetail.notFound')}</Alert></Box>;

  const sk = (order.status as string).toUpperCase();
  const cfg = STATUS_CFG[sk] ?? STATUS_CFG.PENDING;
  const isPending = sk === 'PENDING';
  const isReady = sk === 'READY' || sk === 'SHIPPED';
  const isCompleted = sk === 'COMPLETED';
  const isCancelled = sk === 'CANCELLED';
  const orderNo = order.orderNo ?? `EX${String(order.id).padStart(11, '0')}`;
  const createdAt = order.createdAt?.slice(0, 19).replace('T', ' ') ?? '—';

  const handleShip = () => updateAdminOrderStatus(String(order.id), 'READY');
  const handleComplete = () => updateAdminOrderStatus(String(order.id), 'COMPLETED');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Typography component="span" onClick={() => navigate('/admin/orders')}
              sx={{ fontSize: 13, color: '#2563EB', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
              {t('admin.orders.title')}
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#CBD5E1' }}>/</Typography>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>{t('admin.orderDetail.breadcrumb')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>{orderNo}</Typography>
            <Chip label={cfg.label} size="small" sx={{ fontSize: 12, fontWeight: 500, color: cfg.color, bgcolor: cfg.bg, borderRadius: '12px' }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isCancelled && !isCompleted && (
            <Button variant="outlined" size="small" startIcon={<CancelIcon />}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 500, fontSize: 13, borderColor: '#DC2626', color: '#DC2626', '&:hover': { borderColor: '#DC2626', bgcolor: '#FEF2F2' } }}>
              {t('admin.orderDetail.cancel', '取消订单')}
            </Button>
          )}
          <Button variant="outlined" size="small" startIcon={<PrintIcon />}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 500, fontSize: 13, borderColor: '#E2E8F0', color: '#1E293B' }}>
            {t('admin.orderDetail.print', '打印详情')}
          </Button>
          {isPending && (
            <Button variant="contained" size="small" startIcon={<LocalShippingIcon />} onClick={handleShip}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: 13, boxShadow: 'none' }}>
              {t('admin.orderDetail.updateStatus')}
            </Button>
          )}
          {isReady && (
            <Button variant="contained" size="small" startIcon={<CheckCircleIcon />} onClick={handleComplete}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: 13, boxShadow: 'none', bgcolor: '#16A34A', '&:hover': { bgcolor: '#15803D' } }}>
              {t('admin.orders.complete', '确认完成')}
            </Button>
          )}
        </Box>
      </Box>

      {/* Two-column layout */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left column */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Product card */}
          <Paper elevation={0} sx={{ ...CARD, p: 3, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Typography sx={TITLE}>{t('admin.orderDetail.productInfo')}</Typography>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 72, height: 72, borderRadius: '12px', bgcolor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {order.productImage ? (
                  <Box component="img" src={order.productImage} alt={order.productName} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ShoppingBagIcon sx={{ fontSize: 36, color: '#2563EB' }} />
                )}
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{order.productName}</Typography>
                <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                  {t('admin.orderDetail.qty', { count: order.quantity ?? 1 })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>{order.pointsCost?.toLocaleString()}</Typography>
                <Typography sx={{ fontSize: 12, color: '#64748B' }}>{t('employee.pointsUnit')}</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Points breakdown */}
          <Paper elevation={0} sx={{ ...CARD, p: 3, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Typography sx={TITLE}>{t('admin.orderDetail.pointsBreakdown')}</Typography>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <Row label={t('employee.orderConfirm.unitPrice', '商品积分')} value={order.pointsCost?.toLocaleString() ?? '—'} />
            <Row label={t('admin.orderDetail.shipping', '运费积分')} value="0" />
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{t('admin.orderDetail.totalPoints')}</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#2563EB' }}>{order.pointsCost?.toLocaleString()} {t('employee.pointsUnit')}</Typography>
            </Box>
          </Paper>

          {/* Employee info */}
          <Paper elevation={0} sx={{ ...CARD, p: 3, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Typography sx={TITLE}>{t('admin.orderDetail.employeeInfo')}</Typography>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Typography sx={{ fontSize: 12, color: '#64748B' }}>{t('admin.orderDetail.employeeName')}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>{order.userName ?? '—'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Typography sx={{ fontSize: 12, color: '#64748B' }}>{t('admin.orderDetail.employeeId')}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>{order.userId ? `EMP${String(order.userId).padStart(8, '0')}` : '—'}</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right column (380px) */}
        <Box sx={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Status timeline */}
          <Paper elevation={0} sx={{ ...CARD, p: 3, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Typography sx={TITLE}>{t('admin.orderDetail.statusTimeline')}</Typography>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <Box>
              <TimelineItem done label={t('admin.orderDetail.timelineCreated')} time={createdAt} />
              <TimelineItem done={isReady || isCompleted} active={isPending} label={t('admin.orderDetail.timelineShipped')} time={isReady || isCompleted ? createdAt : undefined} />
              <TimelineItem done={isCompleted} active={isReady} label={t('admin.orderDetail.timelineCompleted')} time={isCompleted ? createdAt : undefined} />
            </Box>
          </Paper>

          {/* Order info */}
          <Paper elevation={0} sx={{ ...CARD, p: 3, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Typography sx={TITLE}>{t('employee.orderDetail.orderInfo', '订单信息')}</Typography>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <Row label={t('employee.orderDetail.orderNo')} value={orderNo} />
            <Row label={t('employee.orderDetail.orderTime')} value={createdAt} />
            <Row label={t('employee.orderDetail.platform', '订单来源')} value="PC端" />
            <Row label={t('employee.orderDetail.remark', '备注')} value="无" vc="#94A3B8" />
          </Paper>

          {/* Delivery info */}
          <Paper elevation={0} sx={{ ...CARD, p: 3, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Typography sx={TITLE}>{t('admin.orderDetail.deliveryInfo')}</Typography>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <Row label={t('employee.delivery.fieldName', '收货人')} value={order.userName ?? '—'} />
            <Row label={t('employee.orderDetail.phone', '联系电话')} value={order.deliveryInfo?.phone ?? '—'} />
            <Row label={t('employee.delivery.fieldDetail', '收货地址')} value={order.deliveryInfo?.address ?? '—'} />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

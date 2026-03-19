import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useOrderStore } from '../../stores/order.store';

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: 'statusPending',   color: '#92400E', bg: '#FEF3C7' },
  SHIPPED:   { label: 'statusShipped',   color: '#1E40AF', bg: '#DBEAFE' },
  READY:     { label: 'statusShipped',   color: '#1E40AF', bg: '#DBEAFE' },
  COMPLETED: { label: 'statusCompleted', color: '#166534', bg: '#DCFCE7' },
  CANCELLED: { label: 'statusCancelled', color: '#991B1B', bg: '#FEE2E2' },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { adminCurrentOrder: order, adminLoading: loading, adminError: error, fetchAdminOrderById, updateAdminOrderStatus } = useOrderStore();

  useEffect(() => { if (id) fetchAdminOrderById(id); }, [id, fetchAdminOrderById]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (error || !order) return <Box sx={{ p: '32px' }}><Alert severity="error" sx={{ borderRadius: '8px' }}>{error ?? t('admin.orders.noData')}</Alert></Box>;

  const statusKey = (order.status as string).toUpperCase();
  const cfg = STATUS_CFG[statusKey] ?? STATUS_CFG['PENDING'];
  const isPending = statusKey === 'PENDING';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: '32px' }}>
      <Breadcrumbs sx={{ fontSize: 13 }}>
        <Link component="button" underline="hover" sx={{ fontSize: 13, color: '#64748B' }} onClick={() => navigate('/admin/orders')}>{t('admin.orders.title')}</Link>
        <Typography sx={{ fontSize: 13, color: '#1E293B' }}>{order.orderNo ?? `#${order.id}`}</Typography>
      </Breadcrumbs>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button size="small" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/orders')} sx={{ textTransform: 'none', color: '#64748B' }}>{t('common.back', 'Back')}</Button>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>{order.orderNo ?? `#${order.id}`}</Typography>
        <Chip label={t(`admin.orders.${cfg.label}`)} size="small" sx={{ fontSize: 12, fontWeight: 500, color: cfg.color, bgcolor: cfg.bg, borderRadius: '12px' }} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #F1F5F9' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2 }}>{t('admin.orders.colProduct', 'Product')}</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '8px', bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBagIcon sx={{ fontSize: 28, color: '#94A3B8' }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{order.productName}</Typography>
              <Typography sx={{ fontSize: 13, color: '#64748B' }}>{order.pointsCost?.toLocaleString()} {t('employee.pointsUnit', 'points')}</Typography>
            </Box>
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #F1F5F9' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2 }}>{t('admin.orders.colUser', 'User')}</Typography>
          <Typography sx={{ fontSize: 14, color: '#475569' }}>{order.userName ?? `User #${order.userId}`}</Typography>
          <Typography sx={{ fontSize: 13, color: '#64748B', mt: 1 }}>{t('admin.orders.colTime', 'Time')}: {order.createdAt?.slice(0, 19).replace('T', ' ')}</Typography>
        </Paper>
      </Box>
      {isPending && (
        <Box>
          <Button variant="contained" onClick={() => updateAdminOrderStatus(String(order.id), 'READY')} sx={{ textTransform: 'none', borderRadius: '8px' }}>{t('admin.orders.ship', 'Ship')}</Button>
        </Box>
      )}
    </Box>
  );
}

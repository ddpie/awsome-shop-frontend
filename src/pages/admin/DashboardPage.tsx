import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TollIcon from '@mui/icons-material/Toll';
import type { SvgIconComponent } from '@mui/icons-material';
import { useOrderStore } from '../../stores/order.store';

interface Metric {
  key: string;
  value: string;
  change: string;
  changeColor: string;
  icon: SvgIconComponent;
  iconColor: string;
  iconBg: string;
}

const METRICS: Metric[] = [
  { key: 'totalProducts', value: '—', change: '', changeColor: '#16A34A', icon: Inventory2Icon, iconColor: '#2563EB', iconBg: '#EFF6FF' },
  { key: 'totalUsers', value: '—', change: '', changeColor: '#16A34A', icon: GroupIcon, iconColor: '#16A34A', iconBg: '#DCFCE7' },
  { key: 'monthlyRedemptions', value: '—', change: '', changeColor: '#D97706', icon: ShoppingCartIcon, iconColor: '#D97706', iconBg: '#FEF3C7' },
  { key: 'pointsCirculation', value: '—', change: '', changeColor: '#64748B', icon: TollIcon, iconColor: '#7C3AED', iconBg: '#EDE9FE' },
];

const STATUS_CONFIG: Record<string, { labelKey: string; color: string; bg: string }> = {
  PENDING:   { labelKey: 'statusPending',   color: '#92400E', bg: '#FEF3C7' },
  pending:   { labelKey: 'statusPending',   color: '#92400E', bg: '#FEF3C7' },
  READY:     { labelKey: 'statusShipped',   color: '#1E40AF', bg: '#DBEAFE' },
  SHIPPED:   { labelKey: 'statusShipped',   color: '#1E40AF', bg: '#DBEAFE' },
  shipped:   { labelKey: 'statusShipped',   color: '#1E40AF', bg: '#DBEAFE' },
  COMPLETED: { labelKey: 'statusCompleted', color: '#166534', bg: '#DCFCE7' },
  completed: { labelKey: 'statusCompleted', color: '#166534', bg: '#DCFCE7' },
  CANCELLED: { labelKey: 'statusCancelled', color: '#991B1B', bg: '#FEE2E2' },
  cancelled: { labelKey: 'statusCancelled', color: '#991B1B', bg: '#FEE2E2' },
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { adminOrders, adminLoading, fetchAdminOrders } = useOrderStore();

  useEffect(() => {
    fetchAdminOrders({ page: 0, size: 4 });
  }, [fetchAdminOrders]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', p: '32px' }}>
      <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'text.primary' }}>
        {t('admin.dashboard')}
      </Typography>

      {/* Metric Cards — static, no aggregate API */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {METRICS.map((metric) => {
          const IconComp = metric.icon;
          return (
            <Paper
              key={metric.key}
              elevation={0}
              sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5, borderRadius: 3, border: '1px solid #F1F5F9' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  {t(`admin.metrics.${metric.key}`)}
                </Typography>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: metric.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComp sx={{ fontSize: 20, color: metric.iconColor }} />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: 'text.primary' }}>
                {metric.value}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Recent Orders */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #F1F5F9', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, py: 2, borderBottom: '1px solid #F1F5F9' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary' }}>
            {t('admin.recentOrders')}
          </Typography>
          <Link
            component="button"
            underline="none"
            sx={{ fontSize: 13, color: 'primary.main' }}
            onClick={() => navigate('/admin/orders')}
          >
            {t('admin.viewAll')} →
          </Link>
        </Box>
        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: '#F1F5F9' } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                {(['user', 'product', 'points', 'status', 'time'] as const).map((col) => (
                  <TableCell key={col} sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '10px', px: '20px' }}>
                    {t(`admin.table.${col}`)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {adminLoading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : adminOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: '#94A3B8', fontSize: 13 }}>
                    {t('admin.orders.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                adminOrders.map((order) => {
                  const statusKey = order.status as string;
                  const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG['pending'];
                  return (
                    <TableRow key={order.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell sx={{ fontSize: 13, py: '12px', px: '20px' }}>{order.userName ?? '—'}</TableCell>
                      <TableCell sx={{ fontSize: 13, py: '12px', px: '20px' }}>{order.productName}</TableCell>
                      <TableCell sx={{ fontSize: 13, py: '12px', px: '20px' }}>{order.pointsCost?.toLocaleString() ?? '—'}</TableCell>
                      <TableCell sx={{ py: '12px', px: '20px' }}>
                        <Chip
                          label={t(`admin.orders.${cfg.labelKey}`)}
                          size="small"
                          sx={{ fontSize: 11, fontWeight: 500, color: cfg.color, bgcolor: cfg.bg, borderRadius: '12px', height: 24 }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13, color: 'text.secondary', py: '12px', px: '20px' }}>
                        {order.createdAt ? order.createdAt.slice(0, 10) : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

import { useEffect, useState } from 'react';
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
import { productService } from '../../services/product.service';
import { authService } from '../../services/auth.service';
import { pointsService } from '../../services/points.service';

interface MetricDef {
  key: string;
  icon: SvgIconComponent;
  iconColor: string;
  iconBg: string;
}

const METRIC_DEFS: MetricDef[] = [
  { key: 'totalProducts', icon: Inventory2Icon, iconColor: '#2563EB', iconBg: '#EFF6FF' },
  { key: 'totalUsers', icon: GroupIcon, iconColor: '#16A34A', iconBg: '#DCFCE7' },
  { key: 'monthlyRedemptions', icon: ShoppingCartIcon, iconColor: '#D97706', iconBg: '#FEF3C7' },
  { key: 'pointsCirculation', icon: TollIcon, iconColor: '#7C3AED', iconBg: '#EDE9FE' },
];

// Unwrap API envelope: { code, data } → data
function unwrap<T>(res: unknown): T {
  const r = res as { data?: T };
  return r?.data !== undefined ? r.data : res as T;
}

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
  const [metrics, setMetrics] = useState<Record<string, string>>({
    totalProducts: '—',
    totalUsers: '—',
    monthlyRedemptions: '—',
    pointsCirculation: '—',
  });
  const [userMap, setUserMap] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchAdminOrders({ page: 0, size: 4 });
  }, [fetchAdminOrders]);

  // Resolve userIds to display names after orders load
  useEffect(() => {
    if (adminOrders.length === 0) return;
    const userIds = [...new Set(adminOrders.map((o) => o.userId).filter(Boolean))];
    if (userIds.length === 0) return;
    (async () => {
      try {
        const res = await authService.getAdminUsers({ page: 0, size: 100 });
        const data = unwrap<{ content?: { id: number | string; name?: string; username?: string; displayName?: string }[] }>(res);
        const users = data.content ?? (Array.isArray(data) ? data : []);
        const map: Record<number, string> = {};
        for (const u of users) {
          map[Number(u.id)] = u.name || u.displayName || u.username || `User ${u.id}`;
        }
        setUserMap(map);
      } catch { /* ignore */ }
    })();
  }, [adminOrders]);

  // Fetch aggregate metrics from available APIs
  useEffect(() => {
    (async () => {
      const results: Record<string, string> = { ...metrics };

      // Total Products
      try {
        const prodRes = await productService.adminGetProducts({ page: 0, size: 1 });
        const prodData = unwrap<{ totalElements?: number }>(prodRes);
        if (prodData.totalElements != null) results.totalProducts = prodData.totalElements.toLocaleString();
      } catch { /* API not available */ }

      // Total Users
      try {
        const userRes = await authService.getAdminUsers({ page: 0, size: 1 });
        const userData = unwrap<{ totalElements?: number }>(userRes);
        if (userData.totalElements != null) results.totalUsers = userData.totalElements.toLocaleString();
      } catch { /* API not available */ }

      // Monthly Redemptions (from admin orders if available)
      try {
        const orderRes = await (await import('../../services/order.service')).orderService.adminGetOrders({ page: 0, size: 1 });
        const orderData = unwrap<{ totalElements?: number }>(orderRes);
        if (orderData.totalElements != null) results.monthlyRedemptions = orderData.totalElements.toLocaleString();
      } catch { /* Order admin API not available yet */ }

      // Points Circulation (sum of all user balances)
      try {
        const http = (await import('../../services/http')).default;
        let allBalances: { userId: number; balance: number }[] = [];
        let page = 0;
        let totalPages = 1;
        while (page < totalPages) {
          const raw = await http.get('/v1/point/admin/balances', { params: { page, size: 100 } });
          const pageData = unwrap<{ content?: { userId: number; balance: number }[]; totalPages?: number }>(raw);
          if (pageData.content) allBalances = allBalances.concat(pageData.content);
          totalPages = pageData.totalPages ?? 1;
          page++;
        }
        const total = allBalances.reduce((sum: number, b) => sum + (b.balance ?? 0), 0);
        results.pointsCirculation = total.toLocaleString();
      } catch { /* API not available */ }

      setMetrics(results);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', p: '32px' }}>
      <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'text.primary' }}>
        {t('admin.dashboard')}
      </Typography>

      {/* Metric Cards — aggregated from available APIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {METRIC_DEFS.map((metric) => {
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
                {metrics[metric.key] ?? '—'}
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
                      <TableCell sx={{ fontSize: 13, py: '12px', px: '20px' }}>{order.userName ?? userMap[order.userId] ?? `User #${order.userId}`}</TableCell>
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

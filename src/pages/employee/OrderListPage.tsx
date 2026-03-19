import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import TollIcon from '@mui/icons-material/Toll';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useOrderStore } from '../../stores/order.store';
import type { Order, OrderStatus } from '../../types/order.types';

// ── Status config ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { labelKey: string; bgcolor: string; color: string }> = {
  pending:    { labelKey: 'employee.orders.statusPending',   bgcolor: '#DBEAFE', color: '#2563EB' },
  processing: { labelKey: 'employee.orders.statusPending',   bgcolor: '#DBEAFE', color: '#2563EB' },
  shipped:    { labelKey: 'employee.orders.statusShipped',   bgcolor: '#FEF3C7', color: '#D97706' },
  completed:  { labelKey: 'employee.orders.statusCompleted', bgcolor: '#DCFCE7', color: '#16A34A' },
  cancelled:  { labelKey: 'employee.orders.statusCancelled', bgcolor: '#F1F5F9', color: '#64748B' },
};

const TAB_STATUSES = ['all', 'pending', 'shipped', 'completed', 'cancelled'] as const;
type TabStatus = (typeof TAB_STATUSES)[number];

// Map tab value → API status param (undefined = no filter)
const TAB_TO_API_STATUS: Record<TabStatus, string | undefined> = {
  all:       undefined,
  pending:   'pending',
  shipped:   'shipped',
  completed: 'completed',
  cancelled: 'cancelled',
};

const PAGE_SIZE = 10;

// ── Order card ─────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const address = order.deliveryInfo?.address ?? '';

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#fff', overflow: 'hidden' }}
    >
      {/* Top row */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 3, py: 1.5, bgcolor: '#F8FAFC', borderBottom: '1px solid #F1F5F9',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>
            {t('employee.orders.orderNo')} {order.orderNo}
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#CBD5E1' }}>{order.createdAt}</Typography>
        </Box>
        <Chip
          label={t(statusCfg.labelKey)}
          size="small"
          sx={{
            bgcolor: statusCfg.bgcolor, color: statusCfg.color,
            fontWeight: 600, fontSize: 12, height: 24,
            '& .MuiChip-label': { px: '10px' },
          }}
        />
      </Box>

      {/* Middle row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2 }}>
        <Box
          sx={{
            width: 64, height: 64, borderRadius: '10px', bgcolor: '#DBEAFE',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, overflow: 'hidden',
          }}
        >
          {order.productImage ? (
            <Box component="img" src={order.productImage} alt={order.productName}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <ShoppingBagIcon sx={{ fontSize: 32, color: '#2563EB' }} />
          )}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
            {order.productName}
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.5 }}>
            ×{order.quantity}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          <TollIcon sx={{ fontSize: 20, color: '#D97706' }} />
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#D97706' }}>
            {order.pointsCost.toLocaleString()}
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#D97706' }}>
            {t('employee.orders.points')}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#F1F5F9' }} />

      {/* Bottom row */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 3, py: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <LocationOnIcon sx={{ fontSize: 15, color: '#94A3B8', flexShrink: 0 }} />
          <Typography
            sx={{
              fontSize: 13, color: '#64748B',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 480,
            }}
          >
            {address || '—'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/orders/${order.id}`)}
            sx={{
              borderRadius: '8px', fontSize: 13, fontWeight: 500, textTransform: 'none',
              borderColor: '#E2E8F0', color: '#475569',
              '&:hover': { borderColor: '#2563EB', color: '#2563EB' },
            }}
          >
            {t('employee.orders.viewDetail')}
          </Button>
          {order.status !== 'cancelled' && order.status !== 'completed' && (
            <Button
              variant="text"
              size="small"
              sx={{
                borderRadius: '8px', fontSize: 13, fontWeight: 500, textTransform: 'none',
                color: '#94A3B8', '&:hover': { color: '#DC2626', bgcolor: 'transparent' },
              }}
            >
              {t('employee.orders.refund')}
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function OrderListPage() {
  const { t } = useTranslation();
  const { orders, pagination, loading, error, fetchOrders } = useOrderStore();

  const [activeTab, setActiveTab] = useState<TabStatus>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Fetch whenever tab or page changes
  useEffect(() => {
    fetchOrders({
      page: page - 1,
      size: PAGE_SIZE,
      status: TAB_TO_API_STATUS[activeTab],
    });
  }, [activeTab, page, fetchOrders]);

  const handleTabChange = (_: React.SyntheticEvent, v: TabStatus) => {
    setActiveTab(v);
    setPage(1);
  };

  // Client-side search filter on the current page results
  const displayed = search
    ? orders.filter(
        (o) =>
          o.productName.toLowerCase().includes(search.toLowerCase()) ||
          o.orderNo.toLowerCase().includes(search.toLowerCase()),
      )
    : orders;

  return (
    <Box sx={{ p: '24px 32px', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>
            {t('employee.orders.title')}
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#64748B', mt: 0.5 }}>
            {t('employee.orders.subtitle')}
          </Typography>
        </Box>

        {/* Search box */}
        <Box
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px',
            px: 1.5, py: 0.75, width: 260,
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
          <InputBase
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('employee.orders.searchPlaceholder')}
            sx={{ fontSize: 14, flex: 1, '& input': { p: 0 } }}
          />
        </Box>
      </Box>

      {/* Status tabs */}
      <Box sx={{ borderBottom: '1px solid #E2E8F0' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            minHeight: 40,
            '& .MuiTabs-indicator': { bgcolor: '#2563EB', height: 2 },
            '& .MuiTab-root': {
              minHeight: 40, textTransform: 'none', fontSize: 14,
              fontWeight: 500, color: '#64748B', px: 2, py: 0,
            },
            '& .Mui-selected': { color: '#2563EB', fontWeight: 600 },
          }}
        >
          <Tab value="all"       label={t('employee.orders.tabAll')} />
          <Tab value="pending"   label={t('employee.orders.tabPending')} />
          <Tab value="shipped"   label={t('employee.orders.tabShipped')} />
          <Tab value="completed" label={t('employee.orders.tabCompleted')} />
          <Tab value="cancelled" label={t('employee.orders.tabCancelled')} />
        </Tabs>
      </Box>

      {/* Error */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Order list */}
      {!loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {displayed.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: '#94A3B8', py: 8, fontSize: 14 }}>
              {t('employee.orders.empty', '暂无订单记录')}
            </Typography>
          ) : (
            displayed.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </Box>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': { fontSize: 14 },
              '& .Mui-selected': { bgcolor: '#2563EB', color: '#fff', '&:hover': { bgcolor: '#1D4ED8' } },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

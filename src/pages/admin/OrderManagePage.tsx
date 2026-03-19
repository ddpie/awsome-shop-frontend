import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TollIcon from '@mui/icons-material/Toll';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useOrderStore } from '../../stores/order.store';

const STAT_CARDS = [
  { key: 'totalOrders',    icon: ShoppingCartIcon,  iconColor: '#2563EB', iconBg: '#EFF6FF' },
  { key: 'pending',        icon: LocalShippingIcon, iconColor: '#D97706', iconBg: '#FEF3C7' },
  { key: 'completed',      icon: CheckCircleIcon,   iconColor: '#16A34A', iconBg: '#DCFCE7' },
  { key: 'pointsConsumed', icon: TollIcon,          iconColor: '#7C3AED', iconBg: '#EDE9FE' },
];

const STATUS_CONFIG: Record<string, { labelKey: string; color: string; bg: string }> = {
  PENDING:   { labelKey: 'statusPending',   color: '#92400E', bg: '#FEF3C7' },
  pending:   { labelKey: 'statusPending',   color: '#92400E', bg: '#FEF3C7' },
  SHIPPED:   { labelKey: 'statusShipped',   color: '#1E40AF', bg: '#DBEAFE' },
  shipped:   { labelKey: 'statusShipped',   color: '#1E40AF', bg: '#DBEAFE' },
  READY:     { labelKey: 'statusShipped',   color: '#1E40AF', bg: '#DBEAFE' },
  COMPLETED: { labelKey: 'statusCompleted', color: '#166534', bg: '#DCFCE7' },
  completed: { labelKey: 'statusCompleted', color: '#166534', bg: '#DCFCE7' },
  CANCELLED: { labelKey: 'statusCancelled', color: '#991B1B', bg: '#FEE2E2' },
  cancelled: { labelKey: 'statusCancelled', color: '#991B1B', bg: '#FEE2E2' },
};

const DIVIDER = '1px solid #F1F5F9';
const PAGE_SIZE = 10;
const DEBOUNCE_MS = 400;

export default function OrderManagePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { adminOrders, adminLoading, adminPagination, fetchAdminOrders, updateAdminOrderStatus } = useOrderStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback((p: number, kw: string, st: string) => {
    fetchAdminOrders({ page: p - 1, size: PAGE_SIZE, keyword: kw || undefined, status: st || undefined });
  }, [fetchAdminOrders]);

  // Initial load
  useEffect(() => {
    load(1, '', '');
  }, [load]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      load(1, search, statusFilter);
    }, DEBOUNCE_MS);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setFilterAnchor(null);
    setPage(1);
    load(1, search, value);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    load(value, search, statusFilter);
  };

  const handleShip = async (id: string) => {
    await updateAdminOrderStatus(id, 'READY');
  };

  const STATUS_OPTIONS = [
    { value: '',          label: t('admin.orders.statusFilter') },
    { value: 'PENDING',   label: t('admin.orders.statusPending') },
    { value: 'READY',     label: t('admin.orders.statusShipped') },
    { value: 'COMPLETED', label: t('admin.orders.statusCompleted') },
    { value: 'CANCELLED', label: t('admin.orders.statusCancelled') },
  ];

  const currentStatusLabel = STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? t('admin.orders.statusFilter');
  const totalPages = adminPagination.totalPages ?? 1;
  const totalElements = adminPagination.totalElements ?? 0;
  const fromItem = totalElements === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const toItem = Math.min(page * PAGE_SIZE, totalElements);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', p: '32px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>
            {t('admin.orders.title')}
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.5 }}>
            {t('admin.orders.subtitle')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          disabled
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 500 }}
        >
          {t('admin.orders.export')}
        </Button>
      </Box>

      {/* Stat Cards — values have no aggregate API, show placeholder */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {STAT_CARDS.map((card) => {
          const IconComp = card.icon;
          return (
            <Paper key={card.key} elevation={0} sx={{ p: '18px 20px', borderRadius: '12px', border: DIVIDER }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: 13, color: '#64748B' }}>{t(`admin.orders.${card.key}`)}</Typography>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComp sx={{ fontSize: 20, color: card.iconColor }} />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#1E293B' }}>—</Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: '12px', height: 40, width: 280, border: DIVIDER, borderRadius: '8px', bgcolor: '#fff' }}>
          <SearchIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <InputBase
            placeholder={t('admin.orders.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ fontSize: 13, flex: 1 }}
          />
        </Box>
        <Box
          onClick={(e) => setFilterAnchor(e.currentTarget)}
          sx={{ display: 'flex', alignItems: 'center', gap: '6px', px: '14px', height: 40, border: DIVIDER, borderRadius: '8px', bgcolor: '#fff', cursor: 'pointer' }}
        >
          <FilterListIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>{currentStatusLabel}</Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#64748B' }} />
        </Box>
        <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)}>
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} onClick={() => handleStatusFilter(opt.value)}>{opt.label}</MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: DIVIDER, overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: '#F1F5F9' } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                {(['colOrderNo', 'colProduct', 'colUser', 'colPoints', 'colTime', 'colStatus', 'colAction'] as const).map((col) => (
                  <TableCell key={col} sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', py: '10px', px: '20px' }}>
                    {t(`admin.orders.${col}`)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {adminLoading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : adminOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: '#94A3B8', fontSize: 13 }}>
                    {t('admin.orders.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                adminOrders.map((order) => {
                  const statusKey = order.status as string;
                  const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG['pending'];
                  const isPending = statusKey === 'PENDING' || statusKey === 'pending';
                  return (
                    <TableRow key={order.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell sx={{ py: '12px', px: '20px' }}>
                        <Typography
                          sx={{ fontSize: 13, color: '#2563EB', fontWeight: 500, cursor: 'pointer' }}
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          {order.orderNo}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: '12px', px: '20px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          {order.productImage ? (
                            <Avatar
                              src={order.productImage}
                              variant="rounded"
                              sx={{ width: 36, height: 36, borderRadius: '8px', flexShrink: 0 }}
                            />
                          ) : (
                            <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <ShoppingBagIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                            </Box>
                          )}
                          <Typography sx={{ fontSize: 13, color: '#1E293B', fontWeight: 500 }}>{order.productName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: 13, py: '12px', px: '20px', color: '#475569' }}>
                        {order.userName ?? '—'}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13, fontWeight: 500, py: '12px', px: '20px', color: '#1E293B' }}>
                        {order.pointsCost?.toLocaleString() ?? '—'}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13, color: '#64748B', py: '12px', px: '20px' }}>
                        {order.createdAt ? order.createdAt.slice(0, 10) : '—'}
                      </TableCell>
                      <TableCell sx={{ py: '12px', px: '20px' }}>
                        <Chip
                          label={t(`admin.orders.${cfg.labelKey}`)}
                          size="small"
                          sx={{ fontSize: 11, fontWeight: 500, color: cfg.color, bgcolor: cfg.bg, borderRadius: '12px', height: 24 }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: '12px', px: '20px' }}>
                        <Box sx={{ display: 'flex', gap: '12px' }}>
                          <Typography
                            component="span"
                            sx={{ fontSize: 12, fontWeight: 500, color: '#2563EB', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                          >
                            {t('admin.orders.detail')}
                          </Typography>
                          {isPending && (
                            <Typography
                              component="span"
                              sx={{ fontSize: 12, fontWeight: 500, color: '#16A34A', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}
                              onClick={() => handleShip(String(order.id))}
                            >
                              {t('admin.orders.ship')}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '20px', py: '12px', borderTop: DIVIDER }}>
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            {t('admin.orders.showingRange', { from: fromItem, to: toItem, total: totalElements })}
          </Typography>
          <Pagination
            count={Math.max(1, totalPages)}
            page={page}
            onChange={handlePageChange}
            size="small"
            color="primary"
            shape="rounded"
          />
        </Box>
      </Paper>
    </Box>
  );
}

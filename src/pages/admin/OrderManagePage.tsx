import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TollIcon from '@mui/icons-material/Toll';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import BackpackIcon from '@mui/icons-material/Backpack';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SpeakerIcon from '@mui/icons-material/Speaker';
import type { SvgIconComponent } from '@mui/icons-material';

type OrderStatus = 'pending' | 'shipped' | 'completed' | 'cancelled';

interface MockOrder {
  orderNo: string;
  productName: string;
  productSpec: string;
  productIcon: SvgIconComponent;
  productIconColor: string;
  productIconBg: string;
  user: string;
  points: string;
  time: string;
  status: OrderStatus;
}

const MOCK_ORDERS: MockOrder[] = [
  { orderNo: 'ORD-20260176/001', productName: 'Sony WH-1000XM5 降噪耳机', productSpec: '黑色', productIcon: HeadphonesIcon, productIconColor: '#2563EB', productIconBg: '#DBEAFE', user: '员工', points: '2,480', time: '2026-03-17', status: 'pending' },
  { orderNo: 'ORD-20260175/001', productName: 'Apple Watch Series 9', productSpec: '星光色 41mm', productIcon: WatchIcon, productIconColor: '#7C3AED', productIconBg: '#EDE9FE', user: '员工', points: '3,200', time: '2026-03-17', status: 'shipped' },
  { orderNo: 'ORD-20260174/001', productName: '星巴克礼品卡 200元', productSpec: '电子卡', productIcon: CardGiftcardIcon, productIconColor: '#16A34A', productIconBg: '#DCFCE7', user: '员工', points: '680', time: '2026-03-16', status: 'completed' },
  { orderNo: 'ORD-20260173/001', productName: '小米双肩背包', productSpec: '都市休闲款', productIcon: BackpackIcon, productIconColor: '#D97706', productIconBg: '#FEF3C7', user: '员工', points: '450', time: '2026-03-16', status: 'completed' },
  { orderNo: 'ORD-20260172/001', productName: '罗技 MX Keys 无线键盘', productSpec: '深空灰', productIcon: KeyboardIcon, productIconColor: '#2563EB', productIconBg: '#DBEAFE', user: '员工', points: '860', time: '2026-03-15', status: 'cancelled' },
  { orderNo: 'ORD-20260171/001', productName: 'Bose SoundLink 蓝牙音箱', productSpec: '黑色', productIcon: SpeakerIcon, productIconColor: '#7C3AED', productIconBg: '#EDE9FE', user: '员工', points: '1,200', time: '2026-03-15', status: 'pending' },
];

const STAT_CARDS = [
  { key: 'totalOrders',    value: '1,284',   icon: ShoppingCartIcon, iconColor: '#2563EB', iconBg: '#EFF6FF' },
  { key: 'pending',        value: '23',      icon: LocalShippingIcon, iconColor: '#D97706', iconBg: '#FEF3C7' },
  { key: 'completed',      value: '1,198',   icon: CheckCircleIcon,  iconColor: '#16A34A', iconBg: '#DCFCE7' },
  { key: 'pointsConsumed', value: '586,400', icon: TollIcon,         iconColor: '#7C3AED', iconBg: '#EDE9FE' },
];

const STATUS_CONFIG: Record<OrderStatus, { labelKey: string; color: string; bg: string }> = {
  pending:   { labelKey: 'statusPending',   color: '#92400E', bg: '#FEF3C7' },
  shipped:   { labelKey: 'statusShipped',   color: '#1E40AF', bg: '#DBEAFE' },
  completed: { labelKey: 'statusCompleted', color: '#166534', bg: '#DCFCE7' },
  cancelled: { labelKey: 'statusCancelled', color: '#991B1B', bg: '#FEE2E2' },
};

const DIVIDER = '1px solid #F1F5F9';

export default function OrderManagePage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  const STATUS_OPTIONS = [
    { value: '',          label: t('admin.orders.statusFilter') },
    { value: 'pending',   label: t('admin.orders.statusPending') },
    { value: 'shipped',   label: t('admin.orders.statusShipped') },
    { value: 'completed', label: t('admin.orders.statusCompleted') },
    { value: 'cancelled', label: t('admin.orders.statusCancelled') },
  ];

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchSearch = !search || o.orderNo.toLowerCase().includes(search.toLowerCase()) || o.productName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const currentStatusLabel = STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? t('admin.orders.statusFilter');

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
        <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 500 }}>
          {t('admin.orders.export')}
        </Button>
      </Box>

      {/* Stat Cards */}
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
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#1E293B' }}>{card.value}</Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: '12px', height: 40, width: 280, border: DIVIDER, borderRadius: '8px', bgcolor: '#fff' }}>
          <SearchIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <InputBase placeholder={t('admin.orders.search')} value={search} onChange={(e) => setSearch(e.target.value)} sx={{ fontSize: 13, flex: 1 }} />
        </Box>
        <Box onClick={(e) => setFilterAnchor(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: '6px', px: '14px', height: 40, border: DIVIDER, borderRadius: '8px', bgcolor: '#fff', cursor: 'pointer' }}>
          <FilterListIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>{currentStatusLabel}</Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#64748B' }} />
        </Box>
        <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)}>
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} onClick={() => { setStatusFilter(opt.value); setFilterAnchor(null); }}>{opt.label}</MenuItem>
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
              {filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status];
                const ProductIcon = order.productIcon;
                return (
                  <TableRow key={order.orderNo} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ py: '12px', px: '20px' }}>
                      <Typography sx={{ fontSize: 13, color: '#2563EB', fontWeight: 500, cursor: 'pointer' }}>{order.orderNo}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: '12px', px: '20px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: order.productIconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <ProductIcon sx={{ fontSize: 18, color: order.productIconColor }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: 13, color: '#1E293B', fontWeight: 500 }}>{order.productName}</Typography>
                          <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>{order.productSpec}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, py: '12px', px: '20px', color: '#475569' }}>{order.user}</TableCell>
                    <TableCell sx={{ fontSize: 13, fontWeight: 500, py: '12px', px: '20px', color: '#1E293B' }}>{order.points}</TableCell>
                    <TableCell sx={{ fontSize: 13, color: '#64748B', py: '12px', px: '20px' }}>{order.time}</TableCell>
                    <TableCell sx={{ py: '12px', px: '20px' }}>
                      <Chip label={t(`admin.orders.${cfg.labelKey}`)} size="small" sx={{ fontSize: 11, fontWeight: 500, color: cfg.color, bgcolor: cfg.bg, borderRadius: '12px', height: 24 }} />
                    </TableCell>
                    <TableCell sx={{ py: '12px', px: '20px' }}>
                      <Box sx={{ display: 'flex', gap: '12px' }}>
                        <Typography component="span" sx={{ fontSize: 12, fontWeight: 500, color: '#2563EB', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
                          详情
                        </Typography>
                        {order.status === 'pending' && (
                          <Typography component="span" sx={{ fontSize: 12, fontWeight: 500, color: '#16A34A', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
                            {t('admin.orders.ship')}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '20px', py: '12px', borderTop: DIVIDER }}>
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            显示 1-{filtered.length} 共 {MOCK_ORDERS.length} 条记录
          </Typography>
          <Pagination count={Math.max(1, Math.ceil(filtered.length / 10))} page={page} onChange={(_, v) => setPage(v)} size="small" color="primary" shape="rounded" />
        </Box>
      </Paper>
    </Box>
  );
}

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
import Inventory2Icon from '@mui/icons-material/Inventory2';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TollIcon from '@mui/icons-material/Toll';
import type { SvgIconComponent } from '@mui/icons-material';

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
  { key: 'totalProducts', value: '128', change: '+12 本月新增', changeColor: '#16A34A', icon: Inventory2Icon, iconColor: '#2563EB', iconBg: '#EFF6FF' },
  { key: 'totalUsers', value: '356', change: '+28 本月新增', changeColor: '#16A34A', icon: GroupIcon, iconColor: '#16A34A', iconBg: '#DCFCE7' },
  { key: 'monthlyRedemptions', value: '89', change: '+15 较上月', changeColor: '#D97706', icon: ShoppingCartIcon, iconColor: '#D97706', iconBg: '#FEF3C7' },
  { key: 'pointsCirculation', value: '52,800', change: '本月发放总量', changeColor: '#64748B', icon: TollIcon, iconColor: '#7C3AED', iconBg: '#EDE9FE' },
];

type OrderStatus = 'completed' | 'pending' | 'processing';

const RECENT_ORDERS: { user: string; product: string; points: string; status: OrderStatus; time: string }[] = [
  { user: '王芳', product: '星巴克礼品卡 200元', points: '680', status: 'completed', time: '02-10 14:30' },
  { user: '李明', product: 'Sony WH-1000XM5 降噪耳机', points: '2,580', status: 'pending', time: '02-10 11:20' },
  { user: '赵敏', product: '小米双肩背包 都市休闲款', points: '450', status: 'processing', time: '02-09 16:45' },
  { user: '孙磊', product: 'Apple Watch Series 9', points: '3,200', status: 'completed', time: '02-09 09:15' },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  completed: { label: '已完成', color: '#166534', bg: '#DCFCE7' },
  pending: { label: '待发货', color: '#1E40AF', bg: '#DBEAFE' },
  processing: { label: '处理中', color: '#92400E', bg: '#FEF3C7' },
};

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', p: '32px' }}>
      <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'text.primary' }}>
        {t('admin.dashboard')}
      </Typography>

      {/* Metric Cards */}
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
              <Typography sx={{ fontSize: 12, color: metric.changeColor }}>
                {metric.change}
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
          <Link component="button" underline="none" sx={{ fontSize: 13, color: 'primary.main' }}>
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
              {RECENT_ORDERS.map((order, idx) => {
                const cfg = STATUS_CONFIG[order.status];
                return (
                  <TableRow key={idx} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ fontSize: 13, py: '12px', px: '20px' }}>{order.user}</TableCell>
                    <TableCell sx={{ fontSize: 13, py: '12px', px: '20px' }}>{order.product}</TableCell>
                    <TableCell sx={{ fontSize: 13, py: '12px', px: '20px' }}>{order.points}</TableCell>
                    <TableCell sx={{ py: '12px', px: '20px' }}>
                      <Chip label={cfg.label} size="small" sx={{ fontSize: 11, fontWeight: 500, color: cfg.color, bgcolor: cfg.bg, borderRadius: '12px', height: 24 }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, color: 'text.secondary', py: '12px', px: '20px' }}>{order.time}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

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
import HeadphonesIcon from '@mui/icons-material/Headphones';
import TollIcon from '@mui/icons-material/Toll';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const MOCK_ORDER = {
  orderNo: 'ORD-20260219-001#',
  status: 'shipped' as const,
  productName: 'Sony WH-1000XM5 降噪耳机',
  productSpec: '颜色：黑色 / 尺寸：均码',
  points: 2480,
  discount: 100,
  discountLabel: '新人首兑优惠',
  total: 2480,
  recipient: '李明',
  phone: '138****6789',
  address: '北京市海淀区中关村软件园 A 座 305',
  orderTime: '2026-02-19 14:30:25',
  payTime: '2026-02-19 14:30:25',
  platform: 'PC端',
  remark: '—',
  timeline: [
    { label: '订单创建成功', time: '2026-02-19 14:30:25', done: true },
    { label: '管理员确认发货', time: '2026-02-19 16:22:11', done: true, note: '快递单号：SF1234567890' },
    { label: '等待收货', time: '', done: false },
    { label: '完成', time: '', done: false },
  ],
};

const STATUS_CONFIG = {
  pending:   { label: '待发货', color: '#92400E', bg: '#FEF3C7' },
  shipped:   { label: '已发货', color: '#1E40AF', bg: '#DBEAFE' },
  completed: { label: '已完成', color: '#166534', bg: '#DCFCE7' },
  cancelled: { label: '已取消', color: '#991B1B', bg: '#FEE2E2' },
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

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const order = MOCK_ORDER;
  const statusCfg = STATUS_CONFIG[order.status];

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
              {order.timeline.map((step, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FiberManualRecordIcon sx={{ fontSize: 14, color: step.done ? '#2563EB' : '#CBD5E1', mt: '3px' }} />
                    {i < order.timeline.length - 1 && (
                      <Box sx={{ width: 2, flex: 1, bgcolor: step.done ? '#BFDBFE' : '#F1F5F9', my: '2px', minHeight: 24 }} />
                    )}
                  </Box>
                  <Box sx={{ pb: i < order.timeline.length - 1 ? 2 : 0 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: step.done ? 600 : 400, color: step.done ? '#1E293B' : '#94A3B8' }}>
                      {step.label}
                    </Typography>
                    {step.time && (
                      <Typography sx={{ fontSize: 12, color: '#94A3B8', mt: 0.25 }}>{step.time}</Typography>
                    )}
                    {step.note && (
                      <Typography sx={{ fontSize: 12, color: '#2563EB', mt: 0.25 }}>{step.note}</Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </SectionCard>

          {/* Product info */}
          <SectionCard title={t('employee.orderDetail.productInfo')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 64, height: 64, borderRadius: '10px', bgcolor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <HeadphonesIcon sx={{ fontSize: 32, color: '#2563EB' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{order.productName}</Typography>
                <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.5 }}>{order.productSpec}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                <TollIcon sx={{ fontSize: 20, color: '#D97706' }} />
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#D97706' }}>{order.points.toLocaleString()}</Typography>
                <Typography sx={{ fontSize: 13, color: '#D97706' }}>积分</Typography>
              </Box>
            </Box>
          </SectionCard>

          {/* Points breakdown */}
          <SectionCard title={t('employee.orderDetail.pointsBreakdown')}>
            <InfoRow label={t('employee.orderConfirm.unitPrice')} value={`${order.points.toLocaleString()} 积分`} />
            <InfoRow label={order.discountLabel} value={`- ${order.discount} 积分`} valueColor="#2563EB" />
            <Divider sx={{ borderColor: '#F1F5F9', my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{t('employee.orderDetail.totalPoints')}</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>{order.total.toLocaleString()} 积分</Typography>
            </Box>
          </SectionCard>

          {/* Delivery info */}
          <SectionCard title={t('employee.orderDetail.deliveryInfo')}>
            <InfoRow label={t('employee.orderConfirm.recipient')} value={order.recipient} />
            <InfoRow label="联系电话" value={order.phone} />
            <InfoRow label={t('employee.orderConfirm.address')} value={order.address} />
          </SectionCard>

          {/* Order info */}
          <SectionCard title={t('employee.orderDetail.orderInfo')}>
            <InfoRow label={t('employee.orderDetail.orderNo')} value={order.orderNo} />
            <InfoRow label={t('employee.orderDetail.orderTime')} value={order.orderTime} />
            <InfoRow label={t('employee.orderDetail.payTime')} value={order.payTime} />
            <InfoRow label={t('employee.orderDetail.platform')} value={order.platform} />
            <InfoRow label={t('employee.orderDetail.remark')} value={order.remark} />
          </SectionCard>

        </Box>

        {/* Right: action panel (placeholder for future use) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button variant="outlined" fullWidth onClick={() => navigate('/orders')}
              sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 500, borderColor: '#E2E8F0', color: '#475569' }}>
              {t('employee.orderDetail.backToList')}
            </Button>
            <Button variant="text" fullWidth
              sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 500, color: '#94A3B8', '&:hover': { color: '#DC2626' } }}>
              {t('employee.orders.refund')}
            </Button>
          </Paper>
        </Box>
      </Box>

    </Box>
  );
}

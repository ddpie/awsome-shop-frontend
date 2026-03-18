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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const MOCK_ORDER = {
  orderNo: 'EX20260208001',
  status: 'shipped' as const,
  productName: 'Sony WH-1000XM5 降噪耳机',
  productSpec: '颜色：黑色 / 尺寸：均码 / 数量：1件',
  points: 2580,
  discount: 0,
  total: 2580,
  employee: { name: '张明辉', id: 'EMP10102756', dept: '技术研发部', email: 'zhangmh@company.com' },
  recipient: '张明', phone: '138****6789',
  address: '北京市海淀区中关村软件园 A 座 305',
  orderTime: '2026-02-16 14:30:05',
  payTime: '2026-02-16 14:30:05',
  platform: 'PC端',
  remark: '—',
  timeline: [
    { label: '兑换申请提交', time: '2026-02-16 14:30:05', done: true },
    { label: '管理员确认发货', time: '2026-02-16 16:22:11', done: true, note: '快递单号：SF1234567890' },
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

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75 }}>
      <Typography sx={{ fontSize: 13, color: '#64748B', minWidth: 80 }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: valueColor ?? '#1E293B', textAlign: 'right' }}>{value}</Typography>
    </Box>
  );
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const order = MOCK_ORDER;
  const statusCfg = STATUS_CONFIG[order.status];

  return (
    <Box sx={{ p: '32px', display: 'flex', flexDirection: 'column', gap: 3, bgcolor: '#F8FAFC', minHeight: '100%' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Breadcrumbs sx={{ fontSize: 13, mb: 1 }}>
            <Link component={RouterLink} to="/admin/orders" underline="hover" sx={{ fontSize: 13, color: '#64748B' }}>
              {t('admin.orders.title')}
            </Link>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>{t('admin.orderDetail.breadcrumb')}</Typography>
          </Breadcrumbs>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>{order.orderNo}</Typography>
            <Chip label={statusCfg.label} size="small"
              sx={{ bgcolor: statusCfg.bg, color: statusCfg.color, fontWeight: 600, fontSize: 12, height: 24 }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button variant="outlined" size="small" startIcon={<LocalShippingIcon sx={{ fontSize: 15 }} />}
            sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 500, borderColor: '#E2E8F0', color: '#1E293B' }}>
            {t('admin.orderDetail.updateStatus')}
          </Button>
          <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>A</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 3 }}>
        {/* Left */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Product info */}
          <SectionCard title={t('admin.orderDetail.productInfo')}>
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
          <SectionCard title={t('admin.orderDetail.pointsBreakdown')}>
            <InfoRow label={t('employee.orderConfirm.unitPrice')} value={`${order.points.toLocaleString()} 积分`} />
            <InfoRow label="优惠减免" value={`- ${order.discount} 积分`} valueColor="#2563EB" />
            <Divider sx={{ borderColor: '#F1F5F9', my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{t('admin.orderDetail.totalPoints')}</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>{order.total.toLocaleString()} 积分</Typography>
            </Box>
          </SectionCard>

          {/* Employee info */}
          <SectionCard title={t('admin.orderDetail.employeeInfo')}>
            <InfoRow label="员工姓名" value={order.employee.name} />
            <InfoRow label="员工 ID" value={order.employee.id} />
            <InfoRow label="所属部门" value={order.employee.dept} />
            <InfoRow label="联系邮箱" value={order.employee.email} />
          </SectionCard>

          {/* Delivery info */}
          <SectionCard title={t('admin.orderDetail.deliveryInfo')}>
            <InfoRow label={t('employee.orderConfirm.recipient')} value={order.recipient} />
            <InfoRow label="联系电话" value={order.phone} />
            <InfoRow label={t('employee.orderConfirm.address')} value={order.address} />
          </SectionCard>

          {/* Order info */}
          <SectionCard title={t('admin.orderDetail.orderInfo')}>
            <InfoRow label="订单编号" value={order.orderNo} />
            <InfoRow label="下单时间" value={order.orderTime} />
            <InfoRow label="支付时间" value={order.payTime} />
            <InfoRow label="下单平台" value={order.platform} />
            <InfoRow label="订单备注" value={order.remark} />
          </SectionCard>

        </Box>

        {/* Right: status timeline */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <SectionCard title={t('admin.orderDetail.statusTimeline')}>
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
                    <Typography sx={{ fontSize: 13, fontWeight: step.done ? 600 : 400, color: step.done ? '#1E293B' : '#94A3B8' }}>
                      {step.label}
                    </Typography>
                    {step.time && <Typography sx={{ fontSize: 12, color: '#94A3B8', mt: 0.25 }}>{step.time}</Typography>}
                    {step.note && <Typography sx={{ fontSize: 12, color: '#2563EB', mt: 0.25 }}>{step.note}</Typography>}
                  </Box>
                </Box>
              ))}
            </Box>
          </SectionCard>
        </Box>
      </Box>

    </Box>
  );
}

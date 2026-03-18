import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_PRODUCTS: Record<string, {
  name: string;
  spec: string;
  stock: string;
  unitPoints: number;
  discount: number;
  discountLabel: string;
  bgColor: string;
  iconColor: string;
}> = {
  '1': {
    name: 'Sony WH-1000XM5 降噪耳机',
    spec: '颜色：黑色',
    stock: '库存充足',
    unitPoints: 2580,
    discount: 100,
    discountLabel: '新人首兑优惠',
    bgColor: '#DBEAFE',
    iconColor: '#2563EB',
  },
};

const DEFAULT_PRODUCT = MOCK_PRODUCTS['1'];

const MOCK_USER = { currentPoints: 2580 };

const MOCK_ADDRESS = {
  recipientName: '李明  138****6789',
  address: '北京市海淀区中关村软件园 A 座 305',
};

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <Paper
      elevation={0}
      sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#fff', overflow: 'hidden' }}
    >
      {children}
    </Paper>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B', px: 3, pt: 3, pb: 2 }}>
      {children}
    </Typography>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function OrderConfirmPage() {

  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const product = (productId ? MOCK_PRODUCTS[productId] : undefined) ?? DEFAULT_PRODUCT;
  const [qty, setQty] = useState(1);

  const subtotal = product.unitPoints * qty;
  const totalPoints = subtotal - product.discount;
  const remaining = MOCK_USER.currentPoints - totalPoints;

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 720, px: 0, py: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Page Header */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Breadcrumbs sx={{ fontSize: 13 }}>
            <Link component={RouterLink} to="/shop" underline="hover" sx={{ fontSize: 13, color: '#2563EB' }}>
              {t('employee.nav.home', '首页')}
            </Link>
            <Link component={RouterLink} to={productId ? `/products/${productId}` : '/shop'} underline="hover" sx={{ fontSize: 13, color: '#2563EB' }}>
              {product.name}
            </Link>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>
              {t('employee.orderConfirm.breadcrumb', '确认兑换')}
            </Typography>
          </Breadcrumbs>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>
            {t('employee.orderConfirm.title', '确认兑换')}
          </Typography>
        </Box>

        {/* ── 1. 商品信息 ── */}
        <SectionCard>
          <SectionTitle>{t('employee.orderConfirm.productInfo', '商品信息')}</SectionTitle>
          <Divider sx={{ borderColor: '#F1F5F9', mx: 3 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
            {/* Thumbnail */}
            <Box
              sx={{
                width: 80, height: 80, borderRadius: '8px',
                bgcolor: product.bgColor, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <HeadphonesIcon sx={{ fontSize: 40, color: product.iconColor }} />
            </Box>

            {/* Name / spec / stock */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
                {product.name}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                {product.spec}
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#16A34A' }}>
                {product.stock}
              </Typography>
            </Box>

            {/* Qty column */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              <Typography sx={{ fontSize: 12, color: '#64748B' }}>
                {t('employee.orderConfirm.quantity', '数量')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  sx={{
                    width: 28, height: 28, border: '1px solid #E2E8F0',
                    borderRadius: '6px 0 0 6px', bgcolor: '#F8FAFC',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', '&:hover': { bgcolor: '#E2E8F0' },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 13, color: '#64748B' }} />
                </Box>
                <Box
                  sx={{
                    width: 36, height: 28, border: '1px solid #E2E8F0',
                    borderLeft: 'none', borderRight: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{qty}</Typography>
                </Box>
                <Box
                  component="button"
                  onClick={() => setQty((q) => q + 1)}
                  sx={{
                    width: 28, height: 28, border: '1px solid #E2E8F0',
                    borderRadius: '0 6px 6px 0', bgcolor: '#F8FAFC',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', '&:hover': { bgcolor: '#E2E8F0' },
                  }}
                >
                  <AddIcon sx={{ fontSize: 13, color: '#64748B' }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </SectionCard>

        {/* ── 2. 积分明细 ── */}
        <SectionCard>
          <SectionTitle>{t('employee.orderConfirm.pointsBreakdown', '积分明细')}</SectionTitle>
          <Divider sx={{ borderColor: '#F1F5F9', mx: 3 }} />
          <Box sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, color: '#64748B' }}>
                {t('employee.orderConfirm.unitPrice', '商品积分价')}
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                {product.unitPoints.toLocaleString()} {t('employee.pointsUnit', '积分')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, color: '#64748B' }}>
                {t('employee.orderConfirm.quantity', '数量')}
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                × {qty}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, color: '#2563EB' }}>
                {product.discountLabel}
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#2563EB' }}>
                - {product.discount.toLocaleString()} {t('employee.pointsUnit', '积分')}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
                {t('employee.orderConfirm.totalPoints', '应付积分')}
              </Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>
                {totalPoints.toLocaleString()} {t('employee.pointsUnit', '积分')}
              </Typography>
            </Box>
          </Box>
        </SectionCard>

        {/* ── Balance Bar ── */}
        <Box
          sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            bgcolor: '#EFF6FF', borderRadius: '8px', px: 2.5, py: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 20, color: '#2563EB' }} />
            <Typography sx={{ fontSize: 14, color: '#64748B' }}>
              {t('employee.orderConfirm.currentBalance', '当前积分余额')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>
              {MOCK_USER.currentPoints.toLocaleString()} {t('employee.pointsUnit', '积分')}
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#CBD5E1' }}>→</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#16A34A' }}>
              {t('employee.orderConfirm.afterRedemption', '兑换后剩余')} {remaining.toLocaleString()} {t('employee.pointsUnit', '积分')}
            </Typography>
          </Box>
        </Box>

        {/* ── 3. 收货信息 ── */}
        <SectionCard>
          <SectionTitle>{t('employee.orderConfirm.deliveryInfo', '收货信息')}</SectionTitle>
          <Divider sx={{ borderColor: '#F1F5F9', mx: 3 }} />
          <Box sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, color: '#64748B' }}>
                {t('employee.orderConfirm.recipient', '收货人')}
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                {MOCK_ADDRESS.recipientName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, color: '#64748B' }}>
                {t('employee.orderConfirm.address', '收货地址')}
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                {MOCK_ADDRESS.address}
              </Typography>
            </Box>
          </Box>
        </SectionCard>

        {/* ── 4. Buttons ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CheckCircleIcon />}
            onClick={() => navigate('/orders')}
            sx={{
              height: 48, borderRadius: '8px',
              fontSize: 16, fontWeight: 600, textTransform: 'none',
              bgcolor: '#2563EB', boxShadow: 'none',
              '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
            }}
          >
            {t('employee.orderConfirm.confirmBtn', '确认兑换')}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(-1)}
            sx={{
              height: 48, borderRadius: '8px',
              fontSize: 14, fontWeight: 500, textTransform: 'none',
              borderColor: '#E2E8F0', color: '#64748B',
              '&:hover': { borderColor: '#CBD5E1', bgcolor: 'transparent' },
            }}
          >
            {t('employee.orderConfirm.backBtn', '返回商品')}
          </Button>
        </Box>

        {/* ── 5. 温馨提示 ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, pb: 2 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>
            {t('employee.orderConfirm.noteTitle', '温馨提示')}
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>
            · {t('employee.orderConfirm.note1', '兑换成功后积分将立即扣除，不可撤销')}
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>
            · {t('employee.orderConfirm.note2', '商品将在 3-5 个工作日内配送至收货地址')}
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>
            · {t('employee.orderConfirm.note3', '如有问题请联系管理员处理')}
          </Typography>
        </Box>

      </Box>
    </Box>
  );
}

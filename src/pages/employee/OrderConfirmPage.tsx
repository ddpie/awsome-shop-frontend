import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { productService } from '../../services/product.service';
import { pointsService } from '../../services/points.service';
import { useOrderStore } from '../../stores/order.store';
import type { Product } from '../../types/product.types';
import type { PointsBalance } from '../../types/points.types';

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

  const { placeOrder, loading: orderLoading, error: orderError, clearError } = useOrderStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [balance, setBalance] = useState<PointsBalance | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [qty] = useState(1);

  useEffect(() => {
    if (!productId) return;
    setPageLoading(true);
    setPageError(null);

    Promise.all([
      productService.getProductById(productId),
      pointsService.getBalance(),
    ])
      .then(([prodRes, balRes]) => {
        // Unwrap envelopes
        const prod = (prodRes as unknown as { data?: Product }).data ?? prodRes;
        const rawBal = (balRes as unknown as { data?: PointsBalance }).data ?? balRes;
        const bal: PointsBalance = {
          ...rawBal,
          current: rawBal.current ?? rawBal.balance ?? 0,
          totalEarned: rawBal.totalEarned ?? 0,
          totalSpent: rawBal.totalSpent ?? 0,
          redemptionCount: rawBal.redemptionCount ?? 0,
        };
        // Normalize pointsPrice → pointsCost
        setProduct({ ...prod, pointsCost: prod.pointsCost ?? (prod as unknown as { pointsPrice?: number }).pointsPrice ?? 0 } as Product);
        setBalance(bal);
      })
      .catch((e: unknown) => {
        setPageError((e as Error).message ?? t('common.error', '加载失败'));
      })
      .finally(() => setPageLoading(false));
  }, [productId, t]);

  const unitPoints = product?.pointsCost ?? 0;
  const totalPoints = unitPoints * qty;
  const remaining = (balance?.balance ?? 0) - totalPoints;

  const handleConfirm = async () => {
    if (!productId) return;
    clearError();
    try {
      const order = await placeOrder(productId);
      navigate('/orders/success', {
        state: {
          orderNo: order.orderNo,
          productName: order.productName,
          pointsSpent: order.pointsCost,
          remainingBalance: remaining,
        },
      });
    } catch {
      // error is already set in store
    }
  };

  if (pageLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (pageError || !product) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{pageError ?? t('common.error', '加载失败')}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 720, px: 0, py: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Page Header */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Breadcrumbs sx={{ fontSize: 13 }}>
            <Link component={RouterLink} to="/" underline="hover" sx={{ fontSize: 13, color: '#2563EB' }}>
              {t('employee.nav.home', '首页')}
            </Link>
            <Link component={RouterLink} to={`/products/${productId}`} underline="hover" sx={{ fontSize: 13, color: '#2563EB' }}>
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

        {/* Error from place-order */}
        {orderError && (
          <Alert severity="error" onClose={clearError}>{orderError}</Alert>
        )}

        {/* ── 1. 商品信息 ── */}
        <SectionCard>
          <SectionTitle>{t('employee.orderConfirm.productInfo', '商品信息')}</SectionTitle>
          <Divider sx={{ borderColor: '#F1F5F9', mx: 3 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
            {/* Thumbnail */}
            <Box
              sx={{
                width: 80, height: 80, borderRadius: '8px',
                bgcolor: '#DBEAFE', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {product.imageUrl ? (
                <Box component="img" src={product.imageUrl} alt={product.name}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ShoppingBagIcon sx={{ fontSize: 40, color: '#2563EB' }} />
              )}
            </Box>

            {/* Name / stock */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
                {product.name}
              </Typography>
              {product.categoryName && (
                <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                  {product.categoryName}
                </Typography>
              )}
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: product.stock > 0 ? '#16A34A' : '#DC2626' }}>
                {product.stock > 0
                  ? t('employee.productDetail.inStock', '有货')
                  : t('employee.orderConfirm.outOfStock', '库存不足')}
              </Typography>
            </Box>

            {/* Qty column (fixed at 1 per order per spec) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              <Typography sx={{ fontSize: 12, color: '#64748B' }}>
                {t('employee.orderConfirm.quantity', '数量')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="button"
                  disabled
                  sx={{
                    width: 28, height: 28, border: '1px solid #E2E8F0',
                    borderRadius: '6px 0 0 6px', bgcolor: '#F8FAFC',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'not-allowed', opacity: 0.5,
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
                  disabled
                  sx={{
                    width: 28, height: 28, border: '1px solid #E2E8F0',
                    borderRadius: '0 6px 6px 0', bgcolor: '#F8FAFC',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'not-allowed', opacity: 0.5,
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
                {unitPoints.toLocaleString()} {t('employee.pointsUnit', '积分')}
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
              {(balance?.balance ?? 0).toLocaleString()} {t('employee.pointsUnit', '积分')}
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#CBD5E1' }}>→</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: remaining >= 0 ? '#16A34A' : '#DC2626' }}>
              {t('employee.orderConfirm.afterRedemption', '兑换后剩余')} {remaining.toLocaleString()} {t('employee.pointsUnit', '积分')}
            </Typography>
          </Box>
        </Box>

        {/* Insufficient points warning */}
        {remaining < 0 && (
          <Alert severity="warning">
            {t('employee.orderConfirm.insufficientPoints', '积分余额不足，无法完成兑换')}
          </Alert>
        )}

        {/* ── 3. Buttons ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={orderLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
            onClick={handleConfirm}
            disabled={orderLoading || remaining < 0 || product.stock <= 0}
            sx={{
              height: 48, borderRadius: '8px',
              fontSize: 16, fontWeight: 600, textTransform: 'none',
              bgcolor: '#2563EB', boxShadow: 'none',
              '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
            }}
          >
            {orderLoading
              ? t('employee.orderConfirm.confirming', '提交中...')
              : t('employee.orderConfirm.confirmBtn', '确认兑换')}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(-1)}
            disabled={orderLoading}
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

        {/* ── 4. 温馨提示 ── */}
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

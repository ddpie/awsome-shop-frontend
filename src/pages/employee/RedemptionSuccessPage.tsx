import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';

interface SuccessState {
  orderNo: string;
  productName: string;
  pointsSpent: number;
  remainingBalance: number;
}

export default function RedemptionSuccessPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as SuccessState | null;

  // Guard: if navigated here without state, show a fallback
  if (!state) {
    return (
      <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={0} sx={{ width: 480, borderRadius: '16px', border: '1px solid #E2E8F0', p: '40px 40px 32px' }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            {t('employee.success.noData', '未找到订单信息，请从兑换流程重新进入')}
          </Alert>
          <Button variant="contained" fullWidth onClick={() => navigate('/')}
            sx={{ height: 44, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
            {t('employee.success.backHome')}
          </Button>
        </Paper>
      </Box>
    );
  }

  const rows = [
    { label: t('employee.success.orderNo'),     value: state.orderNo },
    { label: t('employee.success.product'),     value: state.productName,                                    valueColor: '#2563EB' },
    { label: t('employee.success.pointsSpent'), value: `${state.pointsSpent.toLocaleString()} ${t('employee.pointsUnit', '积分')}` },
    { label: t('employee.success.remaining'),   value: `${state.remainingBalance.toLocaleString()} ${t('employee.pointsUnit', '积分')}` },
    { label: t('employee.success.delivery'),    value: t('employee.success.deliveryDays', '3-5 个工作日') },
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={0} sx={{ width: 480, borderRadius: '16px', border: '1px solid #E2E8F0', bgcolor: '#fff', overflow: 'hidden', p: '40px 40px 32px' }}>

        {/* Success icon */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{
            width: 72, height: 72, borderRadius: '50%',
            bgcolor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
          }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: '#16A34A' }} />
          </Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>
            {t('employee.success.title')}
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.75 }}>
            {t('employee.success.subtitle')}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#F1F5F9', mb: 2.5 }} />

        {/* Order summary */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          {rows.map((row) => (
            <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 13, color: '#64748B' }}>{row.label}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: row.valueColor ?? '#1E293B' }}>
                {row.value}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="contained" fullWidth
            startIcon={<ListAltIcon />}
            onClick={() => navigate('/orders')}
            sx={{ height: 44, borderRadius: '8px', fontSize: 14, fontWeight: 600, textTransform: 'none', boxShadow: 'none' }}
          >
            {t('employee.success.viewOrders')}
          </Button>
          <Button
            variant="outlined" fullWidth
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ height: 44, borderRadius: '8px', fontSize: 14, fontWeight: 500, textTransform: 'none', borderColor: '#E2E8F0', color: '#475569' }}
          >
            {t('employee.success.backHome')}
          </Button>
          <Typography
            component="span"
            onClick={() => navigate('/')}
            sx={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', cursor: 'pointer', mt: 0.5, '&:hover': { color: '#2563EB' } }}
          >
            {t('employee.success.continueShopping')}
          </Typography>
        </Box>

      </Paper>
    </Box>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CelebrationIcon from '@mui/icons-material/Celebration';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { usePointsStore } from '../../stores/points.store';

// ── Static config ──────────────────────────────────────────────────────────

const EARN_WAYS = [
  {
    icon: StarIcon,
    bgColor: '#DBEAFE',
    iconColor: '#2563EB',
    titleKey: 'employee.points.earnWay1Title',
    descKey: 'employee.points.earnWay1Desc',
    amount: '+1,000/年',
    amountColor: '#16A34A',
  },
  {
    icon: EmojiEventsIcon,
    bgColor: '#FEF3C7',
    iconColor: '#D97706',
    titleKey: 'employee.points.earnWay2Title',
    descKey: 'employee.points.earnWay2Desc',
    amount: '+500~2,000',
    amountColor: '#16A34A',
  },
  {
    icon: CelebrationIcon,
    bgColor: '#FCE7F3',
    iconColor: '#DB2777',
    titleKey: 'employee.points.earnWay3Title',
    descKey: 'employee.points.earnWay3Desc',
    amount: '+200~800',
    amountColor: '#16A34A',
  },
  {
    icon: WorkspacePremiumIcon,
    bgColor: '#DCFCE7',
    iconColor: '#16A34A',
    titleKey: 'employee.points.earnWay4Title',
    descKey: 'employee.points.earnWay4Desc',
    amount: '+500~5,000',
    amountColor: '#16A34A',
  },
];

const QUICK_ACTIONS = [
  { icon: ShoppingBagIcon, labelKey: 'employee.points.shop', color: '#2563EB', bg: '#DBEAFE', route: '/' },
  { icon: ReceiptIcon, labelKey: 'employee.points.history', color: '#7C3AED', bg: '#EDE9FE', route: '/orders' },
  { icon: InfoIcon, labelKey: 'employee.points.rules', color: '#D97706', bg: '#FEF3C7', route: null },
  { icon: HelpIcon, labelKey: 'employee.points.help', color: '#16A34A', bg: '#DCFCE7', route: null },
];

const TAB_TYPES = [undefined, 'EARN', 'SPEND'] as const;

// ── Main component ─────────────────────────────────────────────────────────

export default function PointsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const { balance, transactions, loading, error, fetchBalance, fetchTransactions } = usePointsStore();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    fetchTransactions({ page: 0, size: 20, type: TAB_TYPES[tab] });
  }, [tab, fetchTransactions]);

  const isEarn = (type: string) => type === 'EARN';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: '24px 32px' }}>

      {/* ── 1. Banner Card ── */}
      <Box
        sx={{
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 60%, #60A5FA 100%)',
          p: '28px 32px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)' }} />
        <Box sx={{ position: 'absolute', bottom: -60, right: 80, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />

        {/* Top row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
            {t('employee.points.currentPoints')}
          </Typography>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            }}
          >
            <NotificationsIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
        </Box>

        {/* Big number */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 3 }}>
          {balance == null ? (
            <Skeleton variant="text" width={160} height={60} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          ) : (
            <>
              <Typography sx={{ fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {balance.current.toLocaleString()}
              </Typography>
              <Typography sx={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                {t('employee.points.unit')}
              </Typography>
            </>
          )}
        </Box>

        {/* Bottom stats */}
        <Box
          sx={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0,
            borderTop: '1px solid rgba(255,255,255,0.2)', pt: 2,
          }}
        >
          {[
            { value: balance?.totalEarned, labelKey: 'employee.points.totalEarned' },
            { value: balance?.totalSpent, labelKey: 'employee.points.totalSpent' },
            { value: balance?.redemptionCount, labelKey: 'employee.points.redemptions' },
          ].map((stat, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25,
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}
            >
              {stat.value == null ? (
                <Skeleton variant="text" width={60} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
              ) : (
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
                  {stat.value.toLocaleString()}
                </Typography>
              )}
              <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                {t(stat.labelKey)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── 2. Quick Actions ── */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#fff', p: '20px 24px' }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1E293B', mb: 2 }}>
          {t('employee.points.quickActions')}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {QUICK_ACTIONS.map((action) => {
            const IconComp = action.icon;
            return (
              <Box
                key={action.labelKey}
                onClick={() => action.route && navigate(action.route)}
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                  cursor: action.route ? 'pointer' : 'default',
                  '&:hover .action-icon-wrap': { transform: action.route ? 'scale(1.05)' : 'none' },
                }}
              >
                <Box
                  className="action-icon-wrap"
                  sx={{
                    width: 52, height: 52, borderRadius: '50%', bgcolor: action.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.15s',
                  }}
                >
                  <IconComp sx={{ fontSize: 24, color: action.color }} />
                </Box>
                <Typography sx={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>
                  {t(action.labelKey)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* ── 3. Earn Ways ── */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#fff', overflow: 'hidden' }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1E293B', px: 3, pt: 2.5, pb: 1.5 }}>
          {t('employee.points.earnWays')}
        </Typography>
        <Divider sx={{ borderColor: '#F1F5F9' }} />
        <List disablePadding>
          {EARN_WAYS.map((way, i) => {
            const IconComp = way.icon;
            return (
              <Box key={i}>
                <ListItem sx={{ px: 3, py: 1.5, gap: 2 }}>
                  <Box
                    sx={{
                      width: 40, height: 40, borderRadius: '10px', bgcolor: way.bgColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <IconComp sx={{ fontSize: 20, color: way.iconColor }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>
                      {t(way.titleKey)}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#64748B', mt: 0.25 }}>
                      {t(way.descKey)}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: way.amountColor, flexShrink: 0 }}>
                    {way.amount}
                  </Typography>
                </ListItem>
                {i < EARN_WAYS.length - 1 && <Divider sx={{ borderColor: '#F8FAFC', ml: '72px' }} />}
              </Box>
            );
          })}
        </List>
      </Paper>

      {/* ── 4. Transaction Details ── */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#fff', overflow: 'hidden' }}>
        {/* Header row with tabs */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2, pb: 0 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>
            {t('employee.points.details')}
          </Typography>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              minHeight: 32,
              '& .MuiTabs-indicator': { height: 2, borderRadius: 1 },
              '& .MuiTab-root': {
                minHeight: 32, py: 0.5, px: 1.5, fontSize: 13, fontWeight: 500,
                textTransform: 'none', color: '#64748B',
                '&.Mui-selected': { color: '#2563EB', fontWeight: 600 },
              },
            }}
          >
            <Tab label={t('employee.points.tabAll')} />
            <Tab label={t('employee.points.tabEarn')} />
            <Tab label={t('employee.points.tabSpend')} />
          </Tabs>
        </Box>

        <Divider sx={{ borderColor: '#F1F5F9', mt: 1 }} />

        {/* Error state */}
        {error && (
          <Box sx={{ px: 3, py: 2 }}>
            <Alert severity="error" onClose={() => usePointsStore.getState().clearError()}>{error}</Alert>
          </Box>
        )}

        {/* Loading state */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {/* Transaction list */}
        {!loading && !error && (
          <List disablePadding>
            {transactions.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography sx={{ fontSize: 14, color: '#94A3B8' }}>
                  {t('employee.points.noTransactions', '暂无记录')}
                </Typography>
              </Box>
            ) : (
              transactions.map((tx, i) => (
                <Box key={tx.id}>
                  <ListItem sx={{ px: 3, py: 1.75, gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                          {tx.description}
                        </Typography>
                        <Chip
                          label={t(isEarn(tx.type) ? 'employee.points.income' : 'employee.points.expense')}
                          size="small"
                          sx={{
                            height: 20, fontSize: 11, fontWeight: 600,
                            bgcolor: isEarn(tx.type) ? '#DCFCE7' : '#FEE2E2',
                            color: isEarn(tx.type) ? '#16A34A' : '#DC2626',
                            '& .MuiChip-label': { px: '8px' },
                          }}
                        />
                      </Box>
                      <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>
                        {tx.createdAt}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.25, flexShrink: 0 }}>
                      <Typography
                        sx={{ fontSize: 16, fontWeight: 700, color: isEarn(tx.type) ? '#16A34A' : '#DC2626' }}
                      >
                        {isEarn(tx.type) ? '+' : ''}{tx.amount.toLocaleString()}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>
                        {t('employee.points.balance')} {tx.balance.toLocaleString()}
                      </Typography>
                    </Box>
                  </ListItem>
                  {i < transactions.length - 1 && <Divider sx={{ borderColor: '#F8FAFC', ml: 3 }} />}
                </Box>
              ))
            )}
          </List>
        )}

        <Divider sx={{ borderColor: '#F1F5F9' }} />
        <Box sx={{ px: 3, py: 1.5, textAlign: 'center' }}>
          <Typography
            component="span"
            onClick={() => fetchTransactions({ page: 0, size: 50, type: TAB_TYPES[tab] })}
            sx={{
              fontSize: 13, color: '#2563EB', cursor: 'pointer', fontWeight: 500,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {t('employee.points.viewMore')}
          </Typography>
        </Box>
      </Paper>

    </Box>
  );
}

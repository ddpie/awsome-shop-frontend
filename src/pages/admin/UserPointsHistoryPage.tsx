import { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TollIcon from '@mui/icons-material/Toll';

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_USER = { name: '张明辉', id: 'EMP10102756', dept: '技术研发部', avatar: '张' };

const MOCK_STATS = [
  { key: 'current',  value: '12,480', color: '#2563EB', bg: '#EFF6FF', label: '当前积分' },
  { key: 'earned',   value: '8,300',  color: '#16A34A', bg: '#DCFCE7', label: '累计获得', prefix: '+' },
  { key: 'spent',    value: '+500',   color: '#D97706', bg: '#FEF3C7', label: '本月获得', prefix: '+' },
  { key: 'count',    value: '38',     color: '#7C3AED', bg: '#EDE9FE', label: '兑换次数' },
];

type TxType = 'income' | 'expense';

interface Tx {
  date: string;
  type: TxType;
  typeLabel: string;
  amount: number;
  balance: number;
  desc: string;
  operator: string;
}

const MOCK_TXS: Tx[] = [
  { date: '2026-03-05 15:22', type: 'income',  typeLabel: '绩效奖励', amount: +772,  balance: 12480, desc: '2025年Q4绩效奖励发放',                operator: '系统自动' },
  { date: '2026-02-28 11:04', type: 'expense', typeLabel: '积分兑换', amount: -2580, balance: 11708, desc: '兑换 Sony WH-1000XM5 降噪耳机',       operator: '张明辉' },
  { date: '2026-02-14 09:00', type: 'income',  typeLabel: '节日福利', amount: +500,  balance: 14288, desc: '2026年春节福利积分',                   operator: '系统自动' },
  { date: '2026-01-15 17:46', type: 'expense', typeLabel: '积分兑换', amount: -1880, balance: 13788, desc: '兑换 Apple Watch Series 9 41mm',      operator: '张明辉' },
  { date: '2025-12-31 23:59', type: 'income',  typeLabel: '年度奖励', amount: +5000, balance: 15668, desc: '2025年度优秀员工奖励',                 operator: '王管理员' },
  { date: '2025-12-01 10:00', type: 'income',  typeLabel: '工龄积分', amount: +200,  balance: 10668, desc: '工龄满3年积分奖励',                   operator: '系统自动' },
  { date: '2025-11-20 14:30', type: 'expense', typeLabel: '积分兑换', amount: -900,  balance: 10468, desc: '兑换 ZICM 积分兑换平台礼品卡',         operator: '张明辉' },
];

const TYPE_CONFIG: Record<TxType, { color: string; bg: string }> = {
  income:  { color: '#166534', bg: '#DCFCE7' },
  expense: { color: '#991B1B', bg: '#FEE2E2' },
};

const DIVIDER = '1px solid #F1F5F9';

// ── Component ──────────────────────────────────────────────────────────────

export default function UserPointsHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);

  const filtered = MOCK_TXS.filter((tx) => {
    if (tab === 1) return tx.type === 'income';
    if (tab === 2) return tx.type === 'expense';
    return true;
  });

  return (
    <Box sx={{ p: '32px', display: 'flex', flexDirection: 'column', gap: 3, bgcolor: '#F8FAFC', minHeight: '100%' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Breadcrumbs sx={{ fontSize: 13, mb: 1 }}>
            <Link component={RouterLink} to="/admin/users" underline="hover" sx={{ fontSize: 13, color: '#64748B' }}>
              {t('admin.users.title')}
            </Link>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>{t('admin.userPoints.breadcrumb')}</Typography>
          </Breadcrumbs>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>
            {MOCK_USER.name} {t('admin.userPoints.title')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button variant="outlined" size="small" startIcon={<FileDownloadIcon sx={{ fontSize: 15 }} />}
            sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 500, borderColor: '#E2E8F0', color: '#1E293B' }}>
            {t('admin.userPoints.export')}
          </Button>
          <Button variant="contained" size="small" startIcon={<TollIcon sx={{ fontSize: 15 }} />}
            sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 600, boxShadow: 'none' }}>
            {t('admin.userPoints.adjust')}
          </Button>
          <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>A</Typography>
          </Box>
        </Box>
      </Box>

      {/* Stat cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
        {MOCK_STATS.map((s) => (
          <Paper key={s.key} elevation={0} sx={{ p: '18px 20px', borderRadius: '12px', border: DIVIDER }}>
            <Typography sx={{ fontSize: 13, color: '#64748B', mb: 1 }}>{s.label}</Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Transaction table */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: DIVIDER, overflow: 'hidden' }}>
        {/* Tabs + filter row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1, borderBottom: DIVIDER }}>
          <Tabs value={tab} onChange={(_, v) => { setTab(v); setPage(1); }}
            sx={{
              minHeight: 40,
              '& .MuiTabs-indicator': { bgcolor: '#2563EB', height: 2 },
              '& .MuiTab-root': { minHeight: 40, textTransform: 'none', fontSize: 13, fontWeight: 500, color: '#64748B', px: 2, py: 0 },
              '& .Mui-selected': { color: '#2563EB', fontWeight: 600 },
            }}>
            <Tab label={t('employee.points.tabAll')} />
            <Tab label={t('employee.points.tabEarn')} />
            <Tab label={t('employee.points.tabSpend')} />
          </Tabs>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined"
              sx={{ borderRadius: '6px', textTransform: 'none', fontSize: 12, borderColor: '#E2E8F0', color: '#64748B', height: 30 }}>
              全部时间 ▾
            </Button>
            <Button size="small" variant="outlined"
              sx={{ borderRadius: '6px', textTransform: 'none', fontSize: 12, borderColor: '#E2E8F0', color: '#64748B', height: 30 }}>
              全部类型 ▾
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: '#F1F5F9' } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                {[t('admin.userPoints.colDate'), t('admin.userPoints.colType'), t('admin.userPoints.colAmount'),
                  t('admin.userPoints.colBalance'), t('admin.userPoints.colDesc'), t('admin.userPoints.colOperator')].map((col) => (
                  <TableCell key={col} sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', py: '10px', px: '20px' }}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((tx, i) => {
                const cfg = TYPE_CONFIG[tx.type];
                return (
                  <TableRow key={i} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ fontSize: 13, color: '#64748B', py: '12px', px: '20px' }}>{tx.date}</TableCell>
                    <TableCell sx={{ py: '12px', px: '20px' }}>
                      <Chip label={tx.typeLabel} size="small"
                        sx={{ fontSize: 11, fontWeight: 500, color: cfg.color, bgcolor: cfg.bg, borderRadius: '12px', height: 22 }} />
                    </TableCell>
                    <TableCell sx={{ py: '12px', px: '20px' }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: tx.type === 'income' ? '#16A34A' : '#DC2626' }}>
                        {tx.type === 'income' ? '+' : ''}{tx.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B', py: '12px', px: '20px' }}>
                      {tx.balance.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, color: '#475569', py: '12px', px: '20px' }}>{tx.desc}</TableCell>
                    <TableCell sx={{ fontSize: 13, color: '#64748B', py: '12px', px: '20px' }}>{tx.operator}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ borderColor: '#F1F5F9' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '20px', py: '12px' }}>
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            显示 1-{filtered.length} 共 {filtered.length} 条记录
          </Typography>
          <Pagination count={Math.max(1, Math.ceil(filtered.length / 10))} page={page}
            onChange={(_, v) => setPage(v)} size="small" color="primary" shape="rounded" />
        </Box>
      </Paper>

    </Box>
  );
}

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import InputAdornment from '@mui/material/InputAdornment';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import TollIcon from '@mui/icons-material/Toll';
import GroupIcon from '@mui/icons-material/Group';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useAuthStore } from '../../stores/auth.store';
import { pointsService } from '../../services/points.service';

const PAGE_SIZE = 10;

// Avatar colour derived from user id (stable)
const AVATAR_COLORS = ['#3B82F6', '#F97316', '#10B981', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B'];
function avatarColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export default function UserManagePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    adminUsers,
    adminLoading,
    adminError,
    adminPagination,
    fetchAdminUsers,
    updateUserStatus,
  } = useAuthStore();

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);

  // Adjust points dialog
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustUserId, setAdjustUserId] = useState('');
  const [adjustUserName, setAdjustUserName] = useState('');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustLoading, setAdjustLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const showToast = (message: string, severity: 'success' | 'error' = 'success') =>
    setToast({ open: true, message, severity });

  const load = useCallback(
    (p = page) => {
      fetchAdminUsers({ page: p - 1, size: PAGE_SIZE, keyword: search || undefined, role: role || undefined });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, search, role],
  );

  // Compute stats from loaded users
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [newThisMonth, setNewThisMonth] = useState<number | null>(null);

  useEffect(() => {
    if (adminUsers.length === 0 && adminLoading) return;
    // Fetch all users (up to 100) to compute stats
    (async () => {
      try {
        const allRes = await (await import('../../services/auth.service')).authService.getAdminUsers({ page: 0, size: 100 });
        const unwrap = <T,>(res: unknown): T => { const r = res as { data?: T }; return r?.data !== undefined ? r.data : res as T; };
        const data = unwrap<{ content?: { status?: string; createdAt?: string }[] }>(allRes);
        const users = data.content ?? [];
        setActiveCount(users.filter(u => u.status === 'ACTIVE').length);
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        setNewThisMonth(users.filter(u => u.createdAt && u.createdAt.slice(0, 10) >= monthStart).length);
      } catch { /* ignore */ }
    })();
  }, [adminUsers, adminLoading]);

  // Initial load
  useEffect(() => { load(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch when filters change (debounce search)
  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); load(1); }, 400);
    return () => clearTimeout(timer);
  }, [search, role]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchAdminUsers({ page: value - 1, size: PAGE_SIZE, keyword: search || undefined, role: role || undefined });
  };

  const handleToggleStatus = async (id: string, current: 'ACTIVE' | 'INACTIVE') => {
    const next = current === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateUserStatus(id, next);
      showToast(next === 'ACTIVE' ? t('admin.users.enabledSuccess') : t('admin.users.disabledSuccess'));
    } catch {
      showToast(t('admin.users.statusUpdateFailed'), 'error');
    }
  };

  const openAdjust = (id: string, name: string) => {
    setAdjustUserId(id);
    setAdjustUserName(name);
    setAdjustAmount('');
    setAdjustReason('');
    setAdjustOpen(true);
  };

  const handleAdjustSubmit = async () => {
    const amount = parseInt(adjustAmount, 10);
    if (!adjustAmount || isNaN(amount)) return;
    if (!adjustReason.trim()) return;
    setAdjustLoading(true);
    try {
      await pointsService.adminAdjustPoints(adjustUserId, amount, adjustReason.trim());
      showToast(t('admin.users.adjustSuccess'));
      setAdjustOpen(false);
      load(page);
    } catch {
      showToast(t('admin.users.adjustFailed'), 'error');
    } finally {
      setAdjustLoading(false);
    }
  };

  const handleExport = () => showToast(t('admin.users.exportComingSoon'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'text.primary' }}>
          {t('admin.users.title')}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          {t('admin.users.export')}
        </Button>
      </Box>

      {/* Stat card — total users from pagination */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5, borderRadius: 3, border: '1px solid #F1F5F9' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{t('admin.users.totalUsers')}</Typography>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GroupIcon sx={{ fontSize: 20, color: '#2563EB' }} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: 'text.primary' }}>
            {adminLoading && adminUsers.length === 0 ? '—' : adminPagination.total}
          </Typography>
        </Paper>
        {/* Active / New This Month kept as static placeholders per spec */}
        <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5, borderRadius: 3, border: '1px solid #F1F5F9' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{t('admin.users.activeUsers')}</Typography>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 20, color: '#16A34A' }} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: 'text.primary' }}>
            {activeCount != null ? activeCount : <CircularProgress size={24} />}
          </Typography>
        </Paper>
        <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5, borderRadius: 3, border: '1px solid #F1F5F9' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{t('admin.users.newThisMonth')}</Typography>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GroupIcon sx={{ fontSize: 20, color: '#D97706' }} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: 'text.primary' }}>
            {newThisMonth != null ? newThisMonth : <CircularProgress size={24} />}
          </Typography>
        </Paper>
      </Box>

      {/* Filter row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          size="small"
          placeholder={t('admin.users.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 240, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <Select
          size="small"
          displayEmpty
          value={role}
          onChange={(e: SelectChangeEvent) => setRole(e.target.value)}
          sx={{ width: 140, borderRadius: 2 }}
        >
          <MenuItem value="">{t('admin.users.allRoles')}</MenuItem>
          <MenuItem value="employee">{t('admin.users.roleEmployee')}</MenuItem>
          <MenuItem value="admin">{t('admin.users.roleAdmin')}</MenuItem>
        </Select>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', ml: 1 }}>
          {t('admin.users.total', { count: adminPagination.total })}
        </Typography>
      </Box>

      {/* Error */}
      {adminError && (
        <Alert severity="error" onClose={() => useAuthStore.setState({ adminError: null })}>
          {adminError}
        </Alert>
      )}

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #F1F5F9', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: '#F1F5F9' } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                {(['colUser', 'colDept', 'colPoints', 'colRole', 'colStatus', 'colRedemptions', 'colAction'] as const).map((col) => (
                  <TableCell key={col} sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '10px', px: '20px' }}>
                    {t(`admin.users.${col}`)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {adminLoading && adminUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : adminUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary', fontSize: 13 }}>
                    {t('admin.users.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                adminUsers.map((user) => {
                  const color = avatarColor(user.id);
                  const isActive = user.status === 'ACTIVE';
                  return (
                    <TableRow key={user.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      {/* User info */}
                      <TableCell sx={{ py: '12px', px: '20px' }}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                          onClick={() => navigate(`/admin/users/${user.id}/points`)}
                        >
                          <Box sx={{
                            width: 36, height: 36, borderRadius: '50%',
                            bgcolor: color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                              {(user.displayName || user.username).charAt(0)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>
                              {user.displayName || user.username}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{user.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      {/* Department */}
                      <TableCell sx={{ fontSize: 13, py: '12px', px: '20px', color: 'text.secondary' }}>
                        {user.department ?? '—'}
                      </TableCell>
                      {/* Points */}
                      <TableCell sx={{ fontSize: 13, fontWeight: 600, py: '12px', px: '20px', color: 'text.primary' }}>
                        {user.points.toLocaleString()}
                      </TableCell>
                      {/* Role badge */}
                      <TableCell sx={{ py: '12px', px: '20px' }}>
                        <Chip
                          label={user.role === 'EMPLOYEE' ? t('admin.users.roleEmployee') : t('admin.users.roleAdmin')}
                          size="small"
                          sx={{
                            fontSize: 11, fontWeight: 500, height: 24, borderRadius: '12px',
                            bgcolor: user.role === 'EMPLOYEE' ? '#DBEAFE' : '#EDE9FE',
                            color: user.role === 'EMPLOYEE' ? '#1E40AF' : '#5B21B6',
                          }}
                        />
                      </TableCell>
                      {/* Status badge */}
                      <TableCell sx={{ py: '12px', px: '20px' }}>
                        <Chip
                          label={isActive ? t('admin.users.statusActive') : t('admin.users.statusDisabled')}
                          size="small"
                          sx={{
                            fontSize: 11, fontWeight: 500, height: 24, borderRadius: '12px',
                            bgcolor: isActive ? '#DCFCE7' : '#FEE2E2',
                            color: isActive ? '#166534' : '#991B1B',
                          }}
                        />
                      </TableCell>
                      {/* Redemptions */}
                      <TableCell sx={{ fontSize: 13, py: '12px', px: '20px', color: 'text.secondary' }}>
                        {user.redemptionCount}
                      </TableCell>
                      {/* Actions */}
                      <TableCell sx={{ py: '12px', px: '20px' }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            title={t('admin.users.editUser')}
                            onClick={() => showToast(t('admin.users.editComingSoon'))}
                            sx={{ color: '#64748B' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            title={t('admin.users.adjustPoints')}
                            onClick={() => openAdjust(user.id, user.displayName || user.username)}
                            sx={{ color: '#64748B' }}
                          >
                            <TollIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            title={isActive ? t('admin.users.disableUser') : t('admin.users.enableUser')}
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            sx={{ color: isActive ? '#DC2626' : '#16A34A' }}
                          >
                            {isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '20px', py: '12px', borderTop: '1px solid #F1F5F9' }}>
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            {t('admin.users.showingRange', {
              from: adminUsers.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1,
              to: (page - 1) * PAGE_SIZE + adminUsers.length,
              total: adminPagination.total,
            })}
          </Typography>
          <Pagination
            count={Math.max(1, adminPagination.totalPages)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="small"
          />
        </Box>
      </Paper>

      {/* Adjust Points Dialog */}
      <Dialog open={adjustOpen} onClose={() => setAdjustOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>
          {t('admin.users.adjustPointsTitle', { name: adjustUserName })}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label={t('admin.users.adjustAmountLabel')}
            type="number"
            size="small"
            fullWidth
            value={adjustAmount}
            onChange={(e) => setAdjustAmount(e.target.value)}
            helperText={t('admin.users.adjustAmountHint')}
            InputProps={{
              startAdornment: <InputAdornment position="start">pts</InputAdornment>,
            }}
          />
          <TextField
            label={t('admin.users.adjustReasonLabel')}
            size="small"
            fullWidth
            multiline
            rows={2}
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
            placeholder={t('admin.users.adjustReasonPlaceholder')}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAdjustOpen(false)} sx={{ textTransform: 'none' }}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleAdjustSubmit}
            disabled={adjustLoading || !adjustAmount || !adjustReason.trim()}
            sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
          >
            {adjustLoading ? <CircularProgress size={16} color="inherit" /> : t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast((s) => ({ ...s, open: false }))}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

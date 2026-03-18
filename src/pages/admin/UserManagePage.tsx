import { useState } from 'react';
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
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import TollIcon from '@mui/icons-material/Toll';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { SelectChangeEvent } from '@mui/material/Select';

type UserRole = 'employee' | 'admin';
type UserStatus = 'active' | 'disabled';

interface MockUser {
  id: number;
  name: string;
  email: string;
  avatarColor: string;
  department: string;
  points: number;
  role: UserRole;
  status: UserStatus;
  redemptions: number;
}

const MOCK_USERS: MockUser[] = [
  { id: 1, name: '王芳', email: 'wangfang@company.com', avatarColor: '#3B82F6', department: '北京研发部门', points: 3880, role: 'employee', status: 'active', redemptions: 12 },
  { id: 2, name: '王建国', email: 'wangjianguo@company.com', avatarColor: '#F97316', department: '市场营销部门', points: 23, role: 'employee', status: 'disabled', redemptions: 0 },
  { id: 3, name: '李秀英', email: 'lixiuying@company.com', avatarColor: '#10B981', department: '人力资源部', points: 5120, role: 'employee', status: 'active', redemptions: 8 },
  { id: 4, name: '赵志远', email: 'zhaozhiyuan@company.com', avatarColor: '#8B5CF6', department: '财务部', points: 1450, role: 'employee', status: 'active', redemptions: 3 },
];

const STAT_CARDS = [
  { key: 'totalUsers', value: '356', change: '+5.4%', changeColor: '#16A34A', icon: GroupIcon, iconColor: '#2563EB', iconBg: '#EFF6FF' },
  { key: 'activeUsers', value: '218', change: '+8.2%', changeColor: '#16A34A', icon: CheckCircleOutlineIcon, iconColor: '#16A34A', iconBg: '#DCFCE7' },
  { key: 'newThisMonth', value: '12', change: '+3人', changeColor: '#16A34A', icon: PersonAddIcon, iconColor: '#D97706', iconBg: '#FEF3C7' },
];

export default function UserManagePage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = !search || u.name.includes(search) || u.email.includes(search);
    const matchRole = !role || u.role === role;
    return matchSearch && matchRole;
  });

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
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          {t('admin.users.export')}
        </Button>
      </Box>

      {/* Stat cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {STAT_CARDS.map((card) => {
          const IconComp = card.icon;
          return (
            <Paper
              key={card.key}
              elevation={0}
              sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5, borderRadius: 3, border: '1px solid #F1F5F9' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  {t(`admin.users.${card.key}`)}
                </Typography>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComp sx={{ fontSize: 20, color: card.iconColor }} />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: 'text.primary' }}>
                {card.value}
              </Typography>
              <Typography sx={{ fontSize: 12, color: card.changeColor }}>
                {card.change}
              </Typography>
            </Paper>
          );
        })}
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
          {t('admin.users.total', { count: filtered.length })}
        </Typography>
      </Box>

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
              {filtered.map((user) => (
                <TableRow key={user.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  {/* User info */}
                  <TableCell sx={{ py: '12px', px: '20px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: 36, height: 36, borderRadius: '50%',
                        bgcolor: user.avatarColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                          {user.name.charAt(0)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>{user.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{user.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  {/* Department */}
                  <TableCell sx={{ fontSize: 13, py: '12px', px: '20px', color: 'text.secondary' }}>
                    {user.department}
                  </TableCell>
                  {/* Points */}
                  <TableCell sx={{ fontSize: 13, fontWeight: 600, py: '12px', px: '20px', color: 'text.primary' }}>
                    {user.points.toLocaleString()}
                  </TableCell>
                  {/* Role badge */}
                  <TableCell sx={{ py: '12px', px: '20px' }}>
                    <Chip
                      label={user.role === 'employee' ? t('admin.users.roleEmployee') : t('admin.users.roleAdmin')}
                      size="small"
                      sx={{
                        fontSize: 11, fontWeight: 500, height: 24, borderRadius: '12px',
                        bgcolor: user.role === 'employee' ? '#DBEAFE' : '#EDE9FE',
                        color: user.role === 'employee' ? '#1E40AF' : '#5B21B6',
                      }}
                    />
                  </TableCell>
                  {/* Status badge */}
                  <TableCell sx={{ py: '12px', px: '20px' }}>
                    <Chip
                      label={user.status === 'active' ? t('admin.users.statusActive') : t('admin.users.statusDisabled')}
                      size="small"
                      sx={{
                        fontSize: 11, fontWeight: 500, height: 24, borderRadius: '12px',
                        bgcolor: user.status === 'active' ? '#DCFCE7' : '#FEE2E2',
                        color: user.status === 'active' ? '#166534' : '#991B1B',
                      }}
                    />
                  </TableCell>
                  {/* Redemptions */}
                  <TableCell sx={{ fontSize: 13, py: '12px', px: '20px', color: 'text.secondary' }}>
                    {user.redemptions}
                  </TableCell>
                  {/* Actions */}
                  <TableCell sx={{ py: '12px', px: '20px' }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" title={t('admin.users.editUser')} sx={{ color: '#64748B' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" title={t('admin.users.adjustPoints')} sx={{ color: '#64748B' }}>
                        <TollIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination inside card */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '20px', py: '12px', borderTop: '1px solid #F1F5F9' }}>
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            显示 1-{filtered.length} 共 {MOCK_USERS.length} 名员工
          </Typography>
          <Pagination
            count={Math.max(1, Math.ceil(MOCK_USERS.length / 10))}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
            shape="rounded"
            size="small"
          />
        </Box>
      </Paper>
    </Box>
  );
}

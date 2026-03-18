import { Outlet, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import RedeemIcon from '@mui/icons-material/Redeem';
import SearchIcon from '@mui/icons-material/Search';
import TollIcon from '@mui/icons-material/Toll';
import { useAuthStore } from '../../stores/auth.store';
import AvatarMenu from './AvatarMenu';

const NAV_ITEMS = [
  { key: 'home', path: '/' },
  { key: 'orders', path: '/orders' },
  { key: 'points', path: '/points' },
];

export default function EmployeeLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Box
        component="header"
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 64, px: 4, bgcolor: '#fff',
          borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <RedeemIcon sx={{ fontSize: 28, color: 'primary.main' }} />
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: 'primary.main' }}>AWSome Shop</Typography>
          </Box>
          <Box component="nav" sx={{ display: 'flex', gap: 1 }}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.key}
                  size="small"
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2, px: 2, py: 1, fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#2563EB' : 'text.secondary',
                    bgcolor: isActive ? '#EFF6FF' : 'transparent',
                    textTransform: 'none',
                    '&:hover': { bgcolor: isActive ? '#EFF6FF' : 'action.hover' },
                  }}
                >
                  {t(`employee.nav.${item.key}`)}
                </Button>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex', alignItems: 'center', width: 360, height: 40,
              border: '1px solid', borderColor: 'divider', borderRadius: '8px',
              bgcolor: '#fff', padding: '0 4px 0 14px', gap: '8px',
            }}
          >
            <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <InputBase
              placeholder={t('employee.searchPlaceholder')}
              sx={{ flex: 1, fontSize: 13 }}
              inputProps={{ 'aria-label': t('employee.searchPlaceholder') }}
            />
            <Button
              variant="contained"
              size="small"
              sx={{ borderRadius: '4px', height: 32, px: '16px', fontSize: 13, fontWeight: 500, textTransform: 'none', minWidth: 'auto' }}
            >
              {t('employee.search')}
            </Button>
          </Box>
          <Chip
            icon={<TollIcon sx={{ fontSize: 18, color: '#D97706 !important' }} />}
            label={`${(user?.points ?? 0).toLocaleString()} ${t('employee.pointsUnit')}`}
            sx={{ bgcolor: '#FFFBEB', color: '#D97706', fontWeight: 600, fontSize: 13, borderRadius: 20, '& .MuiChip-icon': { ml: 1 } }}
          />
          <AvatarMenu />
        </Box>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  );
}

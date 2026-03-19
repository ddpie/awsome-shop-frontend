import { useEffect, useState, useRef, useCallback } from 'react';
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
import { usePointsStore } from '../../stores/points.store';
import { useProductStore } from '../../stores/product.store';
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
  const balance = usePointsStore((s) => s.balance);
  const fetchBalance = usePointsStore((s) => s.fetchBalance);
  const { searchKeyword, setSearchKeyword, fetchProducts } = useProductStore();

  const [localSearch, setLocalSearch] = useState(searchKeyword);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Sync local input when store keyword is cleared externally
  useEffect(() => {
    setLocalSearch(searchKeyword);
  }, [searchKeyword]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchKeyword(value);
      // If on home page, trigger product fetch immediately
      if (location.pathname === '/') {
        fetchProducts({ page: 0, size: 20, keyword: value || undefined });
      }
    }, 400);
  }, [setSearchKeyword, fetchProducts, location.pathname]);

  const handleSearchSubmit = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchKeyword(localSearch);
    // Navigate to home if not already there, then fetch
    if (location.pathname !== '/') {
      navigate('/');
    }
    fetchProducts({ page: 0, size: 20, keyword: localSearch || undefined });
  }, [localSearch, setSearchKeyword, fetchProducts, location.pathname, navigate]);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearchSubmit();
  }, [handleSearchSubmit]);

  const displayPoints = balance?.current ?? 0;

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
              value={localSearch}
              onChange={handleSearchInput}
              onKeyDown={handleSearchKeyDown}
              placeholder={t('employee.searchPlaceholder')}
              sx={{ flex: 1, fontSize: 13 }}
              inputProps={{ 'aria-label': t('employee.searchPlaceholder') }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleSearchSubmit}
              sx={{ borderRadius: '4px', height: 32, px: '16px', fontSize: 13, fontWeight: 500, textTransform: 'none', minWidth: 'auto' }}
            >
              {t('employee.search')}
            </Button>
          </Box>
          <Chip
            icon={<TollIcon sx={{ fontSize: 18, color: '#D97706 !important' }} />}
            label={`${displayPoints.toLocaleString()} ${t('employee.pointsUnit')}`}
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

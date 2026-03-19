import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import InputBase from '@mui/material/InputBase';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useProductStore } from '../../stores/product.store';

const PAGE_SIZE = 8;
const DIVIDER = '1px solid #F1F5F9';

export default function ProductManagePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    adminProducts,
    adminLoading,
    adminError,
    adminPagination,
    fetchAdminProducts,
    deleteAdminProduct,
    fetchCategories,
    categories,
  } = useProductStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch categories for filter dropdown
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const doFetch = useCallback(
    (keyword: string, cat: string, st: string, pg: number) => {
      fetchAdminProducts({
        page: pg,
        size: PAGE_SIZE,
        keyword: keyword || undefined,
        category: cat || undefined,
        status: st || undefined,
      });
    },
    [fetchAdminProducts],
  );

  // Initial fetch
  useEffect(() => {
    doFetch(search, category, status, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doFetch(value, category, status, 0);
    }, 400);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(0);
    doFetch(search, value, status, 0);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(0);
    doFetch(search, category, value, 0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    doFetch(search, category, status, newPage);
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(t('admin.products.confirmDelete', { name }))) {
      await deleteAdminProduct(String(id));
    }
  };

  const totalPages = adminPagination.totalPages || 1;
  const totalElements = adminPagination.totalElements || 0;
  const from = page * PAGE_SIZE + 1;
  const to = Math.min((page + 1) * PAGE_SIZE, totalElements);

  // Top-level categories for filter
  const topCategories = categories.filter((c) => !c.parentId);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: '32px', height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>
          {t('admin.products.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/products/new/edit')}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: 14, px: '20px', py: '10px' }}
        >
          {t('admin.products.addProduct')}
        </Button>
      </Box>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1, px: '12px', height: 40, width: 280,
          border: DIVIDER, borderRadius: '8px', bgcolor: '#fff',
        }}>
          <SearchIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <InputBase
            placeholder={t('admin.products.search')}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{ fontSize: 13, flex: 1, color: '#1E293B', '& input::placeholder': { color: '#94A3B8' } }}
          />
        </Box>
        <Select
          size="small"
          displayEmpty
          value={category}
          onChange={(e: SelectChangeEvent) => handleCategoryChange(e.target.value)}
          sx={{ height: 40, borderRadius: '8px', fontSize: 13, minWidth: 140, bgcolor: '#fff' }}
        >
          <MenuItem value="">{t('admin.products.allCategories')}</MenuItem>
          {topCategories.map((c) => (
            <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
          ))}
        </Select>
        <Select
          size="small"
          displayEmpty
          value={status}
          onChange={(e: SelectChangeEvent) => handleStatusChange(e.target.value)}
          sx={{ height: 40, borderRadius: '8px', fontSize: 13, minWidth: 120, bgcolor: '#fff' }}
        >
          <MenuItem value="">{t('admin.products.allStatus')}</MenuItem>
          <MenuItem value="ACTIVE">{t('admin.products.active')}</MenuItem>
          <MenuItem value="INACTIVE">{t('admin.products.inactive')}</MenuItem>
        </Select>
        <Typography sx={{ fontSize: 13, color: '#64748B' }}>
          {t('admin.products.total', { count: totalElements })}
        </Typography>
      </Box>

      {/* Error */}
      {adminError && (
        <Alert severity="error" onClose={() => useProductStore.getState().clearAdminError()}>
          {adminError}
        </Alert>
      )}

      {/* Loading overlay / grid */}
      <Box sx={{ position: 'relative', flex: 1 }}>
        {adminLoading && (
          <Box sx={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.7)', borderRadius: '8px',
          }}>
            <CircularProgress size={40} />
          </Box>
        )}

        {/* Product grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {adminProducts.map((product) => {
            const isActive = product.status === 'ACTIVE' || product.status === 'active';
            return (
              <Paper
                key={product.id}
                elevation={0}
                sx={{ borderRadius: '12px', border: DIVIDER, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                {/* Image area */}
                <Box
                  onClick={() => navigate(`/admin/products/${product.id}`)}
                  sx={{
                    height: 140, bgcolor: '#F1F5F9', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    '&:hover': { opacity: 0.9 }, overflow: 'hidden',
                  }}
                >
                  {product.imageUrl ? (
                    <Box
                      component="img"
                      src={product.imageUrl}
                      alt={product.name}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <ImageIcon sx={{ fontSize: 48, color: '#CBD5E1' }} />
                  )}
                </Box>

                {/* Card body */}
                <Box sx={{ p: '16px 16px 12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                  <Typography
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                    sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B', lineHeight: 1.4, cursor: 'pointer', '&:hover': { color: '#2563EB' } }}
                  >
                    {product.name}
                  </Typography>
                  {/* Tags row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {product.categoryName && (
                      <Chip
                        label={product.categoryName}
                        size="small"
                        sx={{ fontSize: 11, fontWeight: 500, height: 20, borderRadius: '10px', bgcolor: '#EFF6FF', color: '#2563EB' }}
                      />
                    )}
                    <Chip
                      label={isActive ? t('admin.products.active') : t('admin.products.inactive')}
                      size="small"
                      sx={{
                        fontSize: 11, fontWeight: 500, height: 20, borderRadius: '10px',
                        bgcolor: isActive ? '#DCFCE7' : '#F1F5F9',
                        color: isActive ? '#166534' : '#64748B',
                      }}
                    />
                  </Box>
                  {/* Price row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#D97706' }}>
                      {product.pointsCost.toLocaleString()} {t('employee.pointsUnit')}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#64748B' }}>
                      {t('admin.products.stock')} {product.stock}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', px: '12px', pb: '12px' }}>
                  <Box
                    onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                    sx={{ display: 'flex', alignItems: 'center', gap: '4px', px: '10px', py: '6px', borderRadius: '6px', cursor: 'pointer', '&:hover': { bgcolor: '#F8FAFC' } }}
                  >
                    <EditIcon sx={{ fontSize: 16, color: '#64748B' }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>{t('admin.products.edit')}</Typography>
                  </Box>
                  <Box
                    onClick={() => handleDelete(product.id, product.name)}
                    sx={{ display: 'flex', alignItems: 'center', gap: '4px', px: '10px', py: '6px', borderRadius: '6px', cursor: 'pointer', '&:hover': { bgcolor: '#FEF2F2' } }}
                  >
                    <DeleteIcon sx={{ fontSize: 16, color: '#EF4444' }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#EF4444' }}>{t('admin.products.delete')}</Typography>
                  </Box>
                </Box>
              </Paper>
            );
          })}

          {/* Empty state */}
          {!adminLoading && adminProducts.length === 0 && (
            <Box sx={{ gridColumn: '1 / -1', py: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: 14, color: '#94A3B8' }}>
                {t('admin.products.noData', '暂无商品数据')}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: '8px' }}>
        <Typography sx={{ fontSize: 13, color: '#64748B' }}>
          {t('admin.products.showingRange', { from: totalElements ? from : 0, to, total: totalElements })}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Box
            onClick={() => page > 0 && handlePageChange(page - 1)}
            sx={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px', border: DIVIDER, bgcolor: '#fff',
              cursor: page > 0 ? 'pointer' : 'default',
              opacity: page > 0 ? 1 : 0.4,
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 18, color: '#64748B' }} />
          </Box>
          {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
            <Box
              key={p}
              onClick={() => handlePageChange(p)}
              sx={{
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '6px', cursor: 'pointer',
                bgcolor: p === page ? '#2563EB' : '#fff',
                border: p === page ? 'none' : DIVIDER,
                color: p === page ? '#fff' : '#64748B',
                fontSize: 13, fontWeight: p === page ? 600 : 400,
              }}
            >
              {p + 1}
            </Box>
          ))}
          <Box
            onClick={() => page < totalPages - 1 && handlePageChange(page + 1)}
            sx={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px', border: DIVIDER, bgcolor: '#fff',
              cursor: page < totalPages - 1 ? 'pointer' : 'default',
              opacity: page < totalPages - 1 ? 1 : 0.4,
            }}
          >
            <ChevronRightIcon sx={{ fontSize: 18, color: '#64748B' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

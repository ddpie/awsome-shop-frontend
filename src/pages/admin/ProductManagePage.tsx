import { useState } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import RedeemIcon from '@mui/icons-material/Redeem';
import BackpackIcon from '@mui/icons-material/Backpack';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SpeakerIcon from '@mui/icons-material/Speaker';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import SpaIcon from '@mui/icons-material/Spa';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { SvgIconComponent } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material/Select';

interface MockProduct {
  id: number;
  name: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  points: number;
  stock: number;
  status: 'active' | 'inactive';
  iconColor: string;
  iconBg: string;
  icon: SvgIconComponent;
}

const MOCK_PRODUCTS: MockProduct[] = [
  { id: 1, name: 'Sony WH-1000XM5 降噪耳机', category: '数码电子', categoryColor: '#2563EB', categoryBg: '#EFF6FF', points: 2580, stock: 45, status: 'active', iconColor: '#2563EB', iconBg: '#DBEAFE', icon: HeadphonesIcon },
  { id: 2, name: 'Apple Watch Series 9', category: '数码电子', categoryColor: '#2563EB', categoryBg: '#EFF6FF', points: 2200, stock: 18, status: 'active', iconColor: '#7C3AED', iconBg: '#EDE9FE', icon: WatchIcon },
  { id: 3, name: '星巴克 200元礼品卡', category: '礼品卡券', categoryColor: '#D97706', categoryBg: '#FEF3C7', points: 680, stock: 234, status: 'active', iconColor: '#16A34A', iconBg: '#DCFCE7', icon: RedeemIcon },
  { id: 4, name: '小米城市通勤双肩包', category: '生活家居', categoryColor: '#16A34A', categoryBg: '#DCFCE7', points: 450, stock: 67, status: 'active', iconColor: '#D97706', iconBg: '#FEF3C7', icon: BackpackIcon },
  { id: 5, name: '罗技 MX Keys 无线键盘', category: '数码电子', categoryColor: '#2563EB', categoryBg: '#EFF6FF', points: 860, stock: 29, status: 'active', iconColor: '#2563EB', iconBg: '#DBEAFE', icon: KeyboardIcon },
  { id: 6, name: 'Bose SoundLink 蓝牙音箱', category: '数码电子', categoryColor: '#2563EB', categoryBg: '#EFF6FF', points: 1200, stock: 12, status: 'inactive', iconColor: '#7C3AED', iconBg: '#EDE9FE', icon: SpeakerIcon },
  { id: 7, name: '京东 100元购物卡', category: '礼品卡券', categoryColor: '#D97706', categoryBg: '#FEF3C7', points: 320, stock: 163, status: 'active', iconColor: '#16A34A', iconBg: '#DCFCE7', icon: LocalMallIcon },
  { id: 8, name: '飞利浦电动牙刷 HX6856', category: '生活家居', categoryColor: '#16A34A', categoryBg: '#DCFCE7', points: 520, stock: 74, status: 'inactive', iconColor: '#DB2777', iconBg: '#FCE7F3', icon: SpaIcon },
];

const CATEGORIES = ['数码电子', '礼品卡券', '生活家居', '餐饮美食'];
const PAGE_SIZE = 8;
const DIVIDER = '1px solid #F1F5F9';

export default function ProductManagePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || p.category === category;
    const matchStatus = !status || p.status === status;
    return matchSearch && matchCategory && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (_id: number, name: string) => {
    if (window.confirm(t('admin.products.confirmDelete', { name }))) {
      // mock delete
    }
  };

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
            onChange={(e) => setSearch(e.target.value)}
            sx={{ fontSize: 13, flex: 1, color: '#1E293B', '& input::placeholder': { color: '#94A3B8' } }}
          />
        </Box>
        <Select
          size="small"
          displayEmpty
          value={category}
          onChange={(e: SelectChangeEvent) => { setCategory(e.target.value); setPage(1); }}
          sx={{ height: 40, borderRadius: '8px', fontSize: 13, minWidth: 140, bgcolor: '#fff' }}
        >
          <MenuItem value="">{t('admin.products.allCategories')}</MenuItem>
          {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
        <Select
          size="small"
          displayEmpty
          value={status}
          onChange={(e: SelectChangeEvent) => { setStatus(e.target.value); setPage(1); }}
          sx={{ height: 40, borderRadius: '8px', fontSize: 13, minWidth: 120, bgcolor: '#fff' }}
        >
          <MenuItem value="">{t('admin.products.allStatus')}</MenuItem>
          <MenuItem value="active">{t('admin.products.active')}</MenuItem>
          <MenuItem value="inactive">{t('admin.products.inactive')}</MenuItem>
        </Select>
        <Typography sx={{ fontSize: 13, color: '#64748B' }}>
          {t('admin.products.total', { count: filtered.length })}
        </Typography>
      </Box>

      {/* Product grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', flex: 1 }}>
        {paged.map((product) => {
          const IconComp = product.icon;
          return (
            <Paper
              key={product.id}
              elevation={0}
              sx={{ borderRadius: '12px', border: DIVIDER, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Image area - clickable, navigates to detail */}
              <Box
                onClick={() => navigate(`/admin/products/${product.id}`)}
                sx={{
                  height: 140, bgcolor: product.iconBg, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  '&:hover': { opacity: 0.9 },
                }}>
                <IconComp sx={{ fontSize: 48, color: product.iconColor }} />
              </Box>

              {/* Card body */}
              <Box sx={{ p: '16px 16px 12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                <Typography
                  onClick={() => navigate(`/admin/products/${product.id}`)}
                  sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B', lineHeight: 1.4, cursor: 'pointer', '&:hover': { color: '#2563EB' } }}>
                  {product.name}
                </Typography>
                {/* Tags row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{ fontSize: 11, fontWeight: 500, height: 20, borderRadius: '10px', bgcolor: product.categoryBg, color: product.categoryColor }}
                  />
                  <Chip
                    label={product.status === 'active' ? t('admin.products.active') : t('admin.products.inactive')}
                    size="small"
                    sx={{
                      fontSize: 11, fontWeight: 500, height: 20, borderRadius: '10px',
                      bgcolor: product.status === 'active' ? '#DCFCE7' : '#F1F5F9',
                      color: product.status === 'active' ? '#166534' : '#64748B',
                    }}
                  />
                </Box>
                {/* Price row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#D97706' }}>
                    {product.points.toLocaleString()} {t('employee.pointsUnit')}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#64748B' }}>
                    {t('admin.products.stock')} {product.stock}
                  </Typography>
                </Box>
              </Box>

              {/* Actions - text buttons bottom right */}
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
      </Box>

      {/* Pagination - left text + right page buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: '8px' }}>
        <Typography sx={{ fontSize: 13, color: '#64748B' }}>
          显示 {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} 共 128 件产品
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Box
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: DIVIDER, bgcolor: '#fff', cursor: 'pointer' }}
          >
            <ChevronLeftIcon sx={{ fontSize: 18, color: '#64748B' }} />
          </Box>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Box
              key={p}
              onClick={() => setPage(p)}
              sx={{
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '6px', cursor: 'pointer',
                bgcolor: p === page ? '#2563EB' : '#fff',
                border: p === page ? 'none' : DIVIDER,
                color: p === page ? '#fff' : '#64748B',
                fontSize: 13, fontWeight: p === page ? 600 : 400,
              }}
            >
              {p}
            </Box>
          ))}
          <Box
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: DIVIDER, bgcolor: '#fff', cursor: 'pointer' }}
          >
            <ChevronRightIcon sx={{ fontSize: 18, color: '#64748B' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

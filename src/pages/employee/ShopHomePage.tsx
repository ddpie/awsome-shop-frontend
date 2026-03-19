import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TollIcon from '@mui/icons-material/Toll';
import ImageIcon from '@mui/icons-material/Image';
import { useProductStore } from '../../stores/product.store';

export default function ShopHomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts } = useProductStore();
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    fetchProducts({ page: 0, size: 20 });
  }, [fetchProducts]);

  // Derive unique categories from loaded products
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const cats: { key: string; label: string }[] = [];
    for (const p of products) {
      if (p.categoryName && !seen.has(p.categoryName)) {
        seen.add(p.categoryName);
        cats.push({ key: p.categoryName, label: p.categoryName });
      }
    }
    return cats;
  }, [products]);

  const handleCategoryClick = (key: string) => {
    const next = key === activeCategory ? '' : key;
    setActiveCategory(next);
    fetchProducts({ page: 0, size: 20, category: next || undefined });
  };

  const filteredProducts = activeCategory
    ? products.filter((p) => p.categoryName === activeCategory)
    : products;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: '24px 32px' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 160,
          borderRadius: '12px',
          px: '40px',
          background: 'linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
            {t('employee.heroTitle')}
          </Typography>
          <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            {t('employee.heroSubtitle')}
          </Typography>
          <Button
            size="small"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              bgcolor: '#fff',
              color: '#2563EB',
              borderRadius: '20px',
              px: '20px',
              py: '8px',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'none',
              alignSelf: 'flex-start',
              '&:hover': { bgcolor: '#f0f0f0' },
            }}
          >
            {t('employee.heroBrowse')}
          </Button>
        </Box>
        <ShoppingBagIcon sx={{ fontSize: 100, color: 'rgba(255,255,255,0.2)' }} />
      </Box>

      {/* Category Filter */}
      <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Chip
          label={t('employee.category.all')}
          onClick={() => handleCategoryClick('')}
          sx={{
            borderRadius: '20px',
            fontSize: 13,
            fontWeight: activeCategory === '' ? 600 : 400,
            color: activeCategory === '' ? '#fff' : '#64748B',
            bgcolor: activeCategory === '' ? '#2563EB' : '#fff',
            border: activeCategory === '' ? 'none' : '1px solid #E2E8F0',
            height: 'auto',
            py: '8px',
            px: '18px',
            '& .MuiChip-label': { p: 0 },
            '&:hover': { bgcolor: activeCategory === '' ? '#2563EB' : '#F8FAFC' },
          }}
        />
        {categories.map((cat) => (
          <Chip
            key={cat.key}
            label={cat.label}
            onClick={() => handleCategoryClick(cat.key)}
            sx={{
              borderRadius: '20px',
              fontSize: 13,
              fontWeight: activeCategory === cat.key ? 600 : 400,
              color: activeCategory === cat.key ? '#fff' : '#64748B',
              bgcolor: activeCategory === cat.key ? '#2563EB' : '#fff',
              border: activeCategory === cat.key ? 'none' : '1px solid #E2E8F0',
              height: 'auto',
              py: '8px',
              px: '18px',
              '& .MuiChip-label': { p: 0 },
              '&:hover': { bgcolor: activeCategory === cat.key ? '#2563EB' : '#F8FAFC' },
            }}
          />
        ))}
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error state */}
      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      {/* Product Grid */}
      {!loading && !error && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              sx={{
                borderRadius: '12px',
                border: '1px solid #F1F5F9',
                boxShadow: 'none',
                cursor: 'pointer',
                overflow: 'hidden',
                '&:hover': { boxShadow: 2 },
              }}
            >
              {/* Product image / placeholder */}
              <Box
                sx={{
                  position: 'relative',
                  height: 200,
                  bgcolor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
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
                  <ImageIcon sx={{ fontSize: 64, color: '#CBD5E1' }} />
                )}
              </Box>

              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px', p: '16px', '&:last-child': { pb: '16px' } }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.name}
                </Typography>
                {product.categoryName && (
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {product.categoryName}
                  </Typography>
                )}
                {product.rating != null && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Rating
                      value={product.rating}
                      precision={0.5}
                      size="small"
                      readOnly
                      sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' }, '& .MuiRating-iconEmpty': { color: '#E2E8F0' }, fontSize: 14 }}
                    />
                    <Typography sx={{ fontSize: 11, color: '#64748B' }}>
                      {product.rating} ({product.reviewCount ?? 0})
                    </Typography>
                    {product.soldCount != null && (
                      <Typography sx={{ fontSize: 11, color: '#CBD5E1' }}>
                        · {t('employee.sold')} {product.soldCount} {t('employee.soldUnit')}
                      </Typography>
                    )}
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TollIcon sx={{ fontSize: 18, color: '#D97706' }} />
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#D97706' }}>
                      {product.pointsCost.toLocaleString()}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => { e.stopPropagation(); navigate(`/orders/confirm/${product.id}`); }}
                    sx={{ borderRadius: '8px', px: '14px', py: '6px', fontSize: 13, fontWeight: 600, textTransform: 'none', minWidth: 'auto' }}
                  >
                    {t('employee.redeem')}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}

          {filteredProducts.length === 0 && (
            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 6 }}>
              <Typography sx={{ color: '#94A3B8', fontSize: 14 }}>
                {t('employee.noProducts', 'No products found')}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

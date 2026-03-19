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
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TollIcon from '@mui/icons-material/Toll';
import ImageIcon from '@mui/icons-material/Image';
import { useProductStore } from '../../stores/product.store';

export default function ShopHomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { products, categories: storeCategories, loading, error, fetchProducts, fetchCategories, searchKeyword } = useProductStore();
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts({ page: 0, size: 20, keyword: searchKeyword || undefined });
    fetchCategories();
  }, [fetchProducts, fetchCategories, searchKeyword]);

  // Derive top-level and sub-categories from store
  const topCategories = useMemo(
    () => storeCategories.filter((c) => !c.parentId),
    [storeCategories],
  );

  const subCategories = useMemo(
    () => (selectedParent ? storeCategories.filter((c) => c.parentId === selectedParent) : []),
    [storeCategories, selectedParent],
  );

  // Find parent/sub category objects for breadcrumb
  const selectedParentCategory = useMemo(
    () => (selectedParent ? storeCategories.find((c) => c.id === selectedParent) : undefined),
    [storeCategories, selectedParent],
  );

  const selectedSubCategory = useMemo(
    () => (selectedSub ? storeCategories.find((c) => c.id === selectedSub) : undefined),
    [storeCategories, selectedSub],
  );

  const handleAllClick = () => {
    setActiveCategory('');
    setSelectedParent(null);
    setSelectedSub(null);
    fetchProducts({ page: 0, size: 20, keyword: searchKeyword || undefined });
  };

  const handleTopCategoryClick = (catId: number, catName: string) => {
    if (selectedParent === catId && !selectedSub) {
      handleAllClick();
      return;
    }
    setSelectedParent(catId);
    setSelectedSub(null);
    setActiveCategory(catName);
    fetchProducts({ page: 0, size: 20, category: catName, keyword: searchKeyword || undefined });
  };

  const handleSubCategoryClick = (catId: number, catName: string) => {
    if (selectedSub === catId) {
      setSelectedSub(null);
      const parentName = selectedParentCategory?.name || '';
      setActiveCategory(parentName);
      fetchProducts({ page: 0, size: 20, category: parentName || undefined, keyword: searchKeyword || undefined });
      return;
    }
    setSelectedSub(catId);
    setActiveCategory(catName);
    fetchProducts({ page: 0, size: 20, category: catName, keyword: searchKeyword || undefined });
  };

  const handleBreadcrumbHomeClick = () => {
    handleAllClick();
  };

  const handleBreadcrumbParentClick = () => {
    if (selectedParentCategory) {
      setSelectedSub(null);
      setActiveCategory(selectedParentCategory.name);
      fetchProducts({ page: 0, size: 20, category: selectedParentCategory.name, keyword: searchKeyword || undefined });
    }
  };

  const filteredProducts = activeCategory
    ? products.filter((p) => p.categoryName === activeCategory)
    : products;

  const isTopActive = (catId: number) => selectedParent === catId;
  const isSubActive = (catId: number) => selectedSub === catId;

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

      {/* Breadcrumb Navigation */}
      {selectedParent && (
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 16, color: '#94A3B8' }} />}
          sx={{ '& .MuiBreadcrumbs-li': { lineHeight: 1 } }}
        >
          <Link
            component="button"
            underline="hover"
            onClick={handleBreadcrumbHomeClick}
            sx={{ fontSize: 13, color: '#64748B', cursor: 'pointer' }}
          >
            {t('employee.productDetail.breadcrumbHome')}
          </Link>
          {selectedSub && selectedParentCategory ? (
            <Link
              component="button"
              underline="hover"
              onClick={handleBreadcrumbParentClick}
              sx={{ fontSize: 13, color: '#64748B', cursor: 'pointer' }}
            >
              {selectedParentCategory.name}
            </Link>
          ) : (
            <Typography sx={{ fontSize: 13, color: '#1E293B', fontWeight: 600 }}>
              {selectedParentCategory?.name}
            </Typography>
          )}
          {selectedSub && selectedSubCategory && (
            <Typography sx={{ fontSize: 13, color: '#1E293B', fontWeight: 600 }}>
              {selectedSubCategory.name}
            </Typography>
          )}
        </Breadcrumbs>
      )}

      {/* Top-level Category Filter */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Chip
            label={t('employee.category.all')}
            onClick={handleAllClick}
            sx={{
              borderRadius: '20px',
              fontSize: 13,
              fontWeight: !selectedParent ? 600 : 400,
              color: !selectedParent ? '#fff' : '#64748B',
              bgcolor: !selectedParent ? '#2563EB' : '#fff',
              border: !selectedParent ? 'none' : '1px solid #E2E8F0',
              height: 'auto',
              py: '8px',
              px: '18px',
              '& .MuiChip-label': { p: 0 },
              '&:hover': { bgcolor: !selectedParent ? '#2563EB' : '#F8FAFC' },
            }}
          />
          {topCategories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              onClick={() => handleTopCategoryClick(cat.id, cat.name)}
              sx={{
                borderRadius: '20px',
                fontSize: 13,
                fontWeight: isTopActive(cat.id) ? 600 : 400,
                color: isTopActive(cat.id) ? '#fff' : '#64748B',
                bgcolor: isTopActive(cat.id) ? '#2563EB' : '#fff',
                border: isTopActive(cat.id) ? 'none' : '1px solid #E2E8F0',
                height: 'auto',
                py: '8px',
                px: '18px',
                '& .MuiChip-label': { p: 0 },
                '&:hover': { bgcolor: isTopActive(cat.id) ? '#2563EB' : '#F8FAFC' },
              }}
            />
          ))}
        </Box>

        {/* Sub-category chips */}
        {subCategories.length > 0 && (
          <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', pl: '4px' }}>
            {subCategories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                onClick={() => handleSubCategoryClick(cat.id, cat.name)}
                sx={{
                  borderRadius: '20px',
                  fontSize: 12,
                  fontWeight: isSubActive(cat.id) ? 600 : 400,
                  color: isSubActive(cat.id) ? '#fff' : '#64748B',
                  bgcolor: isSubActive(cat.id) ? '#2563EB' : '#fff',
                  border: isSubActive(cat.id) ? 'none' : '1px solid #E2E8F0',
                  height: 'auto',
                  py: '6px',
                  px: '14px',
                  '& .MuiChip-label': { p: 0 },
                  '&:hover': { bgcolor: isSubActive(cat.id) ? '#2563EB' : '#F8FAFC' },
                }}
              />
            ))}
          </Box>
        )}
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

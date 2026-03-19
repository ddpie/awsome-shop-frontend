import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import TollIcon from '@mui/icons-material/Toll';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import { useProductStore } from '../../stores/product.store';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { currentProduct: product, relatedProducts, loading, error, fetchProductById, fetchRelatedProducts } = useProductStore();

  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchProductById(id);
  }, [id, fetchProductById]);

  useEffect(() => {
    if (!product || !id) return;
    if (product.categoryName) {
      fetchRelatedProducts(product.categoryName, id);
    }
  }, [product, id, fetchRelatedProducts]);

  // Reset qty when product changes
  useEffect(() => {
    setQty(1);
    setActiveThumb(0);
  }, [id]);

  const handleRedeem = () => {
    if (!product) return;
    navigate(`/orders/confirm/${product.id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ p: '24px 48px' }}>
        <Alert severity="error" sx={{ borderRadius: '8px' }}>
          {error ?? t('employee.productDetail.notFound', 'Product not found')}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: '24px 48px', display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ fontSize: 13 }}>
        <Link component={RouterLink} to="/" underline="hover" sx={{ fontSize: 13, color: '#64748B' }}>
          {t('employee.productDetail.breadcrumbHome')}
        </Link>
        {product.categoryName && (
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            sx={{ fontSize: 13, color: '#64748B' }}
          >
            {product.categoryName}
          </Link>
        )}
        <Typography sx={{ fontSize: 13, color: '#1E293B' }}>{product.name}</Typography>
      </Breadcrumbs>

      {/* Main content: left image + right info */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 5 }}>

        {/* ── Left: image area ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Main image */}
          <Box
            sx={{
              position: 'relative',
              height: 360,
              borderRadius: '12px',
              bgcolor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #F1F5F9',
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
              <ImageIcon sx={{ fontSize: 120, color: '#CBD5E1' }} />
            )}
          </Box>

          {/* Thumbnails — show same image in all slots */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {[0, 1, 2, 3].map((i) => (
              <Box
                key={i}
                onClick={() => setActiveThumb(i)}
                sx={{
                  width: 72, height: 72, borderRadius: '8px',
                  bgcolor: '#F1F5F9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  border: activeThumb === i ? '2px solid #2563EB' : '2px solid transparent',
                  outline: activeThumb === i ? 'none' : '1px solid #E2E8F0',
                  transition: 'border 0.15s',
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
                  <ImageIcon sx={{ fontSize: 32, color: '#CBD5E1' }} />
                )}
              </Box>
            ))}
          </Box>

          {/* Description */}
          {product.description && (
            <Box sx={{ bgcolor: '#F8FAFC', borderRadius: '10px', p: 2 }}>
              <Typography sx={{ fontSize: 13, color: '#64748B', lineHeight: 1.8 }}>
                {product.description}
              </Typography>
            </Box>
          )}
        </Box>

        {/* ── Right: product info ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Name + rating */}
          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B', lineHeight: 1.4, mb: 1 }}>
              {product.name}
            </Typography>
            {product.rating != null && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Rating
                  value={product.rating}
                  precision={0.5}
                  size="small"
                  readOnly
                  sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }}
                />
                <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                  {product.rating} ({product.reviewCount ?? 0} {t('employee.productDetail.rating')})
                </Typography>
                {product.soldCount != null && (
                  <>
                    <Typography sx={{ fontSize: 13, color: '#CBD5E1' }}>·</Typography>
                    <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                      {t('employee.productDetail.sold', { count: product.soldCount })}
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Box>

          {/* Points price */}
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              bgcolor: '#FFFBEB', borderRadius: '10px', px: 2.5, py: 1.5,
            }}
          >
            <TollIcon sx={{ fontSize: 28, color: '#D97706' }} />
            <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#D97706' }}>
              {product.pointsCost.toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: 16, color: '#D97706', fontWeight: 500 }}>
              {t('employee.pointsUnit')}
            </Typography>
            {product.stock > 0 && (
              <Chip
                label={t('employee.productDetail.inStock')}
                size="small"
                sx={{ ml: 1, bgcolor: '#DCFCE7', color: '#166534', fontWeight: 600, fontSize: 12 }}
              />
            )}
          </Box>

          {/* Stock hint */}
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            {t('employee.productDetail.stock', { count: product.stock })}
          </Typography>

          <Divider sx={{ borderColor: '#F1F5F9' }} />

          {/* Quantity */}
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B', mb: 1 }}>
              {t('employee.productDetail.quantity')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                sx={{
                  width: 36, height: 36, border: '1px solid #E2E8F0',
                  borderRadius: '8px 0 0 8px', bgcolor: '#F8FAFC',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', '&:hover': { bgcolor: '#E2E8F0' },
                }}
              >
                <RemoveIcon sx={{ fontSize: 16, color: '#64748B' }} />
              </Box>
              <Box
                sx={{
                  width: 52, height: 36,
                  border: '1px solid #E2E8F0', borderLeft: 'none', borderRight: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{qty}</Typography>
              </Box>
              <Box
                component="button"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                sx={{
                  width: 36, height: 36, border: '1px solid #E2E8F0',
                  borderRadius: '0 8px 8px 0', bgcolor: '#F8FAFC',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', '&:hover': { bgcolor: '#E2E8F0' },
                }}
              >
                <AddIcon sx={{ fontSize: 16, color: '#64748B' }} />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#F1F5F9' }} />

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleRedeem}
              disabled={product.stock === 0}
              sx={{
                flex: 1, borderRadius: '10px', py: 1.5,
                fontSize: 16, fontWeight: 700, textTransform: 'none',
                boxShadow: 'none', '&:hover': { boxShadow: 'none' },
              }}
            >
              {t('employee.productDetail.redeem')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<FavoriteBorderIcon />}
              sx={{
                borderRadius: '10px', py: 1.5, px: 3,
                fontSize: 15, fontWeight: 500, textTransform: 'none',
                borderColor: '#E2E8F0', color: '#475569',
                '&:hover': { borderColor: '#2563EB', color: '#2563EB', bgcolor: '#EFF6FF' },
              }}
            >
              {t('employee.productDetail.addWishlist')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderRadius: '10px', py: 1.5, px: 2, minWidth: 'auto',
                borderColor: '#E2E8F0', color: '#475569',
                '&:hover': { borderColor: '#2563EB', color: '#2563EB', bgcolor: '#EFF6FF' },
              }}
            >
              <ShareIcon sx={{ fontSize: 20 }} />
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#1E293B' }}>
              {t('employee.productDetail.relatedProducts')}
            </Typography>
            <Typography
              component="span"
              sx={{ fontSize: 13, color: '#2563EB', cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
            >
              {t('employee.productDetail.viewMore')} &gt;
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {relatedProducts.map((rel) => (
              <Card
                key={rel.id}
                onClick={() => navigate(`/products/${rel.id}`)}
                elevation={0}
                sx={{
                  width: 200, borderRadius: '12px', border: '1px solid #F1F5F9',
                  cursor: 'pointer', overflow: 'hidden',
                  '&:hover': { boxShadow: 2 },
                }}
              >
                <Box sx={{ height: 120, bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {rel.imageUrl ? (
                    <Box
                      component="img"
                      src={rel.imageUrl}
                      alt={rel.name}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <ImageIcon sx={{ fontSize: 48, color: '#CBD5E1' }} />
                  )}
                </Box>
                <Box sx={{ p: 1.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1E293B', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {rel.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TollIcon sx={{ fontSize: 15, color: '#D97706' }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#D97706' }}>
                      {rel.pointsCost.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      )}

    </Box>
  );
}

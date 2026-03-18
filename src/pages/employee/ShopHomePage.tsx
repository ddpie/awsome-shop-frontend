import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Rating from '@mui/material/Rating';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import BackpackIcon from '@mui/icons-material/Backpack';
import TollIcon from '@mui/icons-material/Toll';
import type { SvgIconComponent } from '@mui/icons-material';

interface MockProduct {
  id: number;
  name: string;
  category: string;
  categoryLabel: string;
  rating: number;
  reviews: number;
  sold: number;
  points: number;
  icon: SvgIconComponent;
  bgColor: string;
  iconColor: string;
  tag: string | null;
  tagColor: string | null;
}

const CATEGORIES = [
  { key: 'all', labelKey: 'employee.category.all' },
  { key: 'digital', labelKey: 'employee.category.digital' },
  { key: 'life', labelKey: 'employee.category.life' },
  { key: 'food', labelKey: 'employee.category.food' },
  { key: 'gift', labelKey: 'employee.category.gift' },
  { key: 'office', labelKey: 'employee.category.office' },
];

const PRODUCTS: MockProduct[] = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 降噪耳机',
    category: 'digital',
    categoryLabel: '数码电子',
    rating: 4.5,
    reviews: 128,
    sold: 86,
    points: 2580,
    icon: HeadphonesIcon,
    bgColor: '#DBEAFE',
    iconColor: '#2563EB',
    tag: '热销',
    tagColor: '#DC2626',
  },
  {
    id: 2,
    name: 'Apple Watch Series 9',
    category: 'digital',
    categoryLabel: '数码电子',
    rating: 5.0,
    reviews: 56,
    sold: 32,
    points: 3200,
    icon: WatchIcon,
    bgColor: '#EDE9FE',
    iconColor: '#7C3AED',
    tag: '新品',
    tagColor: '#2563EB',
  },
  {
    id: 3,
    name: '星巴克礼品卡 200元',
    category: 'gift',
    categoryLabel: '礼品卡券',
    rating: 4.0,
    reviews: 203,
    sold: 156,
    points: 680,
    icon: CardGiftcardIcon,
    bgColor: '#DCFCE7',
    iconColor: '#16A34A',
    tag: null,
    tagColor: null,
  },
  {
    id: 4,
    name: '小米双肩背包 都市休闲款',
    category: 'life',
    categoryLabel: '生活家居',
    rating: 4.5,
    reviews: 75,
    sold: 41,
    points: 450,
    icon: BackpackIcon,
    bgColor: '#FEF3C7',
    iconColor: '#D97706',
    tag: '特惠',
    tagColor: '#F59E0B',
  },
];

export default function ShopHomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts =
    activeCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

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
      <Box sx={{ display: 'flex', gap: '8px' }}>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat.key}
            label={t(cat.labelKey)}
            onClick={() => setActiveCategory(cat.key)}
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

      {/* Product Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {filteredProducts.map((product) => {
          const IconComp = product.icon;
          return (
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
              <Box
                sx={{
                  position: 'relative',
                  height: 200,
                  bgcolor: product.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconComp sx={{ fontSize: 64, color: product.iconColor }} />
                {product.tag && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bgcolor: product.tagColor,
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 600,
                      px: '10px',
                      py: '4px',
                      borderRadius: '0 0 8px 0',
                    }}
                  >
                    {product.tag}
                  </Box>
                )}
              </Box>

              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px', p: '16px', '&:last-child': { pb: '16px' } }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                  {product.categoryLabel}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Rating
                    value={product.rating}
                    precision={0.5}
                    size="small"
                    readOnly
                    sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' }, '& .MuiRating-iconEmpty': { color: '#E2E8F0' }, fontSize: 14 }}
                  />
                  <Typography sx={{ fontSize: 11, color: '#64748B' }}>
                    {product.rating} ({product.reviews})
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: '#CBD5E1' }}>
                    · {t('employee.sold')} {product.sold} {t('employee.soldUnit')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TollIcon sx={{ fontSize: 18, color: '#D97706' }} />
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#D97706' }}>
                      {product.points.toLocaleString()}
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
          );
        })}
      </Box>
    </Box>
  );
}

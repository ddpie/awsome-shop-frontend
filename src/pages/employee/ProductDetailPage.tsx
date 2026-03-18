import { useState } from 'react';
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
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import BackpackIcon from '@mui/icons-material/Backpack';
import TollIcon from '@mui/icons-material/Toll';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import type { SvgIconComponent } from '@mui/icons-material';

// ── Mock product data (shared with ShopHomePage) ───────────────────────────

interface MockProduct {
  id: number;
  name: string;
  category: string;
  categoryLabel: string;
  rating: number;
  reviews: number;
  sold: number;
  points: number;
  stock: number;
  icon: SvgIconComponent;
  bgColor: string;
  iconColor: string;
  tag: string | null;
  tagColor: string | null;
  colors: string[];
  specs: Record<string, string>;
  description: string;
}

const MOCK_PRODUCTS: Record<string, MockProduct> = {
  '1': {
    id: 1,
    name: 'Sony WH-1000XM5 降噪耳机',
    category: 'digital',
    categoryLabel: '数码电子',
    rating: 4.5,
    reviews: 128,
    sold: 86,
    points: 2580,
    stock: 43,
    icon: HeadphonesIcon,
    bgColor: '#DBEAFE',
    iconColor: '#2563EB',
    tag: '热销',
    tagColor: '#DC2626',
    colors: ['曜石黑', '白色', '蓝色'],
    specs: {
      brand: 'Sony 索尼',
      model: 'WH-1000XM5',
      connectivity: '蓝牙 5.2 / 3.5mm AUX',
      battery: '30小时（ANC开启）',
      weight: '250g',
      interface: 'USB-C / 3.5mm',
    },
    description: 'Sony WH-1000XM5 采用业界领先的主动降噪技术，配备 8 个麦克风和两颗处理器，提供卓越的降噪体验。全新 30mm 驱动单元带来清晰、自然的音质，支持 LDAC 高解析度音频传输。',
  },
  '2': {
    id: 2,
    name: 'Apple Watch Series 9',
    category: 'digital',
    categoryLabel: '数码电子',
    rating: 5.0,
    reviews: 56,
    sold: 32,
    points: 3200,
    stock: 18,
    icon: WatchIcon,
    bgColor: '#EDE9FE',
    iconColor: '#7C3AED',
    tag: '新品',
    tagColor: '#2563EB',
    colors: ['星光色', '午夜色', '红色'],
    specs: {
      brand: 'Apple',
      model: 'Apple Watch Series 9',
      connectivity: '蓝牙 5.3 / Wi-Fi / NFC',
      battery: '18小时',
      weight: '31.9g（41mm）',
      interface: 'Apple Watch 磁力充电',
    },
    description: 'Apple Watch Series 9 搭载全新 S9 芯片，性能提升 60%。支持双击手势操作，血氧检测、心率监测、ECG 心电图等健康功能一应俱全。',
  },
  '3': {
    id: 3,
    name: '星巴克礼品卡 200元',
    category: 'gift',
    categoryLabel: '礼品卡券',
    rating: 4.0,
    reviews: 203,
    sold: 156,
    points: 680,
    stock: 234,
    icon: CardGiftcardIcon,
    bgColor: '#DCFCE7',
    iconColor: '#16A34A',
    tag: null,
    tagColor: null,
    colors: ['标准版'],
    specs: {
      brand: '星巴克',
      model: '电子礼品卡',
      connectivity: '线上核销',
      battery: '-',
      weight: '-',
      interface: '二维码 / 卡号',
    },
    description: '星巴克电子礼品卡，面值 200 元，可在全国所有星巴克门店使用，支持 App 扫码核销，有效期 3 年。',
  },
  '4': {
    id: 4,
    name: '小米双肩背包 都市休闲款',
    category: 'life',
    categoryLabel: '生活家居',
    rating: 4.5,
    reviews: 75,
    sold: 41,
    points: 450,
    stock: 67,
    icon: BackpackIcon,
    bgColor: '#FEF3C7',
    iconColor: '#D97706',
    tag: '特惠',
    tagColor: '#F59E0B',
    colors: ['黑色', '深灰色'],
    specs: {
      brand: '小米',
      model: 'Mi City Backpack 2',
      connectivity: '-',
      battery: '-',
      weight: '500g',
      interface: '-',
    },
    description: '小米都市休闲双肩包，采用防泼水面料，15.6 英寸笔记本电脑夹层，多功能收纳分区，适合通勤和日常出行。',
  },
};

const RELATED_PRODUCTS = [
  { id: 2, name: 'Sony QC45', points: 1380, icon: HeadphonesIcon, bgColor: '#DBEAFE', iconColor: '#2563EB' },
  { id: 3, name: 'AirPods Pro 2', points: 2280, icon: HeadphonesIcon, bgColor: '#EDE9FE', iconColor: '#7C3AED' },
  { id: 4, name: 'JBL Tune 720NC', points: 980, icon: HeadphonesIcon, bgColor: '#DCFCE7', iconColor: '#16A34A' },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const product = (id ? MOCK_PRODUCTS[id] : undefined) ?? MOCK_PRODUCTS['1'];
  const IconComp = product.icon;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);

  const handleRedeem = () => {
    navigate(`/orders/confirm/${product.id}`);
  };

  const specRows = [
    { key: 'brand', label: t('employee.productDetail.brand') },
    { key: 'model', label: t('employee.productDetail.model') },
    { key: 'connectivity', label: t('employee.productDetail.connectivity') },
    { key: 'battery', label: t('employee.productDetail.battery') },
    { key: 'weight', label: t('employee.productDetail.weight') },
    { key: 'interface', label: t('employee.productDetail.interface') },
  ] as const;

  return (
    <Box sx={{ p: '24px 48px', display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ fontSize: 13 }}>
        <Link component={RouterLink} to="/" underline="hover" sx={{ fontSize: 13, color: '#64748B' }}>
          {t('employee.productDetail.breadcrumbHome')}
        </Link>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          sx={{ fontSize: 13, color: '#64748B' }}
        >
          {product.categoryLabel}
        </Link>
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
              bgcolor: product.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #F1F5F9',
            }}
          >
            <IconComp sx={{ fontSize: 120, color: product.iconColor }} />
            {product.tag && (
              <Box
                sx={{
                  position: 'absolute', top: 0, left: 0,
                  bgcolor: product.tagColor, color: '#fff',
                  fontSize: 12, fontWeight: 600, px: '12px', py: '5px',
                  borderRadius: '12px 0 8px 0',
                }}
              >
                {product.tag}
              </Box>
            )}
          </Box>

          {/* Thumbnails */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {[0, 1, 2, 3].map((i) => (
              <Box
                key={i}
                onClick={() => setActiveThumb(i)}
                sx={{
                  width: 72, height: 72, borderRadius: '8px',
                  bgcolor: product.bgColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  border: activeThumb === i ? `2px solid #2563EB` : '2px solid transparent',
                  outline: activeThumb === i ? 'none' : '1px solid #E2E8F0',
                  transition: 'border 0.15s',
                }}
              >
                <IconComp sx={{ fontSize: 32, color: product.iconColor, opacity: 0.7 + i * 0.1 }} />
              </Box>
            ))}
          </Box>

          {/* Specs table */}
          <Box sx={{ mt: 1 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1E293B', mb: 1.5 }}>
              {t('employee.productDetail.specs')}
            </Typography>
            <Box sx={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
              {specRows.map((row, i) => (
                <Box
                  key={row.key}
                  sx={{
                    display: 'flex',
                    borderBottom: i < specRows.length - 1 ? '1px solid #F1F5F9' : 'none',
                  }}
                >
                  <Box sx={{ width: 120, px: 2, py: 1.25, bgcolor: '#F8FAFC', flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 13, color: '#64748B' }}>{row.label}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, px: 2, py: 1.25 }}>
                    <Typography sx={{ fontSize: 13, color: '#1E293B' }}>
                      {product.specs[row.key]}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── Right: product info ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Name + rating */}
          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B', lineHeight: 1.4, mb: 1 }}>
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Rating
                value={product.rating}
                precision={0.5}
                size="small"
                readOnly
                sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }}
              />
              <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                {product.rating} ({product.reviews} {t('employee.productDetail.rating')})
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#CBD5E1' }}>·</Typography>
              <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                {t('employee.productDetail.sold', { count: product.sold })}
              </Typography>
            </Box>
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
              {product.points.toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: 16, color: '#D97706', fontWeight: 500 }}>
              {t('employee.pointsUnit')}
            </Typography>
            <Chip
              label={t('employee.productDetail.inStock')}
              size="small"
              sx={{ ml: 1, bgcolor: '#DCFCE7', color: '#166534', fontWeight: 600, fontSize: 12 }}
            />
          </Box>

          {/* Stock hint */}
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            {t('employee.productDetail.stock', { count: product.stock })}
          </Typography>

          <Divider sx={{ borderColor: '#F1F5F9' }} />

          {/* Color selection */}
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B', mb: 1 }}>
              {t('employee.productDetail.color')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {product.colors.map((color) => (
                <Chip
                  key={color}
                  label={color}
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    borderRadius: '8px',
                    fontSize: 13,
                    fontWeight: selectedColor === color ? 600 : 400,
                    bgcolor: selectedColor === color ? '#EFF6FF' : '#F8FAFC',
                    color: selectedColor === color ? '#2563EB' : '#475569',
                    border: selectedColor === color ? '1.5px solid #2563EB' : '1.5px solid #E2E8F0',
                    '&:hover': { bgcolor: '#EFF6FF' },
                  }}
                />
              ))}
            </Box>
          </Box>

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

          {/* Description */}
          <Box sx={{ bgcolor: '#F8FAFC', borderRadius: '10px', p: 2 }}>
            <Typography sx={{ fontSize: 13, color: '#64748B', lineHeight: 1.8 }}>
              {product.description}
            </Typography>
            <Typography
              component="span"
              sx={{ fontSize: 13, color: '#2563EB', cursor: 'pointer', fontWeight: 500, mt: 0.5, display: 'inline-block', '&:hover': { textDecoration: 'underline' } }}
            >
              {t('employee.productDetail.viewMore', '查看更多')} &gt;
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Related products */}
      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#1E293B' }}>
            {t('employee.productDetail.relatedProducts')}
          </Typography>
          <Typography
            component="span"
            sx={{ fontSize: 13, color: '#2563EB', cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
          >
            {t('employee.productDetail.viewMore', '查看更多')} &gt;
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {RELATED_PRODUCTS.filter((r) => r.id !== product.id).slice(0, 3).map((rel) => {
            const RelIcon = rel.icon;
            return (
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
                <Box sx={{ height: 120, bgcolor: rel.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RelIcon sx={{ fontSize: 48, color: rel.iconColor }} />
                </Box>
                <Box sx={{ p: 1.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1E293B', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {rel.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TollIcon sx={{ fontSize: 15, color: '#D97706' }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#D97706' }}>
                      {rel.points.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      </Box>

    </Box>
  );
}

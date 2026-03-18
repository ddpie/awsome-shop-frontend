import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import RedeemIcon from '@mui/icons-material/Redeem';
import BackpackIcon from '@mui/icons-material/Backpack';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SpeakerIcon from '@mui/icons-material/Speaker';
import type { SvgIconComponent } from '@mui/icons-material';

// ── Mock data ──────────────────────────────────────────────────────────────

interface AdminProduct {
  id: number;
  name: string;
  sku: string;
  category: string;
  brand: string;
  points: number;
  originalPrice: number;
  stock: number;
  sold: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  delivery: string;
  service: string;
  promo: string;
  colors: string;
  description: string;
  specs: { key: string; value: string }[];
  icon: SvgIconComponent;
  iconColor: string;
  iconBg: string;
}

const MOCK_PRODUCTS: Record<string, AdminProduct> = {
  '1': {
    id: 1,
    name: 'Sony WH-1000XM5 降噪耳机',
    sku: 'SKU-SONY-WH1000XM5-BLK',
    category: '数码电子 / 耳机音响',
    brand: 'Sony',
    points: 2580,
    originalPrice: 2999,
    stock: 45,
    sold: 44,
    status: 'active',
    createdAt: '2026-01-15 10:30:00',
    updatedAt: '2026-02-08 16:45:12',
    delivery: '公司地址配送（1-3 个工作日）',
    service: '正品保证 / 7天无理由 / 全国联保',
    promo: '新人首兑立减 100 积分',
    colors: '黑色 / 银白色 / 午夜蓝',
    description: 'Sony WH-1000XM5 是索尼旗舰级无线降噪耳机，搭载全新集成处理器 V1 和 8 个麦克风，提供业界领先的降噪效果。30mm 驱动单元带来卓越音质，支持 LDAC 高品质无线传输。轻量化设计仅重 250g，佩戴舒适。30 小时超长续航，支持快充（3 分钟充电可播放 3 小时）。支持多点连接，可同时连接两台设备。',
    specs: [
      { key: '颜色', value: '黑色 / 银白色' },
      { key: '连接方式', value: '蓝牙 5.2 / 3.5mm 有线' },
      { key: '续航时间', value: '30 小时（降噪开启）' },
      { key: '重量', value: '250g' },
      { key: '驱动单元', value: '30mm' },
    ],
    icon: HeadphonesIcon, iconColor: '#2563EB', iconBg: '#DBEAFE',
  },
  '2': {
    id: 2, name: 'Apple Watch Series 9', sku: 'SKU-AW-S9-41-SL',
    category: '数码电子 / 智能手表', brand: 'Apple',
    points: 2200, originalPrice: 2999, stock: 18, sold: 32,
    status: 'active', createdAt: '2026-01-20 09:00:00', updatedAt: '2026-02-10 11:20:00',
    delivery: '公司地址配送（1-3 个工作日）', service: '正品保证 / 7天无理由',
    promo: '', colors: '星光色 / 午夜色',
    description: 'Apple Watch Series 9 搭载全新 S9 芯片，性能提升 60%。支持双击手势操作，血氧检测、心率监测、ECG 心电图等健康功能一应俱全。',
    specs: [{ key: '颜色', value: '星光色 / 午夜色' }, { key: '尺寸', value: '41mm / 45mm' }, { key: '续航', value: '18 小时' }],
    icon: WatchIcon, iconColor: '#7C3AED', iconBg: '#EDE9FE',
  },
  '3': {
    id: 3, name: '星巴克 200元礼品卡', sku: 'SKU-SBUX-200',
    category: '礼品卡券 / 餐饮卡券', brand: '星巴克',
    points: 680, originalPrice: 200, stock: 234, sold: 156,
    status: 'active', createdAt: '2026-01-10 14:00:00', updatedAt: '2026-02-01 10:00:00',
    delivery: '电子卡券（即时到账）', service: '正品保证 / 有效期3年',
    promo: '', colors: '标准版',
    description: '星巴克电子礼品卡，面值 200 元，可在全国所有星巴克门店使用，支持 App 扫码核销，有效期 3 年。',
    specs: [{ key: '类型', value: '电子礼品卡' }, { key: '核销方式', value: '二维码 / 卡号' }],
    icon: RedeemIcon, iconColor: '#16A34A', iconBg: '#DCFCE7',
  },
  '4': {
    id: 4, name: '小米城市通勤双肩包', sku: 'SKU-MI-BAG-BLK',
    category: '生活家居', brand: '小米',
    points: 450, originalPrice: 299, stock: 67, sold: 41,
    status: 'active', createdAt: '2026-01-12 08:30:00', updatedAt: '2026-01-30 15:00:00',
    delivery: '公司地址配送（1-3 个工作日）', service: '正品保证 / 7天无理由',
    promo: '', colors: '黑色 / 深灰色',
    description: '小米都市休闲双肩包，采用防泼水面料，15.6 英寸笔记本电脑夹层，多功能收纳分区，适合通勤和日常出行。',
    specs: [{ key: '颜色', value: '黑色 / 深灰色' }, { key: '容量', value: '26L' }, { key: '重量', value: '500g' }],
    icon: BackpackIcon, iconColor: '#D97706', iconBg: '#FEF3C7',
  },
  '5': {
    id: 5, name: '罗技 MX Keys 无线键盘', sku: 'SKU-LOGI-MXKEYS',
    category: '数码电子 / 智能键盘', brand: '罗技',
    points: 860, originalPrice: 799, stock: 29, sold: 18,
    status: 'active', createdAt: '2026-01-18 11:00:00', updatedAt: '2026-02-05 09:30:00',
    delivery: '公司地址配送（1-3 个工作日）', service: '正品保证 / 7天无理由',
    promo: '', colors: '深灰色',
    description: '罗技 MX Keys 无线键盘，智能背光，多设备连接，适合专业办公。',
    specs: [{ key: '连接方式', value: '蓝牙 / USB 接收器' }, { key: '兼容系统', value: 'Windows / macOS' }],
    icon: KeyboardIcon, iconColor: '#2563EB', iconBg: '#DBEAFE',
  },
  '6': {
    id: 6, name: 'Bose SoundLink 蓝牙音箱', sku: 'SKU-BOSE-SL-BLK',
    category: '数码电子', brand: 'Bose',
    points: 1200, originalPrice: 1499, stock: 12, sold: 8,
    status: 'inactive', createdAt: '2026-01-22 16:00:00', updatedAt: '2026-02-12 14:00:00',
    delivery: '公司地址配送（1-3 个工作日）', service: '正品保证 / 7天无理由',
    promo: '', colors: '黑色',
    description: 'Bose SoundLink Flex 蓝牙音箱，防水防尘，户外音质出色。',
    specs: [{ key: '防水等级', value: 'IP67' }, { key: '续航', value: '12 小时' }],
    icon: SpeakerIcon, iconColor: '#7C3AED', iconBg: '#EDE9FE',
  },
};

// ── Upload Image Dialog ───────────────────────────────────────────────────

const MOCK_IMAGES = [
  { id: 1, isMain: true },
  { id: 2, isMain: false },
  { id: 3, isMain: false },
];

function UploadImageDialog({
  open, onClose, product,
}: {
  open: boolean;
  onClose: () => void;
  product: { icon: SvgIconComponent; iconColor: string; iconBg: string };
}) {
  const { t } = useTranslation();
  const [images, setImages] = useState(MOCK_IMAGES);
  const IconComp = product.icon;

  const handleRemove = (id: number) => setImages((prev) => prev.filter((img) => img.id !== id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}
      PaperProps={{
        sx: {
          width: 560, borderRadius: '16px',
          boxShadow: '0 24px 64px -4px rgba(0,0,0,0.30), 0 8px 24px -4px rgba(0,0,0,0.20)',
        },
      }}>

      {/* Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 3, py: 2.5, borderBottom: '1px solid #E2E8F0',
      }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
          {t('admin.productDetail.uploadImageTitle', '上传商品图片')}
        </Typography>
        <Box component="button" onClick={onClose} sx={{
          width: 28, height: 28, borderRadius: '14px', border: 'none', bgcolor: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', '&:hover': { bgcolor: '#F1F5F9' },
        }}>
          <CloseIcon sx={{ fontSize: 20, color: '#64748B' }} />
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

        {/* Drop zone */}
        <Box sx={{
          height: 160, borderRadius: '12px', bgcolor: '#EFF6FF',
          border: '2px solid #2563EB',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 1.5, cursor: 'pointer',
          '&:hover': { bgcolor: '#DBEAFE' },
        }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '24px', bgcolor: '#DBEAFE',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CloudUploadIcon sx={{ fontSize: 24, color: '#2563EB' }} />
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
            {t('admin.productDetail.dropZoneText', '拖拽图片到此处，或点击上传')}
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#64748B' }}>
            {t('admin.productDetail.dropZoneHint', '支持 JPG、PNG 格式，单张不超过 5MB，最多上传 10 张')}
          </Typography>
          <Box component="button" sx={{
            px: 2, py: 0.75, borderRadius: '8px', border: 'none',
            bgcolor: '#2563EB', color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', '&:hover': { bgcolor: '#1D4ED8' },
          }}>
            {t('admin.productDetail.selectFile', '选择文件')}
          </Box>
        </Box>

        {/* Preview label row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>
            {t('admin.productDetail.uploadedImages', '已上传图片')} ({images.length}/10)
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#64748B' }}>
            {t('admin.productDetail.dragHint', '拖拽排序 · 第一张为主图')}
          </Typography>
        </Box>

        {/* Preview grid */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {images.map((img) => (
            <Box key={img.id} sx={{
              position: 'relative', width: 120, height: 120, borderRadius: '8px',
              bgcolor: product.iconBg, flexShrink: 0,
              border: img.isMain ? '2px solid #2563EB' : '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconComp sx={{ fontSize: 36, color: product.iconColor }} />
              {/* Main badge */}
              {img.isMain && (
                <Box sx={{
                  position: 'absolute', top: 4, left: 4,
                  bgcolor: '#2563EB', color: '#fff',
                  fontSize: 11, fontWeight: 600, px: '6px', py: '2px',
                  borderRadius: '4px',
                }}>
                  {t('admin.productDetail.mainImage', '主图')}
                </Box>
              )}
              {/* Delete button */}
              <Box component="button" onClick={() => handleRemove(img.id)} sx={{
                position: 'absolute', top: 4, right: 4,
                width: 20, height: 20, borderRadius: '10px',
                bgcolor: 'rgba(0,0,0,0.5)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}>
                <CloseIcon sx={{ fontSize: 12, color: '#fff' }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.25,
        px: 3, py: 2.5, borderTop: '1px solid #E2E8F0',
      }}>
        <Box component="button" onClick={onClose} sx={{
          px: 2.5, py: 1.25, borderRadius: '8px', border: '1px solid #E2E8F0',
          bgcolor: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#1E293B',
          '&:hover': { bgcolor: '#F8FAFC' },
        }}>
          {t('common.cancel', '取消')}
        </Box>
        <Box component="button" onClick={onClose} sx={{
          px: 2.5, py: 1.25, borderRadius: '8px', border: 'none',
          bgcolor: '#2563EB', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#fff',
          '&:hover': { bgcolor: '#1D4ED8' },
        }}>
          {t('admin.productDetail.saveImages', '保存图片')}
        </Box>
      </Box>
    </Dialog>
  );
}

// ── Deactivate Dialog ─────────────────────────────────────────────────────

function DeactivateDialog({
  open, onClose, onConfirm, product,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: { name: string; sku: string; stock: number; icon: SvgIconComponent; iconColor: string; iconBg: string };
}) {
  const { t } = useTranslation();
  const IconComp = product.icon;

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}
      PaperProps={{
        sx: {
          width: 440, borderRadius: '16px',
          boxShadow: '0 24px 64px -4px rgba(0,0,0,0.30), 0 8px 24px -4px rgba(0,0,0,0.20)',
        },
      }}>
      {/* Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 3, py: 2.5,
        borderBottom: '1px solid #E2E8F0',
      }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
          {t('admin.productDetail.deactivateTitle', '确认下架商品')}
        </Typography>
        <Box
          component="button"
          onClick={onClose}
          sx={{
            width: 28, height: 28, borderRadius: '14px', border: 'none', bgcolor: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', '&:hover': { bgcolor: '#F1F5F9' },
          }}
        >
          <CloseIcon sx={{ fontSize: 20, color: '#64748B' }} />
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Warning icon */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '28px', bgcolor: '#FEF3C7', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <WarningIcon sx={{ fontSize: 28, color: '#D97706' }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 0.5 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
              {t('admin.productDetail.deactivateQuestion', '确定要下架以下商品吗？')}
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>
              {t('admin.productDetail.deactivateDesc', '下架后，员工将无法在积分商城中看到或兑换该商品。您可以随时重新上架。')}
            </Typography>
          </Box>
        </Box>

        {/* Product info card */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          bgcolor: '#F8FAFC', borderRadius: '8px', p: 2,
        }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '8px', bgcolor: product.iconBg, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconComp sx={{ fontSize: 22, color: product.iconColor }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>
              {product.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#64748B' }}>
              {product.sku} · {t('admin.productDetail.fieldStock', '库存')} {product.stock} {t('admin.productDetail.unit', '件')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.25,
        px: 3, py: 2.5,
        borderTop: '1px solid #E2E8F0',
      }}>
        <Box
          component="button"
          onClick={onClose}
          sx={{
            px: 2.5, py: 1.25, borderRadius: '8px', border: '1px solid #E2E8F0',
            bgcolor: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#1E293B',
            '&:hover': { bgcolor: '#F8FAFC' },
          }}
        >
          {t('common.cancel', '取消')}
        </Box>
        <Box
          component="button"
          onClick={onConfirm}
          sx={{
            px: 2.5, py: 1.25, borderRadius: '8px', border: 'none',
            bgcolor: '#F59E0B', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#fff',
            '&:hover': { bgcolor: '#D97706' },
          }}
        >
          {t('admin.productDetail.deactivateConfirm', '确认下架')}
        </Box>
      </Box>
    </Dialog>
  );
}

// ── Adjust Stock Dialog ────────────────────────────────────────────────────

function AdjustStockDialog({
  open, onClose, currentStock, onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  currentStock: number;
  onConfirm: (delta: number) => void;
}) {
  const { t } = useTranslation();
  const [type, setType] = useState<'in' | 'out'>('in');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');

  const qtyNum = parseInt(qty, 10);
  const delta = !isNaN(qtyNum) && qtyNum > 0 ? (type === 'in' ? qtyNum : -qtyNum) : 0;
  const newStock = currentStock + delta;

  const handleClose = () => {
    setType('in'); setQty(''); setReason('');
    onClose();
  };

  const handleConfirm = () => {
    if (!isNaN(qtyNum) && qtyNum > 0) {
      onConfirm(delta);
      setType('in'); setQty(''); setReason('');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={false}
      PaperProps={{
        sx: {
          width: 480, borderRadius: '16px',
          boxShadow: '0 24px 64px -4px rgba(0,0,0,0.30), 0 8px 24px -4px rgba(0,0,0,0.20)',
        },
      }}>

      {/* Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 3, py: 2.5, borderBottom: '1px solid #E2E8F0',
      }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
          {t('admin.productDetail.adjustStock', '调整库存')}
        </Typography>
        <Box component="button" onClick={handleClose} sx={{
          width: 28, height: 28, borderRadius: '14px', border: 'none', bgcolor: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', '&:hover': { bgcolor: '#F1F5F9' },
        }}>
          <CloseIcon sx={{ fontSize: 20, color: '#64748B' }} />
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

        {/* Current stock */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          bgcolor: '#F8FAFC', borderRadius: '8px', px: 2, py: 1.5,
        }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>
            {t('admin.productDetail.currentStock', '当前库存')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#16A34A' }}>
              {currentStock}
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#64748B' }}>
              {t('admin.productDetail.unit', '件')}
            </Typography>
          </Box>
        </Box>

        {/* Adjust type */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>
            {t('admin.productDetail.adjustType', '调整类型')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {(['in', 'out'] as const).map((opt) => (
              <Box key={opt} component="button" onClick={() => setType(opt)} sx={{
                display: 'flex', alignItems: 'center', gap: 0.75,
                border: 'none', bgcolor: 'transparent', cursor: 'pointer', p: 0,
              }}>
                <Box sx={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: type === opt ? '5px solid #2563EB' : '2px solid #CBD5E1',
                  bgcolor: '#fff',
                }} />
                <Typography sx={{ fontSize: 13, color: '#1E293B' }}>
                  {opt === 'in'
                    ? t('admin.productDetail.adjustIn', '入库（增加）')
                    : t('admin.productDetail.adjustOut', '出库（减少）')}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Qty input */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>
            {t('admin.productDetail.adjustQty', '调整数量')}
          </Typography>
          <Box
            component="input"
            type="number"
            min={1}
            value={qty}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQty(e.target.value)}
            placeholder="50"
            sx={{
              height: 40, borderRadius: '8px', px: 1.5,
              border: '2px solid #2563EB', outline: 'none',
              fontSize: 14, fontWeight: 500, color: '#1E293B',
              width: '100%', boxSizing: 'border-box',
              '&:focus': { borderColor: '#2563EB' },
            }}
          />
        </Box>

        {/* Reason textarea */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>
            {t('admin.productDetail.adjustReason', '调整原因')}
          </Typography>
          <Box
            component="textarea"
            rows={3}
            value={reason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
            placeholder={t('admin.productDetail.adjustReasonPlaceholder', '如：新一批采购到货入库')}
            sx={{
              borderRadius: '8px', px: 1.5, py: 1.25,
              border: '1px solid #E2E8F0', outline: 'none', resize: 'none',
              fontSize: 13, color: '#1E293B', fontFamily: 'inherit',
              width: '100%', boxSizing: 'border-box',
              '&:focus': { borderColor: '#2563EB' },
            }}
          />
        </Box>

        {/* Preview */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          bgcolor: '#EFF6FF', borderRadius: '8px', px: 2, py: 1.5,
        }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>
            {t('admin.productDetail.adjustPreview', '调整后库存')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 14, color: '#94A3B8' }}>{currentStock}</Typography>
            <Typography sx={{ fontSize: 14, color: '#94A3B8' }}>→</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>
              {delta !== 0 ? newStock : '—'}
            </Typography>
            {delta !== 0 && (
              <Typography sx={{ fontSize: 14, color: '#64748B' }}>
                {t('admin.productDetail.unit', '件')}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.25,
        px: 3, py: 2.5, borderTop: '1px solid #E2E8F0',
      }}>
        <Box component="button" onClick={handleClose} sx={{
          px: 2.5, py: 1.25, borderRadius: '8px', border: '1px solid #E2E8F0',
          bgcolor: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#1E293B',
          '&:hover': { bgcolor: '#F8FAFC' },
        }}>
          {t('common.cancel', '取消')}
        </Box>
        <Box component="button" onClick={handleConfirm} sx={{
          px: 2.5, py: 1.25, borderRadius: '8px', border: 'none',
          bgcolor: '#2563EB', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#fff',
          '&:hover': { bgcolor: '#1D4ED8' },
        }}>
          {t('admin.productDetail.adjustConfirm', '确认调整')}
        </Box>
      </Box>
    </Dialog>
  );
}

// ── Info field ─────────────────────────────────────────────────────────────

function InfoField({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>{label}</Typography>
      {typeof value === 'string'
        ? <Typography sx={{ fontSize: 14, fontWeight: 500, color: valueColor ?? '#1E293B', lineHeight: 1.5 }}>{value}</Typography>
        : value}
    </Box>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const product = (id ? MOCK_PRODUCTS[id] : undefined) ?? MOCK_PRODUCTS['1'];
  const IconComp = product.icon;

  const [activeThumb, setActiveThumb] = useState(0);
  const [stock, setStock] = useState(product.stock);
  const [status, setStatus] = useState(product.status);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const isActive = status === 'active';

  const handleToggleStatus = () => setStatus((s) => s === 'active' ? 'inactive' : 'active');
  const handleDeactivateConfirm = () => {
    setStatus('inactive');
    setDeactivateDialogOpen(false);
  };
  const handleDelete = () => {
    if (window.confirm(t('admin.productDetail.confirmDelete', `确认删除「${product.name}」？此操作不可撤销。`))) {
      navigate('/admin/products');
    }
  };

  const CARD_SX = {
    borderRadius: '10px', border: '1px solid #E8EDF2',
    bgcolor: '#fff', overflow: 'hidden',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: '32px', bgcolor: '#F8FAFC', minHeight: '100%' }}>

      {/* ── Page Header ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: breadcrumb + title row */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Breadcrumbs sx={{ fontSize: 13 }}>
            <Link component={RouterLink} to="/admin/products" underline="hover"
              sx={{ fontSize: 13, color: '#64748B' }}>
              {t('admin.products.title', '产品管理')}
            </Link>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>
              {t('admin.productDetail.breadcrumb', '商品详情')}
            </Typography>
          </Breadcrumbs>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>
              {product.name}
            </Typography>
            <Chip
              label={isActive
                ? t('admin.productDetail.statusActive', '已上架')
                : t('admin.productDetail.statusInactive', '已下架')}
              size="small"
              sx={{
                borderRadius: '12px', fontWeight: 600, fontSize: 12,
                bgcolor: isActive ? '#DCFCE7' : '#F1F5F9',
                color: isActive ? '#166534' : '#64748B',
                height: 26,
              }}
            />
          </Box>
        </Box>

        {/* Right: action buttons + avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          {/* 下架 / 上架 */}
          <Button variant="outlined" size="small"
            startIcon={<VisibilityOffIcon sx={{ fontSize: 16 }} />}
            onClick={isActive ? () => setDeactivateDialogOpen(true) : handleToggleStatus}
            sx={{
              borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 500,
              borderColor: '#F59E0B', color: '#F59E0B',
              '&:hover': { bgcolor: '#FFFBEB', borderColor: '#F59E0B' },
            }}>
            {isActive
              ? t('admin.productDetail.btnShelf', '下架')
              : t('admin.productDetail.btnOnShelf', '上架')}
          </Button>

          {/* 调整库存 */}
          <Button variant="outlined" size="small"
            startIcon={<InventoryIcon sx={{ fontSize: 16 }} />}
            onClick={() => setStockDialogOpen(true)}
            sx={{
              borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 500,
              borderColor: '#E2E8F0', color: '#1E293B',
              '&:hover': { bgcolor: '#F8FAFC' },
            }}>
            {t('admin.productDetail.btnStock', '调整库存')}
          </Button>

          {/* 编辑商品 */}
          <Button variant="contained" size="small"
            startIcon={<EditIcon sx={{ fontSize: 16 }} />}
            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
            sx={{
              borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 600,
              boxShadow: 'none', '&:hover': { boxShadow: 'none' },
            }}>
            {t('admin.productDetail.btnEdit', '编辑商品')}
          </Button>

          {/* 删除 */}
          <Button variant="outlined" size="small"
            startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
            onClick={handleDelete}
            sx={{
              borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 500,
              borderColor: '#EF4444', color: '#EF4444',
              '&:hover': { bgcolor: '#FEF2F2', borderColor: '#EF4444' },
            }}>
            {t('admin.productDetail.btnDelete', '删除')}
          </Button>

          {/* Avatar */}
          <Box sx={{
            width: 40, height: 40, borderRadius: '50%', bgcolor: '#2563EB', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>A</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Content Row: image card + info card ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 3 }}>

        {/* Image Card */}
        <Paper elevation={0} sx={CARD_SX}>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Card header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
                {t('admin.productDetail.images', '商品图片')}
              </Typography>
              <Button variant="outlined" size="small"
                startIcon={<AddPhotoAlternateIcon sx={{ fontSize: 14 }} />}
                onClick={() => setUploadDialogOpen(true)}
                sx={{
                  borderRadius: '6px', textTransform: 'none', fontSize: 12,
                  borderColor: '#2563EB', color: '#2563EB', py: '4px', px: '10px',
                  '&:hover': { bgcolor: '#EFF6FF' },
                }}>
                {t('admin.productDetail.uploadImage', '上传图片')}
              </Button>
            </Box>
            <Divider sx={{ borderColor: '#F1F5F9' }} />

            {/* Main image */}
            <Box sx={{
              height: 300, borderRadius: '8px', bgcolor: product.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconComp sx={{ fontSize: 100, color: product.iconColor }} />
            </Box>

            {/* Thumbnails */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[0, 1, 2].map((i) => (
                <Box key={i} onClick={() => setActiveThumb(i)}
                  sx={{
                    width: 80, height: 80, borderRadius: '8px',
                    bgcolor: i === 0 ? product.iconBg : '#EFF6FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                    border: activeThumb === i ? `2px solid #2563EB` : '1px solid #E2E8F0',
                  }}>
                  <IconComp sx={{ fontSize: 28, color: i === 0 ? product.iconColor : '#94A3B8' }} />
                </Box>
              ))}
              {/* Add thumbnail */}
              <Box sx={{
                width: 80, height: 80, borderRadius: '8px',
                border: '1px solid #E2E8F0', bgcolor: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF' },
              }}>
                <AddIcon sx={{ fontSize: 24, color: '#94A3B8' }} />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Info Card */}
        <Paper elevation={0} sx={CARD_SX}>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
              {t('admin.productDetail.basicInfo', '基本信息')}
            </Typography>
            <Divider sx={{ borderColor: '#F1F5F9' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Row 1: name + sku */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <InfoField label={t('admin.productDetail.fieldName', '商品名称')} value={product.name} />
                <InfoField label={t('admin.productDetail.fieldSku', '商品编号 (SKU)')} value={product.sku} />
              </Box>
              {/* Row 2: category + brand */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <InfoField label={t('admin.productDetail.fieldCategory', '商品分类')} value={product.category} />
                <InfoField label={t('admin.productDetail.fieldBrand', '品牌')} value={product.brand} />
              </Box>
              {/* Row 3: points + market price */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <InfoField
                  label={t('admin.productDetail.fieldPoints', '积分价格')}
                  value={
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#2563EB' }}>
                      {product.points.toLocaleString()} {t('employee.pointsUnit', '积分')}
                    </Typography>
                  }
                />
                <InfoField
                  label={t('admin.productDetail.fieldMarket', '市场参考价')}
                  value={`¥ ${product.originalPrice.toLocaleString()}.00`}
                />
              </Box>
              {/* Row 4: stock + sold */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <InfoField
                  label={t('admin.productDetail.fieldStock', '当前库存')}
                  value={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                        {stock} {t('admin.productDetail.unit', '件')}
                      </Typography>
                      {stock <= 20 && (
                        <Chip label={t('admin.productDetail.lowStock', '库存紧张')} size="small"
                          sx={{ height: 20, fontSize: 11, bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 600 }} />
                      )}
                    </Box>
                  }
                />
                <InfoField
                  label={t('admin.productDetail.fieldSold', '已兑换数量')}
                  value={`${product.sold} ${t('admin.productDetail.unit', '件')}`}
                />
              </Box>
              {/* Row 5: created + updated */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <InfoField label={t('admin.productDetail.fieldCreated', '创建时间')} value={product.createdAt} />
                <InfoField label={t('admin.productDetail.fieldUpdated', '最后更新')} value={product.updatedAt} />
              </Box>
              {/* Row 6: delivery + service */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <InfoField label={t('admin.productDetail.fieldDelivery', '配送方式')} value={product.delivery} />
                <InfoField label={t('admin.productDetail.fieldService', '服务保障')} value={product.service} />
              </Box>
              {/* Row 7: promo + colors */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <InfoField
                  label={t('admin.productDetail.fieldPromo', '促销活动')}
                  value={product.promo || '—'}
                  valueColor={product.promo ? '#2563EB' : '#94A3B8'}
                />
                <InfoField label={t('admin.productDetail.fieldColors', '可选颜色')} value={product.colors} />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* ── Description Card ── */}
      <Paper elevation={0} sx={CARD_SX}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
            {t('admin.productDetail.description', '商品描述')}
          </Typography>
          <Divider sx={{ borderColor: '#F1F5F9' }} />
          <Typography sx={{ fontSize: 14, color: '#64748B', lineHeight: 1.8 }}>
            {product.description}
          </Typography>
        </Box>
      </Paper>

      {/* ── Specs Card ── */}
      <Paper elevation={0} sx={CARD_SX}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
            {t('admin.productDetail.specs', '规格参数')}
          </Typography>
          <Divider sx={{ borderColor: '#F1F5F9' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {product.specs.map((spec, i) => (
              <Box key={i} sx={{
                display: 'flex', alignItems: 'center',
                py: '10px',
                borderBottom: i < product.specs.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#64748B', width: 160, flexShrink: 0 }}>
                  {spec.key}
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>
                  {spec.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Adjust stock dialog */}
      <AdjustStockDialog
        open={stockDialogOpen}
        onClose={() => setStockDialogOpen(false)}
        currentStock={stock}
        onConfirm={(delta) => { setStock((s) => Math.max(0, s + delta)); setStockDialogOpen(false); }}
      />

      {/* Deactivate dialog */}
      <DeactivateDialog
        open={deactivateDialogOpen}
        onClose={() => setDeactivateDialogOpen(false)}
        onConfirm={handleDeactivateConfirm}
        product={product}
      />

      {/* Upload image dialog */}
      <UploadImageDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        product={product}
      />
    </Box>
  );
}

import { useState, useRef } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import RedeemIcon from '@mui/icons-material/Redeem';
import BackpackIcon from '@mui/icons-material/Backpack';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SpeakerIcon from '@mui/icons-material/Speaker';
import type { SvgIconComponent } from '@mui/icons-material';

// ── Mock data ──────────────────────────────────────────────────────────────

interface MockProduct {
  id: number;
  name: string;
  sku: string;
  category: string;
  brand: string;
  points: number;
  originalPrice: number;
  stock: number;
  status: 'active' | 'inactive';
  description: string;
  specs: { key: string; value: string }[];
  icon: SvgIconComponent;
  iconColor: string;
  iconBg: string;
}

const MOCK_PRODUCTS: Record<string, MockProduct> = {
  '1': {
    id: 1, name: 'Sony WH-1000XM5 降噪耳机', sku: 'SKU-WH1000XM5-BLK',
    category: '数码电子', brand: 'Sony', points: 2580, originalPrice: 2999,
    stock: 45, status: 'active',
    description: 'Sony WH-1000XM5 采用业界领先的主动降噪技术，配备 8 个麦克风和两颗处理器，提供卓越的降噪体验。全新 30mm 驱动单元带来清晰、自然的音质，支持 LDAC 高解析度音频传输。',
    specs: [
      { key: '颜色', value: '曜石黑 / 白色' },
      { key: '连接方式', value: '蓝牙 5.2 / 3.5mm AUX' },
      { key: '重量', value: '250g（含线材）' },
    ],
    icon: HeadphonesIcon, iconColor: '#2563EB', iconBg: '#DBEAFE',
  },
  '2': {
    id: 2, name: 'Apple Watch Series 9', sku: 'SKU-AW-S9-41-SL',
    category: '数码电子', brand: 'Apple', points: 2200, originalPrice: 2999,
    stock: 18, status: 'active',
    description: 'Apple Watch Series 9 搭载全新 S9 芯片，性能提升 60%。支持双击手势操作，血氧检测、心率监测、ECG 心电图等健康功能一应俱全。',
    specs: [{ key: '颜色', value: '星光色 / 午夜色' }, { key: '尺寸', value: '41mm / 45mm' }],
    icon: WatchIcon, iconColor: '#7C3AED', iconBg: '#EDE9FE',
  },
  '3': {
    id: 3, name: '星巴克 200元礼品卡', sku: 'SKU-SBUX-200',
    category: '礼品卡券', brand: '星巴克', points: 680, originalPrice: 200,
    stock: 234, status: 'active',
    description: '星巴克电子礼品卡，面值 200 元，可在全国所有星巴克门店使用。',
    specs: [{ key: '类型', value: '电子礼品卡' }],
    icon: RedeemIcon, iconColor: '#16A34A', iconBg: '#DCFCE7',
  },
  '4': {
    id: 4, name: '小米城市通勤双肩包', sku: 'SKU-MI-BAG-BLK',
    category: '生活家居', brand: '小米', points: 450, originalPrice: 299,
    stock: 67, status: 'active',
    description: '小米都市休闲双肩包，采用防泼水面料，15.6 英寸笔记本电脑夹层。',
    specs: [{ key: '颜色', value: '黑色 / 深灰色' }],
    icon: BackpackIcon, iconColor: '#D97706', iconBg: '#FEF3C7',
  },
  '5': {
    id: 5, name: '罗技 MX Keys 无线键盘', sku: 'SKU-LOGI-MXKEYS',
    category: '数码电子', brand: '罗技', points: 860, originalPrice: 799,
    stock: 29, status: 'active',
    description: '罗技 MX Keys 无线键盘，智能背光，多设备连接，适合专业办公。',
    specs: [{ key: '连接方式', value: '蓝牙 / USB 接收器' }],
    icon: KeyboardIcon, iconColor: '#2563EB', iconBg: '#DBEAFE',
  },
  '6': {
    id: 6, name: 'Bose SoundLink 蓝牙音箱', sku: 'SKU-BOSE-SL-BLK',
    category: '数码电子', brand: 'Bose', points: 1200, originalPrice: 1499,
    stock: 12, status: 'inactive',
    description: 'Bose SoundLink Flex 蓝牙音箱，防水防尘，户外音质出色。',
    specs: [{ key: '防水等级', value: 'IP67' }],
    icon: SpeakerIcon, iconColor: '#7C3AED', iconBg: '#EDE9FE',
  },
};

const CATEGORIES = ['数码电子', '礼品卡券', '生活家居', '餐饮美食', '办公用品'];

// ── Upload Image Dialog ────────────────────────────────────────────────────

interface MockImage {
  id: number;
  icon: SvgIconComponent;
  color: string;
  bg: string;
}

function UploadImageDialog({
  open, onClose, onConfirm,
  productIcon, productIconColor, productIconBg,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (ids: number[]) => void;
  productIcon: SvgIconComponent;
  productIconColor: string;
  productIconBg: string;
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockImages: MockImage[] = [
    { id: 1, icon: productIcon, color: productIconColor, bg: productIconBg },
    { id: 2, icon: productIcon, color: productIconColor, bg: productIconBg },
    { id: 3, icon: productIcon, color: productIconColor, bg: productIconBg },
  ];

  const [selected, setSelected] = useState<Set<number>>(new Set([1]));

  const toggle = (id: number) =>
    setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>
          {t('admin.productEdit.uploadDialog.title', '上传商品图片')}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Drop zone */}
        <Box onClick={() => fileInputRef.current?.click()}
          sx={{
            border: '2px dashed #CBD5E1', borderRadius: '10px', bgcolor: '#F8FAFC',
            p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5,
            cursor: 'pointer', mb: 2.5,
            '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF' },
          }}>
          <CloudUploadIcon sx={{ fontSize: 36, color: '#94A3B8' }} />
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>
            {t('admin.productEdit.uploadDialog.dropHint', '将图片拖拽至此处，或点击上传')}
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>
            {t('admin.productEdit.uploadDialog.formatHint', '支持 JPG、PNG、WebP 格式，单张不超过 5 MB')}
          </Typography>
          <Button variant="outlined" size="small"
            sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, mt: 0.5 }}>
            {t('admin.productEdit.uploadDialog.selectFile', '选择文件')}
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple hidden />
        </Box>

        {/* Already uploaded */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
            {t('admin.productEdit.uploadDialog.uploaded', '已上传图片')} ({mockImages.length}/5)
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>
            {t('admin.productEdit.uploadDialog.selectHint', '点击选择，可多选')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {mockImages.map((img) => {
            const Ic = img.icon;
            const isSel = selected.has(img.id);
            return (
              <Box key={img.id} onClick={() => toggle(img.id)}
                sx={{
                  width: 80, height: 80, borderRadius: '8px', bgcolor: img.bg,
                  cursor: 'pointer', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: isSel ? '2px solid #2563EB' : '2px solid transparent',
                  '&:hover': { opacity: 0.85 },
                }}>
                <Ic sx={{ fontSize: 36, color: img.color }} />
                {isSel && (
                  <CheckCircleIcon sx={{ position: 'absolute', top: 4, right: 4, fontSize: 18, color: '#2563EB' }} />
                )}
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={onClose}
          sx={{ borderRadius: '8px', textTransform: 'none', borderColor: '#E2E8F0', color: '#475569' }}>
          {t('admin.productEdit.uploadDialog.cancel', '取消')}
        </Button>
        <Button variant="contained" onClick={() => onConfirm([...selected])}
          sx={{ borderRadius: '8px', textTransform: 'none' }}>
          {t('admin.productEdit.uploadDialog.confirm', '确认选择')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Field label helper ─────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#374151', mb: 0.75 }}>
      {children}
      {required && <Typography component="span" sx={{ color: '#EF4444', ml: 0.25 }}>*</Typography>}
    </Typography>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isNew = id === 'new';
  const existing = id && !isNew ? MOCK_PRODUCTS[id] : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [sku, setSku] = useState(existing?.sku ?? '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [brand, setBrand] = useState(existing?.brand ?? '');
  const [points, setPoints] = useState(String(existing?.points ?? ''));
  const [originalPrice, setOriginalPrice] = useState(String(existing?.originalPrice ?? ''));
  const [description, setDescription] = useState(existing?.description ?? '');
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    existing?.specs?.length ? existing.specs : [{ key: '', value: '' }]
  );
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleAddSpec = () => setSpecs((p) => [...p, { key: '', value: '' }]);
  const handleRemoveSpec = (i: number) => setSpecs((p) => p.filter((_, idx) => idx !== i));
  const handleSpecChange = (i: number, field: 'key' | 'value', val: string) =>
    setSpecs((p) => p.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const handleSave = () => {
    // TODO: call product service
    navigate('/admin/products');
  };

  const CARD_SX = {
    borderRadius: '10px',
    border: '1px solid #E8EDF2',
    bgcolor: '#fff',
    overflow: 'hidden',
  };

  const INPUT_SX = { '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 14 } };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: '32px', bgcolor: '#F8FAFC', minHeight: '100%' }}>

      {/* ── Header ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: breadcrumb + title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Breadcrumbs sx={{ fontSize: 13 }}>
            <Link component={RouterLink} to="/admin/products" underline="hover"
              sx={{ fontSize: 13, color: '#64748B' }}>
              {t('admin.products.title', '产品管理')}
            </Link>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>
              {isNew
                ? t('admin.productEdit.breadcrumbNew', '新增商品')
                : t('admin.productEdit.breadcrumbEdit', '编辑商品')}
            </Typography>
          </Breadcrumbs>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>
            {isNew
              ? t('admin.productEdit.titleNew', '新增商品信息')
              : t('admin.productEdit.titleEdit', '编辑商品信息')}
          </Typography>
        </Box>

        {/* Right: actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button variant="outlined" onClick={() => navigate('/admin/products')}
            sx={{
              borderRadius: '8px', textTransform: 'none', fontSize: 14,
              borderColor: '#E2E8F0', color: '#475569',
              '&:hover': { borderColor: '#CBD5E1', bgcolor: '#F8FAFC' },
            }}>
            {t('admin.productEdit.cancel', '返回')}
          </Button>
          <Button variant="contained" onClick={handleSave}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: 14, px: 2.5 }}>
            {t('admin.productEdit.save', '保存商品')}
          </Button>
          {/* Avatar circle (matches design) */}
          <Box sx={{
            width: 40, height: 40, borderRadius: '50%', bgcolor: '#2563EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>A</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── 基本信息 ── */}
      <Paper elevation={0} sx={CARD_SX}>
        <Box sx={{ px: 3, pt: 2.5, pb: 2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B', mb: 2 }}>
            {t('admin.productEdit.basicInfo', '基本信息')}
          </Typography>
          <Divider sx={{ borderColor: '#F1F5F9', mb: 2.5 }} />

          {/* Row 1: name + sku */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, mb: 2.5 }}>
            <Box>
              <FieldLabel required>{t('admin.productEdit.name', '商品名称')}</FieldLabel>
              <TextField fullWidth size="small" value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('admin.productEdit.namePlaceholder', '请输入商品名称')}
                sx={INPUT_SX} />
            </Box>
            <Box>
              <FieldLabel>{t('admin.productEdit.sku', '商品序号 (SKU)')}</FieldLabel>
              <TextField fullWidth size="small" value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU-XXXX-XXXX-XXXX-XXXX"
                sx={INPUT_SX} />
            </Box>
          </Box>

          {/* Row 2: category + brand */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, mb: 2.5 }}>
            <Box>
              <FieldLabel required>{t('admin.productEdit.category', '商品分类 / 标签组')}</FieldLabel>
              <FormControl fullWidth size="small">
                <Select value={category} onChange={(e) => setCategory(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '8px', fontSize: 14 }}>
                  <MenuItem value="" disabled>
                    <Typography sx={{ color: '#94A3B8', fontSize: 14 }}>
                      {t('admin.productEdit.categoryPlaceholder', '请选择分类')}
                    </Typography>
                  </MenuItem>
                  {CATEGORIES.map((c) => <MenuItem key={c} value={c} sx={{ fontSize: 14 }}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FieldLabel>{t('admin.productEdit.brand', '品牌')}</FieldLabel>
              <TextField fullWidth size="small" value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Sony"
                sx={INPUT_SX} />
            </Box>
          </Box>

          {/* Row 3: points + original price (matches design — 2 cols, no stock here) */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
            <Box>
              <FieldLabel required>{t('admin.productEdit.points', '积分价格')}</FieldLabel>
              <TextField fullWidth size="small" value={points} type="number"
                onChange={(e) => setPoints(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">积分</InputAdornment> }}
                sx={INPUT_SX} />
            </Box>
            <Box>
              <FieldLabel>{t('admin.productEdit.originalPrice', '原始市场价（参考）')}</FieldLabel>
              <TextField fullWidth size="small" value={originalPrice} type="number"
                onChange={(e) => setOriginalPrice(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">元</InputAdornment> }}
                sx={INPUT_SX} />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* ── 商品描述 ── */}
      <Paper elevation={0} sx={CARD_SX}>
        <Box sx={{ px: 3, pt: 2.5, pb: 2.5 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B', mb: 2 }}>
            {t('admin.productEdit.description', '商品描述')}
          </Typography>
          <Divider sx={{ borderColor: '#F1F5F9', mb: 2 }} />

          {/* Toolbar */}
          <Box sx={{ display: 'flex', gap: 0.5, mb: 0 }}>
            {[FormatBoldIcon, FormatItalicIcon, FormatUnderlinedIcon, FormatListBulletedIcon].map((Ic, i) => (
              <IconButton key={i} size="small"
                sx={{ borderRadius: '6px', width: 32, height: 32, '&:hover': { bgcolor: '#F1F5F9' } }}>
                <Ic sx={{ fontSize: 18, color: '#64748B' }} />
              </IconButton>
            ))}
          </Box>

          <TextField fullWidth multiline minRows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('admin.productEdit.descriptionPlaceholder', '请输入商品描述...')}
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 14, lineHeight: 1.7 },
            }} />
        </Box>
      </Paper>

      {/* ── 规格参数 ── */}
      <Paper elevation={0} sx={CARD_SX}>
        <Box sx={{ px: 3, pt: 2.5, pb: 2.5 }}>
          {/* Header row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
              {t('admin.productEdit.specs', '规格参数')}
            </Typography>
            <Button variant="outlined" size="small" startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              onClick={handleAddSpec}
              sx={{
                borderRadius: '6px', textTransform: 'none', fontSize: 13,
                borderColor: '#2563EB', color: '#2563EB', py: '4px', px: '10px',
                '&:hover': { bgcolor: '#EFF6FF' },
              }}>
              {t('admin.productEdit.addSpec', '成品规格')}
            </Button>
          </Box>
          <Divider sx={{ borderColor: '#F1F5F9', mb: 2 }} />

          {/* Spec rows */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {specs.map((spec, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '160px 1fr 28px', gap: 1.5, alignItems: 'center' }}>
                <TextField size="small" value={spec.key}
                  onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                  placeholder={t('admin.productEdit.specKey', '规格名称')}
                  sx={INPUT_SX} />
                <TextField size="small" value={spec.value}
                  onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                  placeholder={t('admin.productEdit.specValue', '规格值')}
                  sx={INPUT_SX} />
                <Box onClick={() => specs.length > 1 && handleRemoveSpec(i)}
                  sx={{
                    width: 28, height: 28, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: specs.length > 1 ? 'pointer' : 'default',
                    bgcolor: specs.length > 1 ? '#FEF2F2' : '#F8FAFC',
                    '&:hover': specs.length > 1 ? { bgcolor: '#FEE2E2' } : {},
                  }}>
                  <DeleteOutlineIcon sx={{ fontSize: 16, color: specs.length > 1 ? '#EF4444' : '#CBD5E1' }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* ── Bottom action bar ── */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pb: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/admin/products')}
          sx={{
            borderRadius: '8px', textTransform: 'none', fontSize: 14,
            borderColor: '#E2E8F0', color: '#475569',
          }}>
          {t('admin.productEdit.cancel', '返回')}
        </Button>
        <Button variant="contained" onClick={handleSave}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: 14, px: 4 }}>
          {t('admin.productEdit.save', '保存商品')}
        </Button>
      </Box>

      {/* Upload dialog */}
      <UploadImageDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onConfirm={() => setUploadOpen(false)}
        productIcon={existing?.icon ?? HeadphonesIcon}
        productIconColor={existing?.iconColor ?? '#2563EB'}
        productIconBg={existing?.iconBg ?? '#DBEAFE'}
      />
    </Box>
  );
}

import { useState, useEffect, useRef } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ImageIcon from '@mui/icons-material/Image';
import { useProductStore } from '../../stores/product.store';
import { productService } from '../../services/product.service';

// ── Upload Image Dialog ────────────────────────────────────────────────────

function UploadImageDialog({
  open, onClose, onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (url: string) => void;
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await productService.uploadProductImage(file);
      const url = result.url;
      setUploadedUrls((prev) => {
        const next = [...prev, url];
        setSelected(next.length - 1);
        return next;
      });
    } catch {
      setError(t('admin.productEdit.uploadDialog.uploadError', '上传失败，请重试'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setUploadedUrls([]);
    setSelected(null);
    setError(null);
    onClose();
  };

  const handleConfirm = () => {
    if (selected !== null && uploadedUrls[selected]) {
      onConfirm(uploadedUrls[selected]);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>
          {t('admin.productEdit.uploadDialog.title', '上传商品图片')}
        </Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

        {/* Drop zone */}
        <Box onClick={() => fileInputRef.current?.click()}
          sx={{ border: '2px dashed #CBD5E1', borderRadius: '10px', bgcolor: '#F8FAFC', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, cursor: 'pointer', mb: 2.5, '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF' } }}>
          {uploading ? (
            <CircularProgress size={36} />
          ) : (
            <>
              <CloudUploadIcon sx={{ fontSize: 36, color: '#94A3B8' }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>
                {t('admin.productEdit.uploadDialog.dropHint', '将图片拖拽至此处，或点击上传')}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>
                {t('admin.productEdit.uploadDialog.formatHint', '支持 JPG、PNG、WebP 格式，单张不超过 5 MB')}
              </Typography>
              <Button variant="outlined" size="small" sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, mt: 0.5 }}>
                {t('admin.productEdit.uploadDialog.selectFile', '选择文件')}
              </Button>
            </>
          )}
        </Box>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />

        {uploadedUrls.length > 0 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
                {t('admin.productEdit.uploadDialog.uploaded', '已上传图片')} ({uploadedUrls.length}/5)
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>
                {t('admin.productEdit.uploadDialog.selectHint', '点击选择，可多选')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {uploadedUrls.map((url, i) => {
                const isSel = selected === i;
                return (
                  <Box key={i} onClick={() => setSelected(i)}
                    sx={{ width: 80, height: 80, borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', position: 'relative', border: isSel ? '2px solid #2563EB' : '2px solid transparent', '&:hover': { opacity: 0.85 } }}>
                    <Box component="img" src={url} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {isSel && <CheckCircleIcon sx={{ position: 'absolute', top: 4, right: 4, fontSize: 18, color: '#2563EB' }} />}
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={handleClose}
          sx={{ borderRadius: '8px', textTransform: 'none', borderColor: '#E2E8F0', color: '#475569' }}>
          {t('admin.productEdit.uploadDialog.cancel', '取消')}
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={selected === null}
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

  const {
    adminCurrentProduct,
    adminLoading,
    adminError,
    fetchAdminProductById,
    createAdminProduct,
    updateAdminProduct,
    clearAdminError,
    categories,
    fetchCategories,
  } = useProductStore();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [points, setPoints] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load categories for dropdown
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // In edit mode: fetch product and pre-fill form
  useEffect(() => {
    if (!isNew && id) {
      fetchAdminProductById(id);
    }
  }, [id, isNew, fetchAdminProductById]);

  // Pre-fill form when product loads
  useEffect(() => {
    if (!isNew && adminCurrentProduct) {
      const p = adminCurrentProduct;
      setName(p.name ?? '');
      setSku(p.sku ?? '');
      setCategoryId(p.categoryId != null ? String(p.categoryId) : '');
      setBrand(p.brand ?? '');
      setPoints(String(p.pointsCost ?? ''));
      setOriginalPrice(p.originalPrice != null ? String(p.originalPrice) : '');
      setStock(String(p.stock ?? ''));
      setDescription(p.description ?? '');
      setImageUrl(p.imageUrl ?? '');
      setSpecs(p.specs?.length ? p.specs : [{ key: '', value: '' }]);
    }
  }, [isNew, adminCurrentProduct]);

  const handleAddSpec = () => setSpecs((p) => [...p, { key: '', value: '' }]);
  const handleRemoveSpec = (i: number) => setSpecs((p) => p.filter((_, idx) => idx !== i));
  const handleSpecChange = (i: number, field: 'key' | 'value', val: string) =>
    setSpecs((p) => p.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));

  const handleSave = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload = {
        name,
        sku: sku || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        brand: brand || undefined,
        pointsCost: points ? Number(points) : 0,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        stock: stock ? Number(stock) : 0,
        description: description || undefined,
        imageUrl: imageUrl || undefined,
        specs: specs.filter((s) => s.key || s.value),
      };
      if (isNew) {
        await createAdminProduct(payload);
      } else if (id) {
        await updateAdminProduct(id, payload);
      }
      navigate('/admin/products');
    } catch (e: unknown) {
      setSubmitError((e as Error).message ?? t('admin.productEdit.saveError', '保存失败，请重试'));
    } finally {
      setSubmitting(false);
    }
  };

  const CARD_SX = { borderRadius: '10px', border: '1px solid #E8EDF2', bgcolor: '#fff', overflow: 'hidden' };
  const INPUT_SX = { '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 14 } };

  // Show loading skeleton while fetching in edit mode
  if (!isNew && adminLoading && !adminCurrentProduct) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Top-level categories for dropdown
  const topCategories = categories.filter((c) => !c.parentId);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: '32px', bgcolor: '#F8FAFC', minHeight: '100%' }}>

      {/* ── Header ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Breadcrumbs sx={{ fontSize: 13 }}>
            <Link component={RouterLink} to="/admin/products" underline="hover" sx={{ fontSize: 13, color: '#64748B' }}>
              {t('admin.products.title', '产品管理')}
            </Link>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>
              {isNew ? t('admin.productEdit.breadcrumbNew', '新增商品') : t('admin.productEdit.breadcrumbEdit', '编辑商品')}
            </Typography>
          </Breadcrumbs>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>
            {isNew ? t('admin.productEdit.titleNew', '新增商品信息') : t('admin.productEdit.titleEdit', '编辑商品信息')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button variant="outlined" onClick={() => navigate('/admin/products')} disabled={submitting}
            sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 14, borderColor: '#E2E8F0', color: '#475569', '&:hover': { borderColor: '#CBD5E1', bgcolor: '#F8FAFC' } }}>
            {t('admin.productEdit.cancel', '返回')}
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={submitting || !name}
            startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : undefined}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: 14, px: 2.5 }}>
            {t('admin.productEdit.save', '保存商品')}
          </Button>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>A</Typography>
          </Box>
        </Box>
      </Box>

      {/* Errors */}
      {(submitError || adminError) && (
        <Alert severity="error" onClose={() => { setSubmitError(null); clearAdminError(); }}>
          {submitError ?? adminError}
        </Alert>
      )}

      {/* ── 商品图片 ── */}
      <Paper elevation={0} sx={CARD_SX}>
        <Box sx={{ px: 3, pt: 2.5, pb: 2.5 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B', mb: 2 }}>
            {t('admin.productEdit.images', '商品图片')}
          </Typography>
          <Divider sx={{ borderColor: '#F1F5F9', mb: 2.5 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 100, height: 100, borderRadius: '8px', bgcolor: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {imageUrl ? (
                <Box component="img" src={imageUrl} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ImageIcon sx={{ fontSize: 36, color: '#CBD5E1' }} />
              )}
            </Box>
            <Button variant="outlined" size="small" onClick={() => setUploadOpen(true)}
              sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, borderColor: '#2563EB', color: '#2563EB', '&:hover': { bgcolor: '#EFF6FF' } }}>
              {t('admin.productEdit.uploadImage', '上传图片')}
            </Button>
            {imageUrl && (
              <Button variant="text" size="small" onClick={() => setImageUrl('')}
                sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, color: '#EF4444' }}>
                {t('admin.productEdit.removeImage', '移除图片')}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

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
              <TextField fullWidth size="small" value={name} onChange={(e) => setName(e.target.value)}
                placeholder={t('admin.productEdit.namePlaceholder', '请输入商品名称')} sx={INPUT_SX} />
            </Box>
            <Box>
              <FieldLabel>{t('admin.productEdit.sku', '商品序号 (SKU)')}</FieldLabel>
              <TextField fullWidth size="small" value={sku} onChange={(e) => setSku(e.target.value)}
                placeholder="SKU-XXXX-XXXX-XXXX-XXXX" sx={INPUT_SX} />
            </Box>
          </Box>

          {/* Row 2: category + brand */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, mb: 2.5 }}>
            <Box>
              <FieldLabel required>{t('admin.productEdit.category', '商品分类 / 标签组')}</FieldLabel>
              <FormControl fullWidth size="small">
                <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} displayEmpty
                  sx={{ borderRadius: '8px', fontSize: 14 }}>
                  <MenuItem value="" disabled>
                    <Typography sx={{ color: '#94A3B8', fontSize: 14 }}>
                      {t('admin.productEdit.categoryPlaceholder', '请选择分类')}
                    </Typography>
                  </MenuItem>
                  {topCategories.map((c) => (
                    <MenuItem key={c.id} value={String(c.id)} sx={{ fontSize: 14 }}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FieldLabel>{t('admin.productEdit.brand', '品牌')}</FieldLabel>
              <TextField fullWidth size="small" value={brand} onChange={(e) => setBrand(e.target.value)}
                placeholder="Sony" sx={INPUT_SX} />
            </Box>
          </Box>

          {/* Row 3: points + original price + stock */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2.5 }}>
            <Box>
              <FieldLabel required>{t('admin.productEdit.points', '积分价格')}</FieldLabel>
              <TextField fullWidth size="small" value={points} type="number" onChange={(e) => setPoints(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">积分</InputAdornment> }} sx={INPUT_SX} />
            </Box>
            <Box>
              <FieldLabel>{t('admin.productEdit.originalPrice', '原始市场价（参考）')}</FieldLabel>
              <TextField fullWidth size="small" value={originalPrice} type="number" onChange={(e) => setOriginalPrice(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">元</InputAdornment> }} sx={INPUT_SX} />
            </Box>
            <Box>
              <FieldLabel required>{t('admin.productEdit.stock', '库存数量')}</FieldLabel>
              <TextField fullWidth size="small" value={stock} type="number" onChange={(e) => setStock(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">件</InputAdornment> }} sx={INPUT_SX} />
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
          <Box sx={{ display: 'flex', gap: 0.5, mb: 0 }}>
            {[FormatBoldIcon, FormatItalicIcon, FormatUnderlinedIcon, FormatListBulletedIcon].map((Ic, i) => (
              <IconButton key={i} size="small" sx={{ borderRadius: '6px', width: 32, height: 32, '&:hover': { bgcolor: '#F1F5F9' } }}>
                <Ic sx={{ fontSize: 18, color: '#64748B' }} />
              </IconButton>
            ))}
          </Box>
          <TextField fullWidth multiline minRows={4} value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder={t('admin.productEdit.descriptionPlaceholder', '请输入商品描述...')}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 14, lineHeight: 1.7 } }} />
        </Box>
      </Paper>

      {/* ── 规格参数 ── */}
      <Paper elevation={0} sx={CARD_SX}>
        <Box sx={{ px: 3, pt: 2.5, pb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
              {t('admin.productEdit.specs', '规格参数')}
            </Typography>
            <Button variant="outlined" size="small" startIcon={<AddIcon sx={{ fontSize: 14 }} />} onClick={handleAddSpec}
              sx={{ borderRadius: '6px', textTransform: 'none', fontSize: 13, borderColor: '#2563EB', color: '#2563EB', py: '4px', px: '10px', '&:hover': { bgcolor: '#EFF6FF' } }}>
              {t('admin.productEdit.addSpec', '成品规格')}
            </Button>
          </Box>
          <Divider sx={{ borderColor: '#F1F5F9', mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {specs.map((spec, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '160px 1fr 28px', gap: 1.5, alignItems: 'center' }}>
                <TextField size="small" value={spec.key} onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                  placeholder={t('admin.productEdit.specKey', '规格名称')} sx={INPUT_SX} />
                <TextField size="small" value={spec.value} onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                  placeholder={t('admin.productEdit.specValue', '规格值')} sx={INPUT_SX} />
                <Box onClick={() => specs.length > 1 && handleRemoveSpec(i)}
                  sx={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: specs.length > 1 ? 'pointer' : 'default', bgcolor: specs.length > 1 ? '#FEF2F2' : '#F8FAFC', '&:hover': specs.length > 1 ? { bgcolor: '#FEE2E2' } : {} }}>
                  <DeleteOutlineIcon sx={{ fontSize: 16, color: specs.length > 1 ? '#EF4444' : '#CBD5E1' }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* ── Bottom action bar ── */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pb: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/admin/products')} disabled={submitting}
          sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 14, borderColor: '#E2E8F0', color: '#475569' }}>
          {t('admin.productEdit.cancel', '返回')}
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={submitting || !name}
          startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : undefined}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: 14, px: 4 }}>
          {t('admin.productEdit.save', '保存商品')}
        </Button>
      </Box>

      {/* Upload dialog */}
      <UploadImageDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onConfirm={(url) => { setImageUrl(url); setUploadOpen(false); }}
      />
    </Box>
  );
}

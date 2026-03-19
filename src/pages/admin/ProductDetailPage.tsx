import { useState, useEffect, useRef } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import { useProductStore } from '../../stores/product.store';
import { productService } from '../../services/product.service';
import type { Product } from '../../types/product.types';

// ── Upload Image Dialog ───────────────────────────────────────────────────

function UploadImageDialog({
  open, onClose, onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  onUploaded?: (url: string) => void;
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await productService.uploadProductImage(file);
      const url = result.url;
      setUploadedUrls((prev) => [...prev, url]);
      onUploaded?.(url);
    } catch {
      setError(t('admin.productDetail.uploadError', '上传失败，请重试'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setUploadedUrls([]);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={false}
      PaperProps={{ sx: { width: 560, borderRadius: '16px', boxShadow: '0 24px 64px -4px rgba(0,0,0,0.30)' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5, borderBottom: '1px solid #E2E8F0' }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
          {t('admin.productDetail.uploadImageTitle', '上传商品图片')}
        </Typography>
        <Box component="button" onClick={handleClose} sx={{ width: 28, height: 28, borderRadius: '14px', border: 'none', bgcolor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#F1F5F9' } }}>
          <CloseIcon sx={{ fontSize: 20, color: '#64748B' }} />
        </Box>
      </Box>

      <Box sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

        {/* Drop zone */}
        <Box onClick={() => fileInputRef.current?.click()}
          sx={{ height: 160, borderRadius: '12px', bgcolor: '#EFF6FF', border: '2px solid #2563EB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, cursor: 'pointer', '&:hover': { bgcolor: '#DBEAFE' } }}>
          {uploading ? (
            <CircularProgress size={32} />
          ) : (
            <>
              <Box sx={{ width: 48, height: 48, borderRadius: '24px', bgcolor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CloudUploadIcon sx={{ fontSize: 24, color: '#2563EB' }} />
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                {t('admin.productDetail.dropZoneText', '拖拽图片到此处，或点击上传')}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#64748B' }}>
                {t('admin.productDetail.dropZoneHint', '支持 JPG、PNG 格式，单张不超过 5MB，最多上传 10 张')}
              </Typography>
              <Box component="button" sx={{ px: 2, py: 0.75, borderRadius: '8px', border: 'none', bgcolor: '#2563EB', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', '&:hover': { bgcolor: '#1D4ED8' } }}>
                {t('admin.productDetail.selectFile', '选择文件')}
              </Box>
            </>
          )}
        </Box>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />

        {/* Preview */}
        {uploadedUrls.length > 0 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>
                {t('admin.productDetail.uploadedImages', '已上传图片')} ({uploadedUrls.length}/10)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {uploadedUrls.map((url, i) => (
                <Box key={i} sx={{ width: 120, height: 120, borderRadius: '8px', overflow: 'hidden', border: i === 0 ? '2px solid #2563EB' : '1px solid #E2E8F0', flexShrink: 0 }}>
                  <Box component="img" src={url} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.25, px: 3, py: 2.5, borderTop: '1px solid #E2E8F0' }}>
        <Box component="button" onClick={handleClose} sx={{ px: 2.5, py: 1.25, borderRadius: '8px', border: '1px solid #E2E8F0', bgcolor: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#1E293B', '&:hover': { bgcolor: '#F8FAFC' } }}>
          {t('common.cancel', '取消')}
        </Box>
        <Box component="button" onClick={handleClose} sx={{ px: 2.5, py: 1.25, borderRadius: '8px', border: 'none', bgcolor: '#2563EB', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#fff', '&:hover': { bgcolor: '#1D4ED8' } }}>
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
  product: Pick<Product, 'name' | 'sku' | 'stock'>;
}) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}
      PaperProps={{ sx: { width: 440, borderRadius: '16px', boxShadow: '0 24px 64px -4px rgba(0,0,0,0.30)' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5, borderBottom: '1px solid #E2E8F0' }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
          {t('admin.productDetail.deactivateTitle', '确认下架商品')}
        </Typography>
        <Box component="button" onClick={onClose} sx={{ width: 28, height: 28, borderRadius: '14px', border: 'none', bgcolor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#F1F5F9' } }}>
          <CloseIcon sx={{ fontSize: 20, color: '#64748B' }} />
        </Box>
      </Box>
      <Box sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '28px', bgcolor: '#FEF3C7', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#F8FAFC', borderRadius: '8px', p: 2 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '8px', bgcolor: '#F1F5F9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon sx={{ fontSize: 22, color: '#94A3B8' }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{product.name}</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748B' }}>
              {product.sku ?? '—'} · {t('admin.productDetail.fieldStock', '库存')} {product.stock} {t('admin.productDetail.unit', '件')}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.25, px: 3, py: 2.5, borderTop: '1px solid #E2E8F0' }}>
        <Box component="button" onClick={onClose} sx={{ px: 2.5, py: 1.25, borderRadius: '8px', border: '1px solid #E2E8F0', bgcolor: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#1E293B', '&:hover': { bgcolor: '#F8FAFC' } }}>
          {t('common.cancel', '取消')}
        </Box>
        <Box component="button" onClick={onConfirm} sx={{ px: 2.5, py: 1.25, borderRadius: '8px', border: 'none', bgcolor: '#F59E0B', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#fff', '&:hover': { bgcolor: '#D97706' } }}>
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
  onConfirm: (newStock: number) => void;
}) {
  const { t } = useTranslation();
  const [type, setType] = useState<'in' | 'out'>('in');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');

  const qtyNum = parseInt(qty, 10);
  const delta = !isNaN(qtyNum) && qtyNum > 0 ? (type === 'in' ? qtyNum : -qtyNum) : 0;
  const newStock = currentStock + delta;

  const handleClose = () => { setType('in'); setQty(''); setReason(''); onClose(); };
  const handleConfirm = () => {
    if (!isNaN(qtyNum) && qtyNum > 0) { onConfirm(newStock); setType('in'); setQty(''); setReason(''); }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={false}
      PaperProps={{ sx: { width: 480, borderRadius: '16px', boxShadow: '0 24px 64px -4px rgba(0,0,0,0.30)' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5, borderBottom: '1px solid #E2E8F0' }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>{t('admin.productDetail.adjustStock', '调整库存')}</Typography>
        <Box component="button" onClick={handleClose} sx={{ width: 28, height: 28, borderRadius: '14px', border: 'none', bgcolor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#F1F5F9' } }}>
          <CloseIcon sx={{ fontSize: 20, color: '#64748B' }} />
        </Box>
      </Box>
      <Box sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#F8FAFC', borderRadius: '8px', px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>{t('admin.productDetail.currentStock', '当前库存')}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#16A34A' }}>{currentStock}</Typography>
            <Typography sx={{ fontSize: 14, color: '#64748B' }}>{t('admin.productDetail.unit', '件')}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{t('admin.productDetail.adjustType', '调整类型')}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {(['in', 'out'] as const).map((opt) => (
              <Box key={opt} component="button" onClick={() => setType(opt)} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, border: 'none', bgcolor: 'transparent', cursor: 'pointer', p: 0 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: type === opt ? '5px solid #2563EB' : '2px solid #CBD5E1', bgcolor: '#fff' }} />
                <Typography sx={{ fontSize: 13, color: '#1E293B' }}>
                  {opt === 'in' ? t('admin.productDetail.adjustIn', '入库（增加）') : t('admin.productDetail.adjustOut', '出库（减少）')}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{t('admin.productDetail.adjustQty', '调整数量')}</Typography>
          <Box component="input" type="number" min={1} value={qty} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQty(e.target.value)} placeholder="50"
            sx={{ height: 40, borderRadius: '8px', px: 1.5, border: '2px solid #2563EB', outline: 'none', fontSize: 14, fontWeight: 500, color: '#1E293B', width: '100%', boxSizing: 'border-box' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{t('admin.productDetail.adjustReason', '调整原因')}</Typography>
          <Box component="textarea" rows={3} value={reason} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
            placeholder={t('admin.productDetail.adjustReasonPlaceholder', '如：新一批采购到货入库')}
            sx={{ borderRadius: '8px', px: 1.5, py: 1.25, border: '1px solid #E2E8F0', outline: 'none', resize: 'none', fontSize: 13, color: '#1E293B', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', '&:focus': { borderColor: '#2563EB' } }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#EFF6FF', borderRadius: '8px', px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>{t('admin.productDetail.adjustPreview', '调整后库存')}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 14, color: '#94A3B8' }}>{currentStock}</Typography>
            <Typography sx={{ fontSize: 14, color: '#94A3B8' }}>→</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>{delta !== 0 ? newStock : '—'}</Typography>
            {delta !== 0 && <Typography sx={{ fontSize: 14, color: '#64748B' }}>{t('admin.productDetail.unit', '件')}</Typography>}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.25, px: 3, py: 2.5, borderTop: '1px solid #E2E8F0' }}>
        <Box component="button" onClick={handleClose} sx={{ px: 2.5, py: 1.25, borderRadius: '8px', border: '1px solid #E2E8F0', bgcolor: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#1E293B', '&:hover': { bgcolor: '#F8FAFC' } }}>
          {t('common.cancel', '取消')}
        </Box>
        <Box component="button" onClick={handleConfirm} sx={{ px: 2.5, py: 1.25, borderRadius: '8px', border: 'none', bgcolor: '#2563EB', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#fff', '&:hover': { bgcolor: '#1D4ED8' } }}>
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

  const { adminCurrentProduct, adminLoading, adminError, fetchAdminProductById, updateAdminProduct, deleteAdminProduct, clearAdminError } = useProductStore();

  const [activeThumb, setActiveThumb] = useState(0);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    if (id) fetchAdminProductById(id);
  }, [id, fetchAdminProductById]);

  const product = adminCurrentProduct;
  const isActive = product?.status === 'ACTIVE' || product?.status === 'active';

  const handleToggleStatus = async () => {
    if (!product || !id) return;
    const newStatus = isActive ? 'INACTIVE' : 'ACTIVE';
    await updateAdminProduct(id, { status: newStatus as Product['status'] });
  };

  const handleDeactivateConfirm = async () => {
    if (!id) return;
    await updateAdminProduct(id, { status: 'INACTIVE' as Product['status'] });
    setDeactivateDialogOpen(false);
  };

  const handleStockConfirm = async (newStock: number) => {
    if (!id) return;
    await updateAdminProduct(id, { stock: newStock });
    setStockDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!product || !id) return;
    if (window.confirm(t('admin.productDetail.confirmDelete', `确认删除「${product.name}」？此操作不可撤销。`))) {
      await deleteAdminProduct(id);
      navigate('/admin/products');
    }
  };

  const CARD_SX = { borderRadius: '10px', border: '1px solid #E8EDF2', bgcolor: '#fff', overflow: 'hidden' };

  if (adminLoading && !product) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (adminError && !product) {
    return (
      <Box sx={{ p: '32px' }}>
        <Alert severity="error" onClose={clearAdminError}>{adminError}</Alert>
      </Box>
    );
  }

  if (!product) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: '32px', bgcolor: '#F8FAFC', minHeight: '100%' }}>

      {/* ── Page Header ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Breadcrumbs sx={{ fontSize: 13 }}>
            <Link component={RouterLink} to="/admin/products" underline="hover" sx={{ fontSize: 13, color: '#64748B' }}>
              {t('admin.products.title', '产品管理')}
            </Link>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>{t('admin.productDetail.breadcrumb', '商品详情')}</Typography>
          </Breadcrumbs>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>{product.name}</Typography>
            <Chip
              label={isActive ? t('admin.productDetail.statusActive', '已上架') : t('admin.productDetail.statusInactive', '已下架')}
              size="small"
              sx={{ borderRadius: '12px', fontWeight: 600, fontSize: 12, bgcolor: isActive ? '#DCFCE7' : '#F1F5F9', color: isActive ? '#166534' : '#64748B', height: 26 }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Button variant="outlined" size="small" startIcon={<VisibilityOffIcon sx={{ fontSize: 16 }} />}
            onClick={isActive ? () => setDeactivateDialogOpen(true) : handleToggleStatus}
            disabled={adminLoading}
            sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 500, borderColor: '#F59E0B', color: '#F59E0B', '&:hover': { bgcolor: '#FFFBEB', borderColor: '#F59E0B' } }}>
            {isActive ? t('admin.productDetail.btnShelf', '下架') : t('admin.productDetail.btnOnShelf', '上架')}
          </Button>
          <Button variant="outlined" size="small" startIcon={<InventoryIcon sx={{ fontSize: 16 }} />}
            onClick={() => setStockDialogOpen(true)}
            sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 500, borderColor: '#E2E8F0', color: '#1E293B', '&:hover': { bgcolor: '#F8FAFC' } }}>
            {t('admin.productDetail.btnStock', '调整库存')}
          </Button>
          <Button variant="contained" size="small" startIcon={<EditIcon sx={{ fontSize: 16 }} />}
            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
            sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
            {t('admin.productDetail.btnEdit', '编辑商品')}
          </Button>
          <Button variant="outlined" size="small" startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
            onClick={handleDelete} disabled={adminLoading}
            sx={{ borderRadius: '8px', textTransform: 'none', fontSize: 13, fontWeight: 500, borderColor: '#EF4444', color: '#EF4444', '&:hover': { bgcolor: '#FEF2F2', borderColor: '#EF4444' } }}>
            {t('admin.productDetail.btnDelete', '删除')}
          </Button>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#2563EB', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>A</Typography>
          </Box>
        </Box>
      </Box>

      {adminError && (
        <Alert severity="error" onClose={clearAdminError}>{adminError}</Alert>
      )}

      {/* ── Content Row: image card + info card ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 3 }}>

        {/* Image Card */}
        <Paper elevation={0} sx={CARD_SX}>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>{t('admin.productDetail.images', '商品图片')}</Typography>
              <Button variant="outlined" size="small" startIcon={<AddPhotoAlternateIcon sx={{ fontSize: 14 }} />}
                onClick={() => setUploadDialogOpen(true)}
                sx={{ borderRadius: '6px', textTransform: 'none', fontSize: 12, borderColor: '#2563EB', color: '#2563EB', py: '4px', px: '10px', '&:hover': { bgcolor: '#EFF6FF' } }}>
                {t('admin.productDetail.uploadImage', '上传图片')}
              </Button>
            </Box>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            {/* Main image */}
            <Box sx={{ height: 300, borderRadius: '8px', bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {product.imageUrl ? (
                <Box component="img" src={product.imageUrl} alt={product.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ImageIcon sx={{ fontSize: 100, color: '#CBD5E1' }} />
              )}
            </Box>
            {/* Thumbnails */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[0, 1, 2].map((i) => (
                <Box key={i} onClick={() => setActiveThumb(i)}
                  sx={{ width: 80, height: 80, borderRadius: '8px', bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, border: activeThumb === i ? '2px solid #2563EB' : '1px solid #E2E8F0', overflow: 'hidden' }}>
                  {product.imageUrl && i === 0 ? (
                    <Box component="img" src={product.imageUrl} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon sx={{ fontSize: 28, color: '#CBD5E1' }} />
                  )}
                </Box>
              ))}
              <Box sx={{ width: 80, height: 80, borderRadius: '8px', border: '1px solid #E2E8F0', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF' } }}>
                <AddIcon sx={{ fontSize: 24, color: '#94A3B8' }} />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Info Card */}
        <Paper elevation={0} sx={CARD_SX}>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>{t('admin.productDetail.basicInfo', '基本信息')}</Typography>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <InfoField label={t('admin.productDetail.fieldName', '商品名称')} value={product.name} />
                <InfoField label={t('admin.productDetail.fieldSku', '商品编号 (SKU)')} value={product.sku ?? '—'} />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <InfoField label={t('admin.productDetail.fieldCategory', '商品分类')} value={product.categoryName ?? '—'} />
                <InfoField label={t('admin.productDetail.fieldBrand', '品牌')} value={product.brand ?? '—'} />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <InfoField
                  label={t('admin.productDetail.fieldPoints', '积分价格')}
                  value={<Typography sx={{ fontSize: 18, fontWeight: 700, color: '#2563EB' }}>{product.pointsCost.toLocaleString()} {t('employee.pointsUnit', '积分')}</Typography>}
                />
                <InfoField
                  label={t('admin.productDetail.fieldMarket', '市场参考价')}
                  value={product.originalPrice != null ? `¥ ${product.originalPrice.toLocaleString()}.00` : '—'}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <InfoField
                  label={t('admin.productDetail.fieldStock', '当前库存')}
                  value={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>{product.stock} {t('admin.productDetail.unit', '件')}</Typography>
                      {product.stock <= 20 && (
                        <Chip label={t('admin.productDetail.lowStock', '库存紧张')} size="small"
                          sx={{ height: 20, fontSize: 11, bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 600 }} />
                      )}
                    </Box>
                  }
                />
                <InfoField label={t('admin.productDetail.fieldSold', '已兑换数量')} value={`${product.soldCount ?? 0} ${t('admin.productDetail.unit', '件')}`} />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <InfoField label={t('admin.productDetail.fieldCreated', '创建时间')} value={product.createdAt ?? '—'} />
                <InfoField label={t('admin.productDetail.fieldUpdated', '最后更新')} value={product.updatedAt ?? '—'} />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* ── Description Card ── */}
      <Paper elevation={0} sx={CARD_SX}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>{t('admin.productDetail.description', '商品描述')}</Typography>
          <Divider sx={{ borderColor: '#F1F5F9' }} />
          <Typography sx={{ fontSize: 14, color: '#64748B', lineHeight: 1.8 }}>
            {product.description || '—'}
          </Typography>
        </Box>
      </Paper>

      {/* ── Specs Card ── */}
      {product.specs && product.specs.length > 0 && (
        <Paper elevation={0} sx={CARD_SX}>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>{t('admin.productDetail.specs', '规格参数')}</Typography>
            <Divider sx={{ borderColor: '#F1F5F9' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {product.specs.map((spec, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: '10px', borderBottom: i < (product.specs?.length ?? 0) - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#64748B', width: 160, flexShrink: 0 }}>{spec.key}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{spec.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      )}

      {/* Dialogs */}
      <AdjustStockDialog
        open={stockDialogOpen}
        onClose={() => setStockDialogOpen(false)}
        currentStock={product.stock}
        onConfirm={handleStockConfirm}
      />
      <DeactivateDialog
        open={deactivateDialogOpen}
        onClose={() => setDeactivateDialogOpen(false)}
        onConfirm={handleDeactivateConfirm}
        product={product}
      />
      <UploadImageDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUploaded={(url) => {
          if (id) updateAdminProduct(id, { imageUrl: url });
        }}
      />
    </Box>
  );
}

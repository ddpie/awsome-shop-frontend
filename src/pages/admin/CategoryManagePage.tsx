import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useProductStore } from '../../stores/product.store';
import type { Category } from '../../types/product.types';

// ── Types ──────────────────────────────────────────────────────────────────

type CatStatus = 'active' | 'inactive';

// ── Icon options ───────────────────────────────────────────────────────────

import DevicesIcon from '@mui/icons-material/Devices';
import RedeemIcon from '@mui/icons-material/Redeem';
import HomeIcon from '@mui/icons-material/Home';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SpaIcon from '@mui/icons-material/Spa';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import type { SvgIconComponent } from '@mui/icons-material';

const ICON_MAP: Record<string, SvgIconComponent> = {
  devices: DevicesIcon,
  redeem: RedeemIcon,
  home: HomeIcon,
  business_center: BusinessCenterIcon,
  fitness_center: FitnessCenterIcon,
  restaurant: RestaurantIcon,
  shopping_bag: ShoppingBagIcon,
  headphones: HeadphonesIcon,
  watch: WatchIcon,
  keyboard: KeyboardIcon,
  local_cafe: LocalCafeIcon,
  sports_esports: SportsEsportsIcon,
  checkroom: CheckroomIcon,
  spa: SpaIcon,
  card_giftcard: CardGiftcardIcon,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

// ── Mock icon/color per category name (used for display in table rows) ────

const CAT_ICON_MAP: Record<string, { icon: SvgIconComponent; color: string }> = {
  devices: { icon: DevicesIcon, color: '#2563EB' },
  redeem: { icon: RedeemIcon, color: '#F59E0B' },
  home: { icon: HomeIcon, color: '#10B981' },
  business_center: { icon: BusinessCenterIcon, color: '#6366F1' },
  fitness_center: { icon: FitnessCenterIcon, color: '#9CA3AF' },
  restaurant: { icon: RestaurantIcon, color: '#EF4444' },
  shopping_bag: { icon: ShoppingBagIcon, color: '#F59E0B' },
  headphones: { icon: HeadphonesIcon, color: '#64748B' },
  watch: { icon: WatchIcon, color: '#64748B' },
  keyboard: { icon: KeyboardIcon, color: '#64748B' },
  local_cafe: { icon: LocalCafeIcon, color: '#64748B' },
  sports_esports: { icon: SportsEsportsIcon, color: '#64748B' },
  checkroom: { icon: CheckroomIcon, color: '#64748B' },
  spa: { icon: SpaIcon, color: '#64748B' },
  card_giftcard: { icon: CardGiftcardIcon, color: '#64748B' },
};

// Default icon per root category index (matches mock data order)
const ROOT_DEFAULT_ICONS = ['devices', 'redeem', 'home', 'business_center', 'fitness_center'];
const SUB_DEFAULT_ICON = 'headphones';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; sortWeight: number; parentId: number | null; icon?: string; description?: string; status: 'active' | 'inactive' }) => Promise<void>;
  initial?: { name: string; sortWeight: number; parentId?: number | null; icon?: string; description?: string; status?: 'active' | 'inactive' };
  title: string;
  saveLabel: string;
  parentOptions: Category[];
}

function CategoryDialog({ open, onClose, onSave, initial, title, saveLabel, parentOptions }: CategoryDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [icon, setIcon] = useState('devices');
  const [sortWeight, setSortWeight] = useState('100');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setParentId(initial?.parentId ?? null);
      setIcon(initial?.icon ?? 'devices');
      setSortWeight(String(initial?.sortWeight ?? 100));
      setStatus(initial?.status ?? 'active');
      setDescription(initial?.description ?? '');
    }
  }, [open, initial]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), sortWeight: Number(sortWeight) || 0, parentId, icon, description, status });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const fieldLabelSx = { fontSize: 13, fontWeight: 500, color: '#1E293B', mb: '6px' };
  const inputSx = {
    height: 40, px: '12px', borderRadius: '8px', border: '1px solid #E2E8F0',
    bgcolor: '#fff', display: 'flex', alignItems: 'center', fontSize: 13, color: '#1E293B',
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: 520, borderRadius: '16px', boxShadow: '0 24px 64px -8px rgba(0,0,0,0.25), 0 8px 24px -4px rgba(0,0,0,0.12)' } }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: '20px', borderBottom: '1px solid #F1F5F9' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{title}</Typography>
        <Box onClick={onClose} sx={{ cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', '&:hover': { color: '#1E293B' } }}>
          <CloseIcon sx={{ fontSize: 22 }} />
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ px: 3, pt: 3, pb: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* 类目名称 */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', mb: '6px' }}>
            <Typography sx={fieldLabelSx}>{t('admin.categories.fieldName')}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#EF4444' }}>*</Typography>
          </Box>
          <InputBase
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('admin.categories.fieldNamePlaceholder')}
            autoFocus
            sx={{ ...inputSx, width: '100%', '& input': { p: 0 } }}
          />
        </Box>

        {/* 上级类目 */}
        <Box>
          <Typography sx={fieldLabelSx}>{t('admin.categories.fieldParent')}</Typography>
          <Box
            onClick={(e) => e.currentTarget.querySelector('select')?.click()}
            sx={{ ...inputSx, justifyContent: 'space-between', cursor: 'pointer', position: 'relative' }}
          >
            <select
              value={parentId ?? ''}
              onChange={(e) => setParentId(e.target.value === '' ? null : Number(e.target.value))}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
            >
              <option value="">{t('admin.categories.parentNone')}</option>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Typography sx={{ fontSize: 13, color: parentId ? '#1E293B' : '#1E293B' }}>
              {parentId ? parentOptions.find((p) => p.id === parentId)?.name : t('admin.categories.parentNone')}
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#64748B' }} />
          </Box>
        </Box>

        {/* 类目图标 */}
        <Box>
          <Typography sx={fieldLabelSx}>{t('admin.categories.fieldIcon')}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* 当前选中图标预览 */}
            <Box sx={{
              width: 48, height: 48, borderRadius: '8px', border: '1px solid #E2E8F0',
              bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {(() => { const I = ICON_MAP[icon]; return I ? <I sx={{ fontSize: 24, color: '#64748B' }} /> : null; })()}
            </Box>
            {/* 图标网格 */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ICON_OPTIONS.map((ic) => {
                const I = ICON_MAP[ic];
                return (
                  <Box
                    key={ic}
                    onClick={() => setIcon(ic)}
                    sx={{
                      width: 32, height: 32, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', border: ic === icon ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      bgcolor: ic === icon ? '#EFF6FF' : '#F8FAFC',
                      '&:hover': { borderColor: '#2563EB' },
                    }}
                  >
                    {I && <I sx={{ fontSize: 18, color: ic === icon ? '#2563EB' : '#64748B' }} />}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* 排序权重 + 状态 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={fieldLabelSx}>{t('admin.categories.fieldSort')}</Typography>
            <InputBase
              value={sortWeight}
              onChange={(e) => setSortWeight(e.target.value)}
              type="number"
              inputProps={{ min: 0 }}
              sx={{ ...inputSx, width: '100%', '& input': { p: 0 } }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={fieldLabelSx}>{t('admin.categories.fieldStatus')}</Typography>
            <Box sx={{ height: 40, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Box
                onClick={() => setStatus(status === 'active' ? 'inactive' : 'active')}
                sx={{
                  width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative',
                  bgcolor: status === 'active' ? '#2563EB' : '#CBD5E1', transition: 'background 0.2s',
                }}
              >
                <Box sx={{
                  position: 'absolute', top: 2, left: status === 'active' ? 22 : 2,
                  width: 20, height: 20, borderRadius: '50%', bgcolor: '#fff',
                  transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </Box>
              <Typography sx={{ fontSize: 13, color: '#1E293B' }}>
                {status === 'active' ? t('admin.categories.statusActive') : t('admin.categories.statusInactive')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 类目描述 */}
        <Box>
          <Typography sx={fieldLabelSx}>{t('admin.categories.fieldDesc')}</Typography>
          <Box
            component="textarea"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder={t('admin.categories.fieldDescPlaceholder')}
            rows={3}
            sx={{
              width: '100%', px: '12px', py: '10px', borderRadius: '8px', border: '1px solid #E2E8F0',
              bgcolor: '#fff', fontSize: 13, color: '#1E293B', fontFamily: 'Inter, sans-serif',
              resize: 'none', outline: 'none', boxSizing: 'border-box',
              '&::placeholder': { color: '#94A3B8' },
              '&:focus': { borderColor: '#2563EB' },
            }}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', px: 3, pt: 2, pb: '20px' }}>
        <Box
          onClick={onClose}
          sx={{
            px: 3, py: '10px', borderRadius: '8px', border: '1px solid #E2E8F0',
            bgcolor: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#1E293B',
            '&:hover': { bgcolor: '#F8FAFC' },
          }}
        >
          {t('common.cancel')}
        </Box>
        <Box
          onClick={handleSave}
          sx={{
            px: 3, py: '10px', borderRadius: '8px',
            bgcolor: name.trim() && !saving ? '#2563EB' : '#93C5FD',
            cursor: name.trim() && !saving ? 'pointer' : 'not-allowed',
            fontSize: 14, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 1,
            '&:hover': { bgcolor: name.trim() && !saving ? '#1D4ED8' : '#93C5FD' },
          }}
        >
          {saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : saveLabel}
        </Box>
      </Box>
    </Dialog>
  );
}

// ── Confirm delete dialog ──────────────────────────────────────────────────

function ConfirmDialog({ open, target, parentName, onClose, onConfirm }: {
  open: boolean;
  target: Category | null;
  parentName?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setInputVal('');
  }, [open]);

  const confirmed = inputVal.trim() === (target?.name ?? '');

  const handleConfirm = async () => {
    if (!confirmed) return;
    setLoading(true);
    try { await onConfirm(); onClose(); } finally { setLoading(false); }
  };

  const productCount = target?.productCount ?? 0;
  const iconKey = (target as (Category & { icon?: string }) | null)?.icon ?? 'headphones';
  const iconDef = CAT_ICON_MAP[iconKey] ?? CAT_ICON_MAP['headphones'];
  const Icon = iconDef.icon;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: 480, borderRadius: '16px', boxShadow: '0 24px 64px -8px rgba(0,0,0,0.25)' } }}
    >
      {/* Top bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: '20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '18px', bgcolor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <DeleteForeverIcon sx={{ fontSize: 20, color: '#DC2626' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1E293B', lineHeight: 1.3 }}>{t('admin.categories.deleteTitle')}</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748B', lineHeight: 1.3 }}>{t('admin.categories.deleteSubtitle')}</Typography>
          </Box>
        </Box>
        <Box onClick={onClose} sx={{ cursor: 'pointer', color: '#64748B', display: 'flex', '&:hover': { color: '#1E293B' } }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      <Box sx={{ height: 1, bgcolor: '#F1F5F9' }} />

      {/* Body */}
      <Box sx={{ px: 3, py: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Warning box */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', px: '14px', py: '12px', borderRadius: '8px', bgcolor: '#FEF2F2', border: '1px solid #FECACA' }}>
          <Box sx={{ flexShrink: 0, mt: '1px', color: '#DC2626', display: 'flex' }}>
            <ErrorOutlineIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#991B1B' }}>{t('admin.categories.deleteWarningTitle')}</Typography>
            <Typography sx={{ fontSize: 12, color: '#B91C1C', lineHeight: 1.6 }}>
              {t('admin.categories.deleteWarningLine1')}<br />
              {t('admin.categories.deleteWarningLine2', { count: productCount })}
            </Typography>
          </Box>
        </Box>

        {/* Category info card */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', px: '16px', py: '14px', borderRadius: '8px', bgcolor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon sx={{ fontSize: 24, color: '#2563EB' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{target?.name}</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748B' }}>
              {parentName
                ? t('admin.categories.deleteInfoWithParent', { parent: parentName, count: productCount })
                : t('admin.categories.deleteInfoNoParent', { count: productCount })}
            </Typography>
          </Box>
        </Box>

        {/* Confirm input */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{t('admin.categories.deleteInputLabel1')}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>{target?.name}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{t('admin.categories.deleteInputLabel2')}</Typography>
          </Box>
          <InputBase
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t('admin.categories.deleteInputPlaceholder', { name: target?.name ?? '' })}
            sx={{
              height: 42, px: '14px', borderRadius: '8px', border: '1px solid #E2E8F0',
              bgcolor: '#fff', fontSize: 13, color: '#1E293B', width: '100%',
              '& input': { p: 0 },
              '& input::placeholder': { color: '#94A3B8' },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ height: 1, bgcolor: '#F1F5F9' }} />

      {/* Footer */}
      <Box sx={{ px: 3, pt: 2, pb: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Delete button */}
        <Box
          onClick={confirmed && !loading ? handleConfirm : undefined}
          sx={{
            height: 42, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
            bgcolor: '#FEE2E2', cursor: confirmed && !loading ? 'pointer' : 'not-allowed',
            opacity: confirmed ? 1 : 0.5,
            '&:hover': confirmed && !loading ? { bgcolor: '#FECACA' } : {},
          }}
        >
          {loading
            ? <CircularProgress size={16} sx={{ color: '#DC2626' }} />
            : <DeleteForeverIcon sx={{ fontSize: 18, color: '#DC2626' }} />}
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>{t('admin.categories.deleteConfirmBtn')}</Typography>
        </Box>
        {/* Cancel button */}
        <Box
          onClick={onClose}
          sx={{
            height: 42, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: '#fff', border: '1px solid #E2E8F0', cursor: 'pointer',
            '&:hover': { bgcolor: '#F8FAFC' },
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>{t('common.cancel')}</Typography>
        </Box>
      </Box>
    </Dialog>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CatStatus }) {
  const { t } = useTranslation();
  const active = status === 'active';
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      px: '10px', py: '4px', borderRadius: '12px',
      bgcolor: active ? '#DCFCE7' : '#FEE2E2',
      color: active ? '#166534' : '#991B1B',
      fontSize: 11, fontWeight: 500, lineHeight: 1,
    }}>
      {active ? t('admin.categories.statusActive') : t('admin.categories.statusInactive')}
    </Box>
  );
}

// ── Text action button ─────────────────────────────────────────────────────

function ActionBtn({ label, color, onClick }: { label: string; color: string; onClick?: () => void }) {
  return (
    <Typography
      component="span"
      onClick={onClick}
      sx={{ fontSize: 12, fontWeight: 500, color, cursor: 'pointer', '&:hover': { opacity: 0.75 } }}
    >
      {label}
    </Typography>
  );
}

// ── Column widths (match design) ───────────────────────────────────────────
const COL = { name: 'auto', products: 100, sort: 100, status: 90, actions: 130 };
const ROW_PX = '20px';
const HEAD_SX = { fontSize: 12, fontWeight: 600, color: '#64748B' };
const DIVIDER = '1px solid #F1F5F9';

// ── Row component ──────────────────────────────────────────────────────────

function CatRow({ cat, expanded, onToggle, onEdit, onAddSub, onToggleStatus, iconKey }: {
  cat: Category;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onAddSub: () => void;
  onToggleStatus: () => void;
  iconKey: string;
}) {
  const { t } = useTranslation();
  const hasChildren = (cat.children?.length ?? 0) > 0;
  const status = cat.status ?? 'active';
  const iconDef = CAT_ICON_MAP[iconKey] ?? CAT_ICON_MAP['devices'];
  const Icon = iconDef.icon;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F8FAFC', borderBottom: DIVIDER, px: ROW_PX, py: '14px', opacity: status === 'inactive' ? 0.6 : 1 }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box component="span" onClick={onToggle} sx={{ display: 'flex', alignItems: 'center', cursor: hasChildren ? 'pointer' : 'default', color: '#64748B' }}>
          {expanded
            ? <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
            : <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />}
        </Box>
        <Icon sx={{ fontSize: 20, color: iconDef.color }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{cat.name}</Typography>
      </Box>
      <Box sx={{ width: COL.products }}><Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{cat.productCount ?? 0}</Typography></Box>
      <Box sx={{ width: COL.sort }}><Typography sx={{ fontSize: 13, color: '#1E293B' }}>{cat.sortWeight ?? 0}</Typography></Box>
      <Box sx={{ width: COL.status }}><StatusBadge status={status} /></Box>
      <Box sx={{ width: COL.actions, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ActionBtn label={t('admin.categories.edit')} color="#2563EB" onClick={onEdit} />
        <ActionBtn label={t('admin.categories.addSub')} color="#2563EB" onClick={onAddSub} />
        <ActionBtn
          label={status === 'active' ? t('admin.categories.disable') : t('admin.categories.enable')}
          color={status === 'active' ? '#F59E0B' : '#10B981'}
          onClick={onToggleStatus}
        />
      </Box>
    </Box>
  );
}

function SubRow({ sub, onEdit, onDelete, iconKey }: {
  sub: Category;
  onEdit: () => void;
  onDelete: () => void;
  iconKey: string;
}) {
  const { t } = useTranslation();
  const status = sub.status ?? 'active';
  const iconDef = CAT_ICON_MAP[iconKey] ?? CAT_ICON_MAP['headphones'];
  const Icon = iconDef.icon;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fff', borderBottom: DIVIDER, pl: '66px', pr: ROW_PX, py: '12px' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon sx={{ fontSize: 18, color: '#94A3B8' }} />
        <Typography sx={{ fontSize: 13, color: '#1E293B' }}>{sub.name}</Typography>
      </Box>
      <Box sx={{ width: COL.products }}><Typography sx={{ fontSize: 13, color: '#1E293B' }}>{sub.productCount ?? 0}</Typography></Box>
      <Box sx={{ width: COL.sort }}><Typography sx={{ fontSize: 13, color: '#1E293B' }}>{sub.sortWeight ?? 0}</Typography></Box>
      <Box sx={{ width: COL.status }}><StatusBadge status={status} /></Box>
      <Box sx={{ width: COL.actions, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ActionBtn label={t('admin.categories.edit')} color="#2563EB" onClick={onEdit} />
        <ActionBtn label={t('admin.categories.delete')} color="#EF4444" onClick={onDelete} />
      </Box>
    </Box>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function CategoryManagePage() {
  const { t } = useTranslation();
  const { categories, categoryLoading, fetchCategories, createCategory, updateCategory, deleteCategory, toggleCategoryStatus } = useProductStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | 'active' | 'inactive'>('');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  // Dialog state
  type DialogMode = 'addRoot' | 'addSub' | 'edit';
  const [dialog, setDialog] = useState<{ mode: DialogMode; target?: Category; parentId?: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const toggleExpand = (id: number) =>
    setExpandedIds((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  // Only top-level categories (no parentId)
  const rootCategories = categories.filter((c) => !c.parentId);

  const filtered = rootCategories.filter((c) =>
    (!search || c.name.includes(search)) &&
    (!statusFilter || c.status === statusFilter)
  );

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getChildren = (parentId: number) => categories.filter((c) => c.parentId === parentId);

  const handleSave = async (data: { name: string; sortWeight: number; parentId: number | null; icon?: string; description?: string; status: 'active' | 'inactive' }) => {
    if (!dialog) return;
    if (dialog.mode === 'edit' && dialog.target) {
      await updateCategory(dialog.target.id, { name: data.name, sortWeight: data.sortWeight });
    } else {
      const pid = dialog.mode === 'addSub' && dialog.parentId != null ? dialog.parentId : (data.parentId ?? null);
      await createCategory({ name: data.name, sortWeight: data.sortWeight, parentId: pid });
    }
  };

  const dialogTitle = dialog?.mode === 'edit'
    ? t('admin.categories.editCategory')
    : dialog?.mode === 'addSub'
    ? t('admin.categories.addSubCategory')
    : t('admin.categories.addCategory');

  const dialogSaveLabel = dialog?.mode === 'edit'
    ? t('common.save')
    : t('admin.categories.createCategory');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: 4, height: '100%' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>
          {t('admin.categories.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog({ mode: 'addRoot' })}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 500, fontSize: 14, px: '20px', py: '10px', gap: '6px' }}
        >
          {t('admin.categories.addCategory')}
        </Button>
      </Box>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1, px: '12px', height: 40, width: 280,
          border: '1px solid #E2E8F0', borderRadius: '8px', bgcolor: '#fff',
        }}>
          <SearchIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <InputBase
            placeholder={t('admin.categories.search')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            sx={{ fontSize: 13, flex: 1, color: '#1E293B', '& input::placeholder': { color: '#94A3B8' } }}
          />
        </Box>

        <Box
          onClick={(e) => setFilterAnchor(e.currentTarget)}
          sx={{
            display: 'flex', alignItems: 'center', gap: '6px', px: '14px', height: 40,
            border: '1px solid #E2E8F0', borderRadius: '8px', bgcolor: '#fff', cursor: 'pointer',
          }}
        >
          <FilterListIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            {statusFilter === 'active' ? t('admin.categories.statusActive')
              : statusFilter === 'inactive' ? t('admin.categories.statusInactive')
              : t('admin.categories.allStatus')}
          </Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#64748B' }} />
        </Box>
        <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)}>
          <MenuItem onClick={() => { setStatusFilter(''); setFilterAnchor(null); }}>{t('admin.categories.allStatus')}</MenuItem>
          <MenuItem onClick={() => { setStatusFilter('active'); setFilterAnchor(null); }}>{t('admin.categories.statusActive')}</MenuItem>
          <MenuItem onClick={() => { setStatusFilter('inactive'); setFilterAnchor(null); }}>{t('admin.categories.statusInactive')}</MenuItem>
        </Menu>

        <Typography sx={{ fontSize: 13, color: '#64748B' }}>
          {t('admin.categories.total', { count: filtered.length })}
        </Typography>
      </Box>

      {/* Table card */}
      <Paper elevation={0} sx={{ borderRadius: '8px', border: DIVIDER, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Table header */}
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F8FAFC', borderBottom: DIVIDER, px: ROW_PX, py: '14px' }}>
          <Box sx={{ flex: 1 }}><Typography sx={HEAD_SX}>{t('admin.categories.colName')}</Typography></Box>
          <Box sx={{ width: COL.products }}><Typography sx={HEAD_SX}>{t('admin.categories.colProducts')}</Typography></Box>
          <Box sx={{ width: COL.sort }}><Typography sx={HEAD_SX}>{t('admin.categories.colSort')}</Typography></Box>
          <Box sx={{ width: COL.status }}><Typography sx={HEAD_SX}>{t('admin.categories.colStatus')}</Typography></Box>
          <Box sx={{ width: COL.actions }}><Typography sx={HEAD_SX}>{t('admin.categories.colAction')}</Typography></Box>
        </Box>

        {/* Rows */}
        <Box sx={{ flex: 1 }}>
          {categoryLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            paged.map((cat, idx) => {
              const children = getChildren(cat.id);
              const catIconKey = (cat as Category & { icon?: string }).icon ?? ROOT_DEFAULT_ICONS[idx % ROOT_DEFAULT_ICONS.length];
              return (
                <Box key={cat.id}>
                  <CatRow
                    cat={{ ...cat, children }}
                    expanded={expandedIds.has(cat.id)}
                    onToggle={() => toggleExpand(cat.id)}
                    onEdit={() => setDialog({ mode: 'edit', target: cat })}
                    onAddSub={() => setDialog({ mode: 'addSub', parentId: cat.id })}
                    onToggleStatus={() => toggleCategoryStatus(cat.id, cat.status === 'active' ? 'inactive' : 'active')}
                    iconKey={catIconKey}
                  />
                  {expandedIds.has(cat.id) && children.map((sub) => (
                    <SubRow
                      key={sub.id}
                      sub={sub}
                      onEdit={() => setDialog({ mode: 'edit', target: sub })}
                      onDelete={() => setDeleteTarget(sub)}
                      iconKey={(sub as Category & { icon?: string }).icon ?? SUB_DEFAULT_ICON}
                    />
                  ))}
                </Box>
              );
            })
          )}
        </Box>

        {/* Pagination footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: ROW_PX, py: '12px', borderTop: DIVIDER }}>
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            {t('admin.categories.footerTotal', { count: filtered.length })}
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
      </Paper>

      {/* Create / Edit dialog */}
      <CategoryDialog
        open={dialog !== null}
        onClose={() => setDialog(null)}
        onSave={handleSave}
        initial={dialog?.target ? {
          name: dialog.target.name,
          sortWeight: dialog.target.sortWeight ?? 100,
          parentId: dialog.target.parentId ?? null,
          status: dialog.target.status ?? 'active',
        } : dialog?.mode === 'addSub' ? {
          name: '', sortWeight: 100, parentId: dialog.parentId ?? null, status: 'active',
        } : undefined}
        title={dialogTitle}
        saveLabel={dialogSaveLabel}
        parentOptions={rootCategories}
      />

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        target={deleteTarget}
        parentName={deleteTarget?.parentId ? categories.find((c) => c.id === deleteTarget.parentId)?.name : undefined}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteCategory(deleteTarget!.id)}
      />
    </Box>
  );
}

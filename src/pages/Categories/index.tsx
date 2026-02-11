import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import InputBase from '@mui/material/InputBase';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DevicesIcon from '@mui/icons-material/Devices';
import RedeemIcon from '@mui/icons-material/Redeem';
import HomeIcon from '@mui/icons-material/Home';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CategoryIcon from '@mui/icons-material/Category';
import { listCategories } from '../../services/api/category';
import type { CategoryDTO } from '../../types/api';
import AdminPageHeader from '../../components/AdminPageHeader';

// ---- Icon registry ----

const ICON_MAP: Record<string, React.ElementType> = {
  devices: DevicesIcon,
  redeem: RedeemIcon,
  home: HomeIcon,
  business_center: BusinessCenterIcon,
  headphones: HeadphonesIcon,
  watch: WatchIcon,
  keyboard: KeyboardIcon,
  shopping_bag: ShoppingBagIcon,
  restaurant: RestaurantIcon,
  sports_esports: SportsEsportsIcon,
};

// Parent category icon colors (design shows different colors per category)
const PARENT_ICON_COLORS: string[] = [
  '#2563EB', '#F59E0B', '#10B981', '#6366F1', '#EC4899', '#8B5CF6',
];

// ---- Helpers ----

/** Count all nodes (including nested children) in a category tree. */
function countAll(nodes: CategoryDTO[]): number {
  let count = 0;
  for (const n of nodes) {
    count += 1;
    if (n.children?.length) count += countAll(n.children);
  }
  return count;
}

// ---- Component ----

export default function CategoryList() {
  const { t } = useTranslation();

  const [tree, setTree] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | '1' | '0'>('');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listCategories({
        name: search || undefined,
        status: statusFilter !== '' ? Number(statusFilter) : undefined,
      });
      // API already returns a nested tree with children populated
      setTree(res);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-expand all parent nodes on first load
  useEffect(() => {
    if (tree.length > 0 && expanded.size === 0) {
      setExpanded(new Set(tree.filter((n) => n.children?.length > 0).map((n) => n.id)));
    }
  }, [tree]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const parentCount = tree.length;
  const totalCount = useMemo(() => countAll(tree), [tree]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') fetchData();
  };

  return (
    <Box sx={{ p: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminPageHeader
        title={t('admin.categories.title')}
        actions={
          <ButtonBase
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              bgcolor: '#2563EB',
              color: '#fff',
              borderRadius: '8px',
              px: '20px',
              py: '10px',
              '&:hover': { bgcolor: '#1D4ED8' },
            }}
          >
            <AddIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
              {t('admin.categories.addCategory')}
            </Typography>
          </ButtonBase>
        }
      />

      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: 280,
            height: 40,
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            bgcolor: '#fff',
            px: '12px',
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <InputBase
            placeholder={t('admin.categories.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              flex: 1,
              fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              '& input::placeholder': { color: '#CBD5E1', opacity: 1 },
            }}
          />
        </Box>

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | '1' | '0')}
          displayEmpty
          size="small"
          sx={{
            height: 40,
            borderRadius: '8px',
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            color: '#64748B',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
            '& .MuiSelect-select': { py: '8px', px: '14px' },
          }}
        >
          <MenuItem value="">{t('admin.categories.allStatus')}</MenuItem>
          <MenuItem value="1">{t('admin.categories.statusEnabled')}</MenuItem>
          <MenuItem value="0">{t('admin.categories.statusDisabled')}</MenuItem>
        </Select>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 13, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
            共 {totalCount} 个类目
          </Typography>
        </Box>
      </Box>

      {/* Table card — scrollable */}
      <Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : tree.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
            <CategoryIcon sx={{ fontSize: 48, color: '#CBD5E1' }} />
            <Typography sx={{ fontSize: 14, color: '#64748B' }}>{t('admin.categories.noCategories')}</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              borderRadius: '12px',
              border: '1px solid #F1F5F9',
              bgcolor: '#fff',
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#F8FAFC',
                px: '20px',
                py: '14px',
              }}
            >
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  {t('admin.categories.thName')}
                </Typography>
              </Box>
              <Box sx={{ width: 100, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  {t('admin.categories.thProductCount')}
                </Typography>
              </Box>
              <Box sx={{ width: 100, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  {t('admin.categories.thSortOrder')}
                </Typography>
              </Box>
              <Box sx={{ width: 90, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  {t('admin.categories.thStatus')}
                </Typography>
              </Box>
              <Box sx={{ width: 180, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  {t('admin.categories.thActions')}
                </Typography>
              </Box>
            </Box>

            {/* Table rows */}
            {tree.map((parent, idx) => (
              <ParentRow
                key={parent.id}
                node={parent}
                colorIndex={idx}
                expanded={expanded.has(parent.id)}
                onToggle={() => toggleExpand(parent.id)}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Pagination */}
      {parentCount > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '8px' }}>
          <Typography sx={{ fontSize: 13, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
            {t('admin.categories.showRange', { start: 1, end: parentCount, total: parentCount })}
          </Typography>
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <ButtonBase
              sx={{
                width: 32,
                height: 32,
                borderRadius: '4px',
                border: '1px solid #E2E8F0',
                bgcolor: '#2563EB',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                1
              </Typography>
            </ButtonBase>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ---- Parent category row ----

function ParentRow({
  node,
  colorIndex,
  expanded,
  onToggle,
}: {
  node: CategoryDTO;
  colorIndex: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const hasChildren = node.children?.length > 0;
  const iconColor = PARENT_ICON_COLORS[colorIndex % PARENT_ICON_COLORS.length];
  const IconComp = ICON_MAP[node.icon] || CategoryIcon;
  const isEnabled = node.status === 1;

  return (
    <>
      {/* Parent row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#F8FAFC',
          px: '20px',
          py: '14px',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        {/* Name cell */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minHeight: 24 }}>
          {hasChildren ? (
            <ButtonBase onClick={onToggle} sx={{ borderRadius: '4px', p: '2px' }}>
              {expanded ? (
                <ExpandMoreIcon sx={{ fontSize: 18, color: '#64748B' }} />
              ) : (
                <ChevronRightIcon sx={{ fontSize: 18, color: '#64748B' }} />
              )}
            </ButtonBase>
          ) : (
            <Box sx={{ width: 22 }} />
          )}
          <IconComp sx={{ fontSize: 20, color: iconColor }} />
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
            {node.name}
          </Typography>
        </Box>

        {/* Product count */}
        <Box sx={{ width: 100, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
            {node.productCount ?? 0}
          </Typography>
        </Box>

        {/* Sort order */}
        <Box sx={{ width: 100, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 13, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
            {node.sortOrder ?? 0}
          </Typography>
        </Box>

        {/* Status chip */}
        <Box sx={{ width: 90, display: 'flex', alignItems: 'center' }}>
          <StatusChip enabled={isEnabled} />
        </Box>

        {/* Actions */}
        <Box sx={{ width: 180, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ButtonBase sx={{ '&:hover': { textDecoration: 'underline' } }}>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#2563EB', fontFamily: 'Inter, sans-serif' }}>
              {t('admin.categories.edit')}
            </Typography>
          </ButtonBase>
          <ButtonBase sx={{ '&:hover': { textDecoration: 'underline' } }}>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#2563EB', fontFamily: 'Inter, sans-serif' }}>
              {t('admin.categories.addSub')}
            </Typography>
          </ButtonBase>
          <ButtonBase sx={{ '&:hover': { textDecoration: 'underline' } }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 500,
                color: isEnabled ? '#D97706' : '#2563EB',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {isEnabled ? t('admin.categories.disable') : t('admin.categories.enable')}
            </Typography>
          </ButtonBase>
        </Box>
      </Box>

      {/* Child rows */}
      {expanded &&
        node.children.map((child) => <ChildRow key={child.id} node={child} />)}
    </>
  );
}

// ---- Child category row ----

function ChildRow({ node }: { node: CategoryDTO }) {
  const { t } = useTranslation();
  const IconComp = ICON_MAP[node.icon] || CategoryIcon;
  const isEnabled = node.status === 1;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: '20px',
        py: '12px',
        borderBottom: '1px solid #F1F5F9',
      }}
    >
      {/* Name cell — indented with left padding to align under parent name */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', pl: '46px', minHeight: 24 }}>
        <IconComp sx={{ fontSize: 18, color: '#64748B' }} />
        <Typography sx={{ fontSize: 13, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
          {node.name}
        </Typography>
      </Box>

      {/* Product count */}
      <Box sx={{ width: 100, display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 13, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
          {node.productCount ?? 0}
        </Typography>
      </Box>

      {/* Sort order */}
      <Box sx={{ width: 100, display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 13, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
          {node.sortOrder ?? 0}
        </Typography>
      </Box>

      {/* Status chip */}
      <Box sx={{ width: 90, display: 'flex', alignItems: 'center' }}>
        <StatusChip enabled={isEnabled} />
      </Box>

      {/* Actions */}
      <Box sx={{ width: 180, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ButtonBase sx={{ '&:hover': { textDecoration: 'underline' } }}>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#2563EB', fontFamily: 'Inter, sans-serif' }}>
            {t('admin.categories.edit')}
          </Typography>
        </ButtonBase>
        <ButtonBase sx={{ '&:hover': { textDecoration: 'underline' } }}>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#DC2626', fontFamily: 'Inter, sans-serif' }}>
            {t('admin.categories.delete')}
          </Typography>
        </ButtonBase>
      </Box>
    </Box>
  );
}

// ---- Status chip ----

function StatusChip({ enabled }: { enabled: boolean }) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        bgcolor: enabled ? '#DCFCE7' : '#FEE2E2',
        px: '10px',
        py: '4px',
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 500,
          color: enabled ? '#166534' : '#991B1B',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {enabled ? t('admin.categories.statusEnabled') : t('admin.categories.statusDisabled')}
      </Typography>
    </Box>
  );
}

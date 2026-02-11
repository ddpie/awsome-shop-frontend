import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import RuleIcon from '@mui/icons-material/Rule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TollIcon from '@mui/icons-material/Toll';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CakeIcon from '@mui/icons-material/Cake';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CelebrationIcon from '@mui/icons-material/Celebration';
import StarIcon from '@mui/icons-material/Star';
import { listPointRules } from '../../services/api/pointRule';
import type { PointRuleDTO, PageResult } from '../../types/api';

// ---- Rule type styling ----

interface RuleTypeStyle {
  label: string;
  textColor: string;
  bgColor: string;
}

const RULE_TYPE_STYLES: Record<string, RuleTypeStyle> = {
  FIXED: { label: '固定发放', textColor: '#2563EB', bgColor: '#EFF6FF' },
  EVENT: { label: '事件触发', textColor: '#8B5CF6', bgColor: '#F5F3FF' },
  PERFORMANCE: { label: '绩效关联', textColor: '#059669', bgColor: '#ECFDF5' },
  HOLIDAY: { label: '节日触发', textColor: '#6B7280', bgColor: '#F3F4F6' },
};

const RULE_TYPE_STYLES_EN: Record<string, RuleTypeStyle> = {
  FIXED: { label: 'Fixed', textColor: '#2563EB', bgColor: '#EFF6FF' },
  EVENT: { label: 'Event', textColor: '#8B5CF6', bgColor: '#F5F3FF' },
  PERFORMANCE: { label: 'Performance', textColor: '#059669', bgColor: '#ECFDF5' },
  HOLIDAY: { label: 'Holiday', textColor: '#6B7280', bgColor: '#F3F4F6' },
};

const DEFAULT_RULE_TYPE_STYLE: RuleTypeStyle = { label: '-', textColor: '#64748B', bgColor: '#F1F5F9' };

// ---- Row icon styling (color per row index) ----

const ROW_ICON_STYLES: { icon: React.ElementType; color: string; bg: string }[] = [
  { icon: CalendarMonthIcon, color: '#2563EB', bg: '#EFF6FF' },
  { icon: EmojiEventsIcon, color: '#8B5CF6', bg: '#F5F3FF' },
  { icon: CakeIcon, color: '#F59E0B', bg: '#FFF7ED' },
  { icon: TrendingUpIcon, color: '#10B981', bg: '#ECFDF5' },
  { icon: PersonAddIcon, color: '#DC2626', bg: '#FEF2F2' },
  { icon: CelebrationIcon, color: '#6B7280', bg: '#F3F4F6' },
];

// ---- Component ----

export default function PointRuleList() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const [data, setData] = useState<PageResult<PointRuleDTO> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listPointRules({ page, size: pageSize });
      setData(res);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rules = data?.records ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;
  const start = rules.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const end = start + rules.length - 1;

  // Stats derived from data
  const enabledCount = rules.filter((r) => r.status === 1).length;

  return (
    <Box sx={{ p: '32px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
            {t('admin.pointRules.title')}
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
            {t('admin.pointRules.subtitle')}
          </Typography>
        </Box>
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
          <Typography sx={{ fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
            {t('admin.pointRules.addRule')}
          </Typography>
        </ButtonBase>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'flex', gap: '16px' }}>
        <StatCard icon={<RuleIcon sx={{ fontSize: 18, color: '#2563EB' }} />} iconBg="#EFF6FF" label={t('admin.pointRules.statTotal')} value={String(total)} />
        <StatCard icon={<CheckCircleIcon sx={{ fontSize: 18, color: '#10B981' }} />} iconBg="#ECFDF5" label={t('admin.pointRules.statEnabled')} value={String(enabledCount)} valueColor="#10B981" />
        <StatCard icon={<TollIcon sx={{ fontSize: 18, color: '#F59E0B' }} />} iconBg="#FFF7ED" label={t('admin.pointRules.statMonthly')} value="—" />
        <StatCard icon={<GroupIcon sx={{ fontSize: 18, color: '#8B5CF6' }} />} iconBg="#F5F3FF" label={t('admin.pointRules.statEmployees')} value="—" />
      </Box>

      {/* Table card — scrollable */}
      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : rules.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
            <StarIcon sx={{ fontSize: 48, color: '#CBD5E1' }} />
            <Typography sx={{ fontSize: 14, color: '#64748B' }}>{t('admin.pointRules.noRules')}</Typography>
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
                  {t('admin.pointRules.thName')}
                </Typography>
              </Box>
              <Box sx={{ width: 100, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  {t('admin.pointRules.thType')}
                </Typography>
              </Box>
              <Box sx={{ width: 100, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  {t('admin.pointRules.thPoints')}
                </Typography>
              </Box>
              <Box sx={{ width: 180, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  {t('admin.pointRules.thCondition')}
                </Typography>
              </Box>
              <Box sx={{ width: 70, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  {t('admin.pointRules.thStatus')}
                </Typography>
              </Box>
              <Box sx={{ width: 90, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                  {t('admin.pointRules.thActions')}
                </Typography>
              </Box>
            </Box>

            {/* Table rows */}
            {rules.map((rule, idx) => (
              <RuleRow key={rule.id} rule={rule} rowIndex={idx} isZh={isZh} />
            ))}
          </Box>
        )}
      </Box>

      {/* Pagination */}
      {total > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '8px', flexShrink: 0 }}>
          <Typography sx={{ fontSize: 13, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
            {t('admin.pointRules.showRange', { start, end, total })}
          </Typography>
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {/* Previous */}
            <ButtonBase
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                bgcolor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: page <= 1 ? 0.4 : 1,
              }}
            >
              <Typography sx={{ fontSize: 13, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{'<'}</Typography>
            </ButtonBase>
            {/* Page numbers */}
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <ButtonBase
                key={p}
                onClick={() => setPage(p)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '6px',
                  border: p === page ? 'none' : '1px solid #E2E8F0',
                  bgcolor: p === page ? '#2563EB' : '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: p === page ? '#fff' : '#64748B',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {p}
                </Typography>
              </ButtonBase>
            ))}
            {/* Next */}
            <ButtonBase
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                bgcolor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: page >= pages ? 0.4 : 1,
              }}
            >
              <Typography sx={{ fontSize: 13, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{'>'}</Typography>
            </ButtonBase>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ---- Stat Card ----

function StatCard({
  icon,
  iconBg,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        bgcolor: '#fff',
        borderRadius: '12px',
        border: '1px solid #F1F5F9',
        padding: '18px 20px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            bgcolor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
          {label}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 28, fontWeight: 700, color: valueColor ?? '#1E293B', fontFamily: 'Inter, sans-serif' }}>
        {value}
      </Typography>
    </Box>
  );
}

// ---- Rule Row ----

function RuleRow({ rule, rowIndex, isZh }: { rule: PointRuleDTO; rowIndex: number; isZh: boolean }) {
  const { t } = useTranslation();
  const isEnabled = rule.status === 1;
  const isDisabledRow = !isEnabled;

  // Icon style per row
  const iconStyle = ROW_ICON_STYLES[rowIndex % ROW_ICON_STYLES.length];
  const IconComp = iconStyle.icon;

  // Rule type chip
  const typeStyles = isZh ? RULE_TYPE_STYLES : RULE_TYPE_STYLES_EN;
  const ruleTypeStyle = typeStyles[rule.ruleType] ?? { ...DEFAULT_RULE_TYPE_STYLE, label: rule.ruleType || '-' };

  // Points display
  const pointsText =
    rule.pointValueMin === rule.pointValueMax
      ? String(rule.pointValueMin ?? 0)
      : `${rule.pointValueMin ?? 0}~${rule.pointValueMax ?? 0}`;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: '20px',
        py: '14px',
        borderBottom: '1px solid #F1F5F9',
        opacity: isDisabledRow ? 0.6 : 1,
      }}
    >
      {/* Name + description */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', minHeight: 24 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '6px',
              bgcolor: iconStyle.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconComp sx={{ fontSize: 16, color: iconStyle.color }} />
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
            {rule.name}
          </Typography>
        </Box>
        {rule.description && (
          <Typography sx={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif', pl: '36px' }}>
            {rule.description}
          </Typography>
        )}
      </Box>

      {/* Rule type chip */}
      <Box sx={{ width: 100, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'inline-flex',
            borderRadius: '4px',
            bgcolor: ruleTypeStyle.bgColor,
            px: '8px',
            py: '3px',
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: ruleTypeStyle.textColor, fontFamily: 'Inter, sans-serif' }}>
            {ruleTypeStyle.label}
          </Typography>
        </Box>
      </Box>

      {/* Points value */}
      <Box sx={{ width: 100, display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
          {pointsText}
        </Typography>
      </Box>

      {/* Trigger condition */}
      <Box sx={{ width: 180, display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 12, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
          {rule.triggerCondition || '—'}
        </Typography>
      </Box>

      {/* Status chip */}
      <Box sx={{ width: 70, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            bgcolor: isEnabled ? '#DCFCE7' : '#FEE2E2',
            px: '10px',
            py: '4px',
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              color: isEnabled ? '#166534' : '#991B1B',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {isEnabled ? t('admin.pointRules.statusEnabled') : t('admin.pointRules.statusDisabled')}
          </Typography>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ width: 90, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ButtonBase sx={{ '&:hover': { textDecoration: 'underline' } }}>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#2563EB', fontFamily: 'Inter, sans-serif' }}>
            {t('admin.pointRules.edit')}
          </Typography>
        </ButtonBase>
        <ButtonBase sx={{ '&:hover': { textDecoration: 'underline' } }}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: isEnabled ? '#D97706' : '#10B981',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {isEnabled ? t('admin.pointRules.disable') : t('admin.pointRules.enable')}
          </Typography>
        </ButtonBase>
      </Box>
    </Box>
  );
}

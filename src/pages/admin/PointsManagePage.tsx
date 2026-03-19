import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import RuleIcon from '@mui/icons-material/Rule';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TollIcon from '@mui/icons-material/Toll';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import type { SelectChangeEvent } from '@mui/material/Select';
import { pointsService } from '../../services/points.service';
import type { PointsRule, PointsRuleType, PointsRuleStatus, CreatePointsRuleRequest } from '../../types/points.types';

// ── Fallback static rules (used when API not available) ────────────────────

const FALLBACK_RULES: PointsRule[] = [
  { id: 1, name: '每月基础积分', description: '每月固定发放基础福利积分', type: 'FIXED', points: '500', triggerCondition: '每月1日自动发放', status: 'ACTIVE', createdAt: '', updatedAt: '' },
  { id: 2, name: '入职欢迎积分', description: '新员工入职当天自动发放', type: 'ONBOARDING', points: '200', triggerCondition: '入职当天自动触发', status: 'ACTIVE', createdAt: '', updatedAt: '' },
  { id: 3, name: '生日祝福积分', description: '员工生日当天自动发放祝福积分', type: 'HOLIDAY', points: '100', triggerCondition: '生日当天自动触发', status: 'ACTIVE', createdAt: '', updatedAt: '' },
  { id: 4, name: '绩效优秀奖励', description: '季度绩效考核优秀员工奖励', type: 'PERFORMANCE', points: '200~800', triggerCondition: '绩效考核A及以上', status: 'ACTIVE', createdAt: '', updatedAt: '' },
  { id: 5, name: '推荐人才奖励', description: '成功推荐新员工入职奖励', type: 'OTHER', points: '500', triggerCondition: '被推荐人入职满3个月', status: 'ACTIVE', createdAt: '', updatedAt: '' },
  { id: 6, name: '节日特别福利', description: '春节/中秋/端午等节日福利', type: 'HOLIDAY', points: '300', triggerCondition: '节日当天发放', status: 'DISABLED', createdAt: '', updatedAt: '' },
];

const RULE_TYPE_CONFIG: Record<PointsRuleType, { label: string; color: string; bg: string }> = {
  FIXED:       { label: '固定发放', color: '#1E40AF', bg: '#EFF6FF' },
  PERFORMANCE: { label: '绩效奖励', color: '#065F46', bg: '#D1FAE5' },
  HOLIDAY:     { label: '节日福利', color: '#92400E', bg: '#FEF3C7' },
  PROJECT:     { label: '项目奖励', color: '#5B21B6', bg: '#EDE9FE' },
  ONBOARDING:  { label: '入职奖励', color: '#0E7490', bg: '#CFFAFE' },
  OTHER:       { label: '其他',     color: '#374151', bg: '#F3F4F6' },
};

const RULE_TYPES: PointsRuleType[] = ['FIXED', 'PERFORMANCE', 'HOLIDAY', 'PROJECT', 'ONBOARDING', 'OTHER'];

const STAT_CARDS = [
  { key: 'totalRules',    icon: RuleIcon,               iconColor: '#2563EB', iconBg: '#EFF6FF' },
  { key: 'activeRules',   icon: CheckCircleOutlineIcon,  iconColor: '#16A34A', iconBg: '#DCFCE7' },
  { key: 'monthlyIssued', icon: TollIcon,                iconColor: '#D97706', iconBg: '#FEF3C7' },
  { key: 'beneficiaries', icon: PeopleAltIcon,           iconColor: '#7C3AED', iconBg: '#EDE9FE' },
];

const DIVIDER = '1px solid #F1F5F9';
const PAGE_SIZE = 10;

// ── Rule Dialog ─────────────────────────────────────────────────────────────

interface RuleDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreatePointsRuleRequest & { status: PointsRuleStatus }) => Promise<void>;
  initial?: PointsRule | null;
}

function RuleDialog({ open, onClose, onSave, initial }: RuleDialogProps) {
  const { t } = useTranslation();
  const isEdit = !!initial;

  const [name, setName] = useState('');
  const [type, setType] = useState<PointsRuleType>('FIXED');
  const [points, setPoints] = useState('');
  const [trigger, setTrigger] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<PointsRuleStatus>('ACTIVE');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setType(initial?.type ?? 'FIXED');
      setPoints(initial?.points ?? '');
      setTrigger(initial?.triggerCondition ?? '');
      setDescription(initial?.description ?? '');
      setStatus(initial?.status ?? 'ACTIVE');
    }
  }, [open, initial]);

  const canSave = name.trim() && points.trim() && trigger.trim();

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), type, points: points.trim(), triggerCondition: trigger.trim(), description: description.trim(), status });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const fieldLabelSx = { fontSize: 13, fontWeight: 500, color: '#1E293B' };
  const inputSx = {
    height: 40, px: '12px', borderRadius: '8px', border: '1px solid #E2E8F0',
    bgcolor: '#fff', display: 'flex', alignItems: 'center', fontSize: 13, color: '#1E293B',
    '& input': { p: 0 }, '& input::placeholder': { color: '#94A3B8' },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} PaperProps={{ sx: { width: 560, borderRadius: '16px', boxShadow: '0 24px 64px -8px rgba(0,0,0,0.25)' } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: '20px', borderBottom: DIVIDER }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>
          {isEdit ? t('admin.pointsRules.editRule', '编辑积分规则') : t('admin.pointsRules.addRuleTitle', '新增积分规则')}
        </Typography>
        <Box onClick={onClose} sx={{ cursor: 'pointer', color: '#64748B', display: 'flex', '&:hover': { color: '#1E293B' } }}>
          <CloseIcon sx={{ fontSize: 22 }} />
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ px: 3, py: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Row 1: name */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Box sx={{ display: 'flex', gap: '2px' }}>
            <Typography sx={fieldLabelSx}>{t('admin.pointsRules.fieldName', '规则名称')}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#EF4444' }}>*</Typography>
          </Box>
          <InputBase value={name} onChange={(e) => setName(e.target.value)} placeholder={t('admin.pointsRules.fieldNamePh', '请输入规则名称')} sx={{ ...inputSx, width: '100%' }} />
        </Box>

        {/* Row 2: type + points */}
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <Typography sx={fieldLabelSx}>{t('admin.pointsRules.fieldType', '规则类型')}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#EF4444' }}>*</Typography>
            </Box>
            <Select size="small" value={type} onChange={(e: SelectChangeEvent) => setType(e.target.value as PointsRuleType)}
              sx={{ height: 40, borderRadius: '8px', fontSize: 13 }}>
              {RULE_TYPES.map((t) => <MenuItem key={t} value={t}>{RULE_TYPE_CONFIG[t].label}</MenuItem>)}
            </Select>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <Typography sx={fieldLabelSx}>{t('admin.pointsRules.fieldPoints', '积分值')}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#EF4444' }}>*</Typography>
            </Box>
            <InputBase value={points} onChange={(e) => setPoints(e.target.value)} placeholder={t('admin.pointsRules.fieldPointsPh', '请输入积分值')} sx={{ ...inputSx, width: '100%' }} />
          </Box>
        </Box>

        {/* Row 3: trigger */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Box sx={{ display: 'flex', gap: '2px' }}>
            <Typography sx={fieldLabelSx}>{t('admin.pointsRules.fieldTrigger', '触发条件')}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#EF4444' }}>*</Typography>
          </Box>
          <InputBase value={trigger} onChange={(e) => setTrigger(e.target.value)} placeholder={t('admin.pointsRules.fieldTriggerPh', '请输入触发条件描述')} sx={{ ...inputSx, width: '100%' }} />
        </Box>

        {/* Row 4: scope + method (display-only selects) */}
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Typography sx={fieldLabelSx}>{t('admin.pointsRules.fieldScope', '适用范围')}</Typography>
            <Select size="small" value="all" sx={{ height: 40, borderRadius: '8px', fontSize: 13 }}>
              <MenuItem value="all">{t('admin.pointsRules.scopeAll', '全部员工')}</MenuItem>
            </Select>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Typography sx={fieldLabelSx}>{t('admin.pointsRules.fieldMethod', '发放方式')}</Typography>
            <Select size="small" value="auto" sx={{ height: 40, borderRadius: '8px', fontSize: 13 }}>
              <MenuItem value="auto">{t('admin.pointsRules.methodAuto', '自动发放')}</MenuItem>
              <MenuItem value="manual">{t('admin.pointsRules.methodManual', '手动发放')}</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Row 5: status toggle */}
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Typography sx={fieldLabelSx}>{t('admin.pointsRules.fieldStatus', '状态')}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', height: 40 }}>
              <Box
                onClick={() => setStatus(status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE')}
                sx={{
                  width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative',
                  bgcolor: status === 'ACTIVE' ? '#2563EB' : '#CBD5E1', transition: 'background 0.2s',
                }}
              >
                <Box sx={{
                  position: 'absolute', top: 2, left: status === 'ACTIVE' ? 22 : 2,
                  width: 20, height: 20, borderRadius: '50%', bgcolor: '#fff',
                  transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </Box>
              <Typography sx={{ fontSize: 13, color: '#1E293B' }}>
                {status === 'ACTIVE' ? t('admin.pointsRules.statusActive') : t('admin.pointsRules.statusDisabled')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Row 6: description */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Typography sx={fieldLabelSx}>{t('admin.pointsRules.fieldDesc', '规则描述')}</Typography>
          <Box
            component="textarea"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder={t('admin.pointsRules.fieldDescPh', '请输入规则描述（选填）')}
            rows={3}
            sx={{
              width: '100%', px: '12px', py: '10px', borderRadius: '8px', border: '1px solid #E2E8F0',
              bgcolor: '#fff', fontSize: 13, color: '#1E293B', fontFamily: 'Inter, sans-serif',
              resize: 'none', outline: 'none', boxSizing: 'border-box',
              '&::placeholder': { color: '#94A3B8' }, '&:focus': { borderColor: '#2563EB' },
            }}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', px: 3, py: '16px', borderTop: DIVIDER }}>
        <Button variant="outlined" onClick={onClose} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 500, borderColor: '#E2E8F0', color: '#1E293B', px: 3 }}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !canSave}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 3, boxShadow: 'none' }}
        >
          {saving ? <CircularProgress size={16} color="inherit" /> : isEdit ? t('common.save') : t('admin.pointsRules.createRule', '创建规则')}
        </Button>
      </Box>
    </Dialog>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function PointsManagePage() {
  const { t } = useTranslation();

  const [rules, setRules] = useState<PointsRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PointsRule | null>(null);

  // Toast
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const showToast = (message: string, severity: 'success' | 'error' = 'success') =>
    setToast({ open: true, message, severity });

  const loadRules = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await pointsService.adminGetRules({ page: p - 1, size: PAGE_SIZE });
      const content = res.content ?? [];
      setRules(content);
      setTotalPages(res.totalPages ?? 1);
      setTotalElements(res.totalElements ?? content.length);
      setUsingFallback(false);
    } catch {
      // API not available — use fallback
      setRules(FALLBACK_RULES);
      setTotalPages(1);
      setTotalElements(FALLBACK_RULES.length);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRules(1); }, [loadRules]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    loadRules(value);
  };

  const openAdd = () => { setEditTarget(null); setDialogOpen(true); };
  const openEdit = (rule: PointsRule) => { setEditTarget(rule); setDialogOpen(true); };

  const handleSave = async (data: CreatePointsRuleRequest & { status: PointsRuleStatus }) => {
    if (usingFallback) {
      showToast(t('admin.pointsRules.apiNotReady', 'API 暂未就绪，无法保存'), 'error');
      return;
    }
    if (editTarget) {
      await pointsService.adminUpdateRule(editTarget.id, data);
      showToast(t('admin.pointsRules.updateSuccess', '规则已更新'));
    } else {
      await pointsService.adminCreateRule(data);
      showToast(t('admin.pointsRules.createSuccess', '规则已创建'));
    }
    loadRules(page);
  };

  const handleToggleStatus = async (rule: PointsRule) => {
    if (usingFallback) { showToast(t('admin.pointsRules.apiNotReady', 'API 暂未就绪'), 'error'); return; }
    const next = rule.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await pointsService.adminToggleRuleStatus(rule.id, next);
      showToast(next === 'ACTIVE' ? t('admin.pointsRules.enabled', '已启用') : t('admin.pointsRules.disabled', '已禁用'));
      loadRules(page);
    } catch {
      showToast(t('admin.pointsRules.toggleFailed', '操作失败'), 'error');
    }
  };

  // Stats
  const activeCount = rules.filter((r) => r.status === 'ACTIVE').length;
  const statValues: Record<string, string> = {
    totalRules: String(totalElements || rules.length),
    activeRules: String(activeCount),
    monthlyIssued: '128,500',
    beneficiaries: '257',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'text.primary' }}>
            {t('admin.pointsRules.title', '积分规则管理')}
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>
            {t('admin.pointsRules.subtitle')}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
          {t('admin.pointsRules.addRule')}
        </Button>
      </Box>

      {/* Stat cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {STAT_CARDS.map((card) => {
          const IconComp = card.icon;
          return (
            <Paper key={card.key} elevation={0}
              sx={{ display: 'flex', flexDirection: 'column', gap: '8px', p: '18px 20px', borderRadius: '12px', border: DIVIDER }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{t(`admin.pointsRules.${card.key}`)}</Typography>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComp sx={{ fontSize: 20, color: card.iconColor }} />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: 'text.primary' }}>{statValues[card.key]}</Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Rules table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: DIVIDER, overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: '#F1F5F9' } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '14px', px: '20px' }}>{t('admin.pointsRules.colName')}</TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '14px', px: '20px', width: 100 }}>{t('admin.pointsRules.colType')}</TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '14px', px: '20px', width: 100 }}>{t('admin.pointsRules.colPoints')}</TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '14px', px: '20px', width: 180 }}>{t('admin.pointsRules.colCondition')}</TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '14px', px: '20px', width: 70 }}>{t('admin.pointsRules.colStatus')}</TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '14px', px: '20px', width: 90 }}>{t('admin.pointsRules.colAction')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}><CircularProgress size={32} /></TableCell></TableRow>
              ) : rules.length === 0 ? (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: '#94A3B8', fontSize: 13 }}>{t('admin.pointsRules.noData', '暂无规则')}</TableCell></TableRow>
              ) : (
                rules.map((rule) => {
                  const typeCfg = RULE_TYPE_CONFIG[rule.type] ?? RULE_TYPE_CONFIG.OTHER;
                  return (
                    <TableRow key={rule.id} sx={{ '&:last-child td': { borderBottom: 0 }, opacity: rule.status === 'DISABLED' ? 0.6 : 1 }}>
                      <TableCell sx={{ py: '14px', px: '20px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>{rule.name}</Typography>
                          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{rule.description}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: '14px', px: '20px' }}>
                        <Chip label={typeCfg.label} size="small"
                          sx={{ fontSize: 11, fontWeight: 500, height: 24, borderRadius: '4px', bgcolor: typeCfg.bg, color: typeCfg.color }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: 14, fontWeight: 700, py: '14px', px: '20px', color: 'text.primary' }}>{rule.points}</TableCell>
                      <TableCell sx={{ fontSize: 12, py: '14px', px: '20px', color: 'text.secondary' }}>{rule.triggerCondition}</TableCell>
                      <TableCell sx={{ py: '14px', px: '20px' }}>
                        <Chip
                          label={rule.status === 'ACTIVE' ? t('admin.pointsRules.statusActive') : t('admin.pointsRules.statusDisabled')}
                          size="small"
                          sx={{
                            fontSize: 11, fontWeight: 500, height: 24, borderRadius: '12px',
                            bgcolor: rule.status === 'ACTIVE' ? '#DCFCE7' : '#F1F5F9',
                            color: rule.status === 'ACTIVE' ? '#166534' : '#64748B',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: '14px', px: '20px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Typography component="span" onClick={() => openEdit(rule)}
                            sx={{ fontSize: 12, fontWeight: 500, color: '#2563EB', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
                            {t('admin.pointsRules.edit')}
                          </Typography>
                          <Typography component="span" onClick={() => handleToggleStatus(rule)}
                            sx={{ fontSize: 12, fontWeight: 500, color: rule.status === 'ACTIVE' ? '#F59E0B' : '#16A34A', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
                            {rule.status === 'ACTIVE' ? t('admin.pointsRules.disable', '禁用') : t('admin.pointsRules.enable', '启用')}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '20px', py: '12px', borderTop: DIVIDER }}>
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            显示 1-{rules.length} 共 {totalElements} 条规则
          </Typography>
          <Pagination count={Math.max(1, totalPages)} page={page} onChange={handlePageChange} color="primary" shape="rounded" size="small" />
        </Box>
      </Paper>

      {/* Add/Edit Dialog */}
      <RuleDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} initial={editTarget} />

      {/* Toast */}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={toast.severity} onClose={() => setToast((s) => ({ ...s, open: false }))}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}

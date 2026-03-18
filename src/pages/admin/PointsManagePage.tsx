import { useState } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import RuleIcon from '@mui/icons-material/Rule';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TollIcon from '@mui/icons-material/Toll';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

type RuleStatus = 'active' | 'disabled';

type RuleType = 'seniority' | 'performance' | 'holiday' | 'project' | 'onboarding' | 'other';

interface MockRule {
  id: number;
  name: string;
  description: string;
  type: RuleType;
  points: string;
  condition: string;
  status: RuleStatus;
}

const MOCK_RULES: MockRule[] = [
  { id: 1, name: '每月基础积分', description: '每月固定发放基础福利积分', type: 'seniority', points: '500', condition: '每月1日自动发放', status: 'active' },
  { id: 2, name: '工龄纪念奖励', description: '员工入职满周年特别奖励', type: 'seniority', points: '1,000', condition: '入职满1/3/5/10年', status: 'active' },
  { id: 3, name: '入职欢迎积分', description: '新员工入职当天自动发放', type: 'onboarding', points: '200', condition: '入职当天自动触发', status: 'active' },
  { id: 4, name: '绩效优秀奖励', description: '季度绩效考核优秀员工奖励', type: 'performance', points: '200~800', condition: '绩效考核A及以上', status: 'active' },
  { id: 5, name: '重要项目奖励', description: '参与公司重点项目完成奖励', type: 'project', points: '500', condition: '项目完成后HR审批发放', status: 'active' },
  { id: 6, name: '推荐新员工奖励', description: '成功推荐新员工入职奖励', type: 'other', points: '300', condition: '被推荐人入职满3个月', status: 'disabled' },
];

const RULE_TYPE_CONFIG: Record<RuleType, { label: string; color: string; bg: string }> = {
  seniority:   { label: '工龄奖励',   color: '#1E40AF', bg: '#DBEAFE' },
  performance: { label: '绩效奖励',   color: '#065F46', bg: '#D1FAE5' },
  holiday:     { label: '节假日福利', color: '#92400E', bg: '#FEF3C7' },
  project:     { label: '项目奖励',   color: '#5B21B6', bg: '#EDE9FE' },
  onboarding:  { label: '入职奖励',   color: '#0E7490', bg: '#CFFAFE' },
  other:       { label: '其他',       color: '#374151', bg: '#F3F4F6' },
};

const STAT_CARDS = [
  { key: 'totalRules',     value: '6',       icon: RuleIcon,               iconColor: '#2563EB', iconBg: '#EFF6FF' },
  { key: 'activeRules',    value: '5',       icon: CheckCircleOutlineIcon, iconColor: '#16A34A', iconBg: '#DCFCE7' },
  { key: 'monthlyIssued',  value: '128,500', icon: TollIcon,               iconColor: '#D97706', iconBg: '#FEF3C7' },
  { key: 'beneficiaries',  value: '257',     icon: PeopleAltIcon,          iconColor: '#7C3AED', iconBg: '#EDE9FE' },
];

export default function PointsManagePage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'text.primary' }}>
            {t('admin.pointsRules.title')}
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>
            {t('admin.pointsRules.subtitle')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          {t('admin.pointsRules.addRule')}
        </Button>
      </Box>

      {/* Stat cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {STAT_CARDS.map((card) => {
          const IconComp = card.icon;
          return (
            <Paper
              key={card.key}
              elevation={0}
              sx={{ display: 'flex', flexDirection: 'column', gap: '8px', p: '18px 20px', borderRadius: '12px', border: '1px solid #F1F5F9' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  {t(`admin.pointsRules.${card.key}`)}
                </Typography>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComp sx={{ fontSize: 20, color: card.iconColor }} />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: 'text.primary' }}>
                {card.value}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #F1F5F9', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: '#F1F5F9' } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '14px', px: '20px' }}>
                  {t('admin.pointsRules.colName')}
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '14px', px: '20px', width: 100 }}>
                  {t('admin.pointsRules.colType')}
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '14px', px: '20px', width: 100 }}>
                  {t('admin.pointsRules.colPoints')}
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '14px', px: '20px', width: 180 }}>
                  {t('admin.pointsRules.colCondition')}
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '14px', px: '20px', width: 70 }}>
                  {t('admin.pointsRules.colStatus')}
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '14px', px: '20px', width: 90 }}>
                  {t('admin.pointsRules.colAction')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MOCK_RULES.map((rule) => {
                const typeCfg = RULE_TYPE_CONFIG[rule.type];
                return (
                  <TableRow key={rule.id} sx={{ '&:last-child td': { borderBottom: 0 }, opacity: rule.status === 'disabled' ? 0.6 : 1 }}>
                    {/* Name + description */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>
                          {rule.name}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                          {rule.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    {/* Type badge */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Chip
                        label={typeCfg.label}
                        size="small"
                        sx={{ fontSize: 11, fontWeight: 500, height: 24, borderRadius: '4px', bgcolor: typeCfg.bg, color: typeCfg.color }}
                      />
                    </TableCell>
                    {/* Points */}
                    <TableCell sx={{ fontSize: 14, fontWeight: 700, py: '14px', px: '20px', color: 'text.primary' }}>
                      {rule.points}
                    </TableCell>
                    {/* Condition */}
                    <TableCell sx={{ fontSize: 12, py: '14px', px: '20px', color: 'text.secondary' }}>
                      {rule.condition}
                    </TableCell>
                    {/* Status badge */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Chip
                        label={rule.status === 'active' ? t('admin.pointsRules.statusActive') : t('admin.pointsRules.statusDisabled')}
                        size="small"
                        sx={{
                          fontSize: 11, fontWeight: 500, height: 24, borderRadius: '12px',
                          bgcolor: rule.status === 'active' ? '#DCFCE7' : '#F1F5F9',
                          color: rule.status === 'active' ? '#166534' : '#64748B',
                        }}
                      />
                    </TableCell>
                    {/* Actions - text links */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Typography component="span" sx={{ fontSize: 12, fontWeight: 500, color: '#2563EB', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
                          {t('admin.pointsRules.edit')}
                        </Typography>
                        <Typography component="span" sx={{ fontSize: 12, fontWeight: 500, color: rule.status === 'active' ? '#F59E0B' : '#16A34A', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
                          {rule.status === 'active' ? '禁用' : '启用'}
                        </Typography>
                        <Typography component="span" sx={{ fontSize: 12, fontWeight: 500, color: '#EF4444', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
                          删除
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination inside card */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '20px', py: '12px', borderTop: '1px solid #F1F5F9' }}>
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            显示 1-{MOCK_RULES.length} 共 12 条规则
          </Typography>
          <Pagination
            count={2}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
            shape="rounded"
            size="small"
          />
        </Box>
      </Paper>
    </Box>
  );
}

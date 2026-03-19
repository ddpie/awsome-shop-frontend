import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';

const MOCK_ADDRESSES = [
  { id: '1', name: '李明', phone: '138****6789', province: '北京市', city: '海淀区', district: '中关村街道', detail: '中关村软件园 A 座 305', isDefault: true },
  { id: '2', name: '李明', phone: '138****6789', province: '上海市', city: '浦东新区', district: '陆家嘴街道', detail: '世纪大道 100 号环球金融中心 18F', isDefault: false },
];

export default function DeliveryInfoPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedAddr, setSelectedAddr] = useState('1');
  const [showNewForm, setShowNewForm] = useState(false);
  const [setDefault, setSetDefault] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', province: '', city: '', district: '', detail: '' });

  const handleField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 720, mx: 'auto', py: 4, px: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Header */}
        <Box>
          <Breadcrumbs sx={{ fontSize: 13, mb: 1 }}>
            <Link component={RouterLink} to="/" underline="hover" sx={{ fontSize: 13, color: '#2563EB' }}>
              {t('employee.nav.home')}
            </Link>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>{t('employee.delivery.title')}</Typography>
          </Breadcrumbs>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>{t('employee.delivery.title')}</Typography>
          <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.5 }}>{t('employee.delivery.subtitle')}</Typography>
        </Box>

        {/* Saved addresses */}
        <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B', px: 3, pt: 2.5, pb: 2 }}>
            {t('employee.delivery.savedAddresses')}
          </Typography>
          <Divider sx={{ borderColor: '#F1F5F9' }} />
          <RadioGroup value={selectedAddr} onChange={(e) => setSelectedAddr(e.target.value)}>
            {MOCK_ADDRESSES.map((addr, i) => (
              <Box key={addr.id}>
                <Box
                  onClick={() => setSelectedAddr(addr.id)}
                  sx={{
                    display: 'flex', alignItems: 'flex-start', gap: 1.5, px: 3, py: 2,
                    cursor: 'pointer',
                    bgcolor: selectedAddr === addr.id ? '#EFF6FF' : 'transparent',
                    border: selectedAddr === addr.id ? '1.5px solid #2563EB' : '1.5px solid transparent',
                    borderRadius: selectedAddr === addr.id ? '8px' : 0,
                    mx: selectedAddr === addr.id ? 2 : 0,
                    my: selectedAddr === addr.id ? 1 : 0,
                    transition: 'all 0.15s',
                  }}
                >
                  <FormControlLabel
                    value={addr.id}
                    control={<Radio size="small" sx={{ color: '#2563EB', '&.Mui-checked': { color: '#2563EB' } }} />}
                    label=""
                    sx={{ m: 0 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{addr.name}</Typography>
                      <Typography sx={{ fontSize: 13, color: '#64748B' }}>{addr.phone}</Typography>
                      {addr.isDefault && (
                        <Box sx={{ px: '8px', py: '2px', bgcolor: '#DBEAFE', borderRadius: '4px' }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#2563EB' }}>{t('employee.delivery.default')}</Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                      {addr.province}{addr.city}{addr.district} {addr.detail}
                    </Typography>
                  </Box>
                </Box>
                {i < MOCK_ADDRESSES.length - 1 && <Divider sx={{ borderColor: '#F8FAFC' }} />}
              </Box>
            ))}
          </RadioGroup>
        </Paper>

        {/* New address form */}
        <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2.5, pb: 2 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{t('employee.delivery.newAddress')}</Typography>
            <Typography
              component="span"
              onClick={() => setShowNewForm((v) => !v)}
              sx={{ fontSize: 13, color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}
            >
              <AddIcon sx={{ fontSize: 16 }} />{t('employee.delivery.addNew')}
            </Typography>
          </Box>
          {showNewForm && (
            <>
              <Divider sx={{ borderColor: '#F1F5F9' }} />
              <Box sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField fullWidth size="small" label={`* ${t('employee.delivery.fieldName')}`}
                      value={form.name} onChange={handleField('name')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  </Grid>
                  <Grid size={6}>
                    <TextField fullWidth size="small" label={`* ${t('employee.delivery.fieldPhone')}`}
                      value={form.phone} onChange={handleField('phone')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  </Grid>
                  <Grid size={4}>
                    <TextField fullWidth size="small" label={`* ${t('employee.delivery.fieldProvince')}`}
                      value={form.province} onChange={handleField('province')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  </Grid>
                  <Grid size={4}>
                    <TextField fullWidth size="small" label={t('employee.delivery.fieldCity')}
                      value={form.city} onChange={handleField('city')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  </Grid>
                  <Grid size={4}>
                    <TextField fullWidth size="small" label={t('employee.delivery.fieldDistrict')}
                      value={form.district} onChange={handleField('district')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth size="small" label={`* ${t('employee.delivery.fieldDetail')}`}
                      placeholder={t('employee.delivery.fieldDetailPlaceholder')}
                      value={form.detail} onChange={handleField('detail')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  </Grid>
                </Grid>
                <FormControlLabel
                  control={<Checkbox size="small" checked={setDefault} onChange={(e) => setSetDefault(e.target.checked)} />}
                  label={<Typography sx={{ fontSize: 13, color: '#64748B' }}>{t('employee.delivery.setDefault')}</Typography>}
                />
              </Box>
            </>
          )}
        </Paper>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained" fullWidth
            startIcon={<CheckCircleIcon />}
            onClick={() => navigate('/orders')}
            sx={{ height: 48, borderRadius: '8px', fontSize: 15, fontWeight: 600, textTransform: 'none', boxShadow: 'none' }}
          >
            {t('employee.delivery.confirmBtn')}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ height: 48, px: 4, borderRadius: '8px', fontSize: 14, fontWeight: 500, textTransform: 'none', borderColor: '#E2E8F0', color: '#64748B' }}
          >
            {t('common.back')}
          </Button>
        </Box>

      </Box>
    </Box>
  );
}

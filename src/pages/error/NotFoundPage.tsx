import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <Typography variant="h1" fontWeight={700} color="text.disabled" sx={{ fontSize: 120 }}>
        {t('notFound.title')}
      </Typography>
      <Typography variant="h6" color="text.secondary">
        {t('notFound.message')}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2, borderRadius: 2 }}>
        {t('notFound.backHome')}
      </Button>
    </Box>
  );
}

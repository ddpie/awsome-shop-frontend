import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RedeemIcon from '@mui/icons-material/Redeem';
import { useAuthStore } from '../../stores/auth.store';
import { getTheme } from '../../theme';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading } = useAuthStore();
  const lightTheme = useMemo(() => getTheme('light'), []);

  useEffect(() => {
    const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    if (i18n.language !== browserLang) i18n.changeLanguage(browserLang);
  }, [i18n]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    setError(false);
    try {
      await login({ username, password });
    } catch {
      setError(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
        {/* Left Brand Panel */}
        <Box
          sx={{
            width: 640,
            flexShrink: 0,
            bgcolor: 'primary.main',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            p: '60px',
          }}
        >
          <RedeemIcon sx={{ fontSize: 64, color: '#fff' }} />
          <Typography sx={{ color: '#fff', fontSize: 40, fontWeight: 700 }}>
            {t('login.brand')}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>
            {t('login.brandSubtitle')}
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 15,
              lineHeight: 1.6,
              textAlign: 'center',
              maxWidth: 300,
              whiteSpace: 'pre-line',
            }}
          >
            {t('login.brandDesc')}
          </Typography>
        </Box>

        {/* Right Login Panel */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#fff',
            p: '80px',
          }}
        >
          <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: 'text.primary' }}>
                {t('login.title')}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                {t('login.subtitle')}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {t('login.loginFailed')}
              </Alert>
            )}
            <Alert severity="info" sx={{ borderRadius: 2, fontSize: 13 }}>
              {t('login.hint')}
            </Alert>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }} onKeyDown={handleKeyDown}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>
                  {t('login.usernameLabel')}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={t('login.usernamePlaceholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      sx: {
                        height: 44,
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>
                  {t('login.passwordLabel')}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            aria-label={showPassword ? '隐藏密码' : '显示密码'}
                          >
                            {showPassword
                              ? <VisibilityIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                              : <VisibilityOffIcon sx={{ fontSize: 20, color: 'text.disabled' }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        height: 44,
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              disabled={loading}
              sx={{
                height: 48,
                borderRadius: '8px',
                fontSize: 16,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {loading ? t('login.loggingIn') : t('login.loginBtn')}
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

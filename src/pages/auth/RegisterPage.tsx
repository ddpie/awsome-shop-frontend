import { useMemo, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RedeemIcon from '@mui/icons-material/Redeem';
import { authService } from '../../services/auth.service';
import { getTheme } from '../../theme';

const inputSx = {
  height: 44,
  borderRadius: '8px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
};

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lightTheme = useMemo(() => getTheme('light'), []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (!username || !password || !confirmPassword || !displayName || !employeeId) {
      setError(t('register.registerFailed'));
      return;
    }
    if (password.length < 8) {
      setError(t('register.passwordTooShort'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        username,
        password,
        name: displayName,
        employeeId,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setError(status === 409 ? t('register.usernameTaken') : t('register.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRegister();
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

        {/* Right Register Panel */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#fff',
            p: '80px',
            overflowY: 'auto',
          }}
        >
          <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: 'text.primary' }}>
                {t('register.title')}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                {t('register.subtitle')}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                {t('register.registerSuccess')}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }} onKeyDown={handleKeyDown}>
              {/* Username */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>
                  {t('register.usernameLabel')}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={t('register.usernamePlaceholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      sx: inputSx,
                    },
                  }}
                />
              </Box>

              {/* Password */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>
                  {t('register.passwordLabel')}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('register.passwordPlaceholder')}
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
                          <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword
                              ? <VisibilityIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                              : <VisibilityOffIcon sx={{ fontSize: 20, color: 'text.disabled' }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: inputSx,
                    },
                  }}
                />
              </Box>

              {/* Confirm Password */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>
                  {t('register.confirmPasswordLabel')}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder={t('register.confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowConfirm(!showConfirm)} edge="end">
                            {showConfirm
                              ? <VisibilityIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                              : <VisibilityOffIcon sx={{ fontSize: 20, color: 'text.disabled' }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: inputSx,
                    },
                  }}
                />
              </Box>

              {/* Display Name */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>
                  {t('register.nameLabel')}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={t('register.namePlaceholder')}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      sx: inputSx,
                    },
                  }}
                />
              </Box>

              {/* Employee ID */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>
                  {t('register.employeeIdLabel')}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={t('register.employeeIdPlaceholder')}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AssignmentIndIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      sx: inputSx,
                    },
                  }}
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleRegister}
              disabled={loading}
              sx={{
                height: 48,
                borderRadius: '8px',
                fontSize: 16,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {loading ? t('register.registering') : t('register.registerBtn')}
            </Button>

            <Typography sx={{ fontSize: 14, color: 'text.secondary', textAlign: 'center' }}>
              {t('register.hasAccount')}{' '}
              <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
                {t('register.loginNow')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

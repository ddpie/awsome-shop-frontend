import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingSpinnerProps {
  fullPage?: boolean;
  size?: number;
}

export default function LoadingSpinner({ fullPage = false, size = 40 }: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255,255,255,0.7)',
          zIndex: 9999,
        }}
      >
        <CircularProgress size={size} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
      <CircularProgress size={size} />
    </Box>
  );
}

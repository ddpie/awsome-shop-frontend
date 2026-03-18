import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { ToastSeverity } from '../../hooks/useToast';

interface ToastProps {
  open: boolean;
  message: string;
  severity?: ToastSeverity;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  open,
  message,
  severity = 'info',
  onClose,
  duration = 3000,
}: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ minWidth: 280 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

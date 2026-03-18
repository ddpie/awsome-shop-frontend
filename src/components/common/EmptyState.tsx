import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  message = '暂无数据',
  icon,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        py: 8,
        color: 'text.disabled',
      }}
    >
      {icon ?? <InboxIcon sx={{ fontSize: 56 }} />}
      <Typography sx={{ fontSize: 14 }}>{message}</Typography>
    </Box>
  );
}

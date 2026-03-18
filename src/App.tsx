import { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from 'react-router';
import { getTheme } from './theme';
import { useAppStore } from './stores/app.store';
import ErrorBoundary from './components/common/ErrorBoundary';
import router from './router';

export default function App() {
  const darkMode = useAppStore((s) => s.darkMode);
  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

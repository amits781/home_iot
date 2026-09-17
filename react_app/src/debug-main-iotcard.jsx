import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ClerkProvider } from '@clerk/clerk-react';
import IotCard from './components/IotCard/IotCard';
import { GLASS_RADIUS, glassSurfaceStyle, appBackgroundStyle } from './theme/glass';

const clerkPubKey = import.meta.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const realFetch = window.fetch.bind(window);
window.fetch = (url, ...rest) => {
  if (typeof url === 'string' && url.includes('/motorStatus')) {
    return Promise.resolve(
      new Response(JSON.stringify({ status: 200, payload: { status: 0, strength: 3 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }
  return realFetch(url, ...rest);
};

const theme = createTheme({
  palette: { mode: 'dark', primary: { main: '#e34040', contrastText: '#000' } },
  shape: { borderRadius: GLASS_RADIUS },
  components: {
    MuiCssBaseline: { styleOverrides: { body: appBackgroundStyle('dark') } },
    MuiPaper: { styleOverrides: { root: glassSurfaceStyle('dark') } },
    MuiButton: { styleOverrides: { root: { borderRadius: 14, textTransform: 'none', fontWeight: 600 } } },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <IotCard />
      </div>
    </ThemeProvider>
  </ClerkProvider>
);

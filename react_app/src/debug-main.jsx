// Temporary, non-shipping harness to render ActivityPage in isolation (no
// Clerk sign-in required) for headless visual/DOM debugging of the
// LiquidGlass effect across all its usages. Not referenced by index.html.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ClerkProvider } from '@clerk/clerk-react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ActivityPage from './components/ActivityPage/ActivityPage';
import { GLASS_RADIUS, glassSurfaceStyle } from './theme/glass';

const clerkPubKey = import.meta.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const rows = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  startByOperator: 'app',
  endByOperator: 'app',
  startTime: Date.now() - i * 3600_000,
  endTime: Date.now() - i * 3600_000 + 60_000,
  duration: 60,
}));

const realFetch = window.fetch.bind(window);
window.fetch = (url, ...rest) => {
  const u = typeof url === 'string' ? url : '';
  if (u.includes('/checkAuth')) {
    return Promise.resolve(new Response(JSON.stringify({ status: 200 }), { status: 200 }));
  }
  if (u.includes('/activities/totalConsumption')) {
    return Promise.resolve(
      new Response(JSON.stringify({ status: 200, payload: { totalConsumption: 15975 } }), { status: 200 })
    );
  }
  if (u.includes('/activities')) {
    return Promise.resolve(
      new Response(
        JSON.stringify({ status: 200, payload: { content: rows, totalElements: rows.length } }),
        { status: 200 }
      )
    );
  }
  return realFetch(url, ...rest);
};

// Fine radial-line background: any refraction/displacement warps these
// lines visibly, whereas plain blur just softens them without bending them.
const radialLinesBackground = {
  backgroundColor: '#141414',
  backgroundImage: `repeating-conic-gradient(from 0deg, #e34040 0deg 4deg, #111 4deg 8deg)`,
  backgroundSize: '100% 100%',
};

const theme = createTheme({
  palette: { mode: 'dark', primary: { main: '#e34040', contrastText: '#000' } },
  shape: { borderRadius: GLASS_RADIUS },
  components: {
    MuiCssBaseline: { styleOverrides: { body: radialLinesBackground } },
    MuiPaper: { styleOverrides: { root: glassSurfaceStyle('dark') } },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <ActivityPage />
        </BrowserRouter>
      </ThemeProvider>
    </LocalizationProvider>
  </ClerkProvider>
);

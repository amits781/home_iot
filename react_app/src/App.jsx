import './App.css';
import React, { useEffect } from 'react';
import HomePage from './components/HomePage/HomePage';
import SignInSide from './components/SiginPage/SiginPage';
import ResponsiveAppBar from './components/Navbar/navbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ActivityPage from './components/ActivityPage/ActivityPage';
import ErrorPage from './components/ErrorPage/ErrorPage';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { dark } from '@clerk/themes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { GLASS_RADIUS, glassSurfaceStyle, appBackgroundStyle } from './theme/glass';

const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function App() {
  if (!import.meta.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
  }

  const clerkPubKey = import.meta.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
  const [mode, setMode] = React.useState('dark');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#e34040',
            contrastText: '#000',
            mainTransparent: '#e34040b3',
          }
        },
        shape: { borderRadius: GLASS_RADIUS },
        typography: {
          // App-wide baseline: body/UI text renders at 0.8rem.
          // Headings (h1-h6) are untouched.
          body1: { fontSize: '0.8rem' },
          body2: { fontSize: '0.8rem' },
          subtitle1: { fontSize: '0.8rem' },
          subtitle2: { fontSize: '0.8rem' },
          button: { fontSize: '0.8rem' },
          caption: { fontSize: '0.8rem' },
          overline: { fontSize: '0.8rem' },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: appBackgroundStyle(mode),
              '*': {
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // old Edge/IE
              },
              '*::-webkit-scrollbar': {
                display: 'none', // Chrome/Safari/new Edge
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              // No explicit borderRadius here: Paper already applies
              // theme.shape.borderRadius unless its `square` prop is set,
              // and hardcoding it here would override that opt-out.
              root: glassSurfaceStyle(mode),
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 14,
                textTransform: 'none',
                fontWeight: 600,
              },
              contained: {
                backgroundImage:
                  'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)',
                boxShadow: '0 8px 20px -6px rgba(0,0,0,0.35)',
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 14,
                margin: '2px 8px',
                width: 'auto',
              },
            },
          },
          // These two hardcode their own px font sizes rather than reading
          // a `typography` variant, so the blanket 0.8rem baseline above
          // doesn't reach them.
          MuiListSubheader: {
            styleOverrides: {
              root: { fontSize: '0.8rem' },
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              root: { fontSize: '0.8rem' },
              selectLabel: { fontSize: '0.8rem' },
              displayedRows: { fontSize: '0.8rem' },
            },
          },
        },
      }),
    [mode],
  );

  useEffect(() => {
    // Parse the current URL
    const url = new URL(window.location.href);

    // Get the current pathname from the URL
    const pathname = window.location.pathname;

    // Check if the pathname or 'redirect_url' query parameter contains the string "error"
    if (pathname.includes('error') || url.searchParams.get('redirect_url')?.includes('error')) {
      // Remove "/error" from the pathname
      const updatedPathname = '';

      // Update the URL with the corrected pathname
      url.pathname = updatedPathname;

      // Remove the 'redirect_url' query parameter
      url.searchParams.delete('redirect_url');

      // Replace the current URL without the 'redirect_url' query parameter
      window.history.replaceState({}, '', url.toString());
    }
  }, []);


  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <ClerkProvider appearance={{
            baseTheme: mode === 'dark' ? dark : null
          }} publishableKey={clerkPubKey}
            signInUrl='/'
            signUpUrl='/'
          >
            <SignedIn>
              <>
                <BrowserRouter>
                  <ResponsiveAppBar colorMode={colorMode} theme={theme} />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/activity" element={<ActivityPage />} />
                    <Route path="*" element={<ErrorPage />} />
                  </Routes>
                </BrowserRouter>
              </>
            </SignedIn>
            <SignedOut>
              <SignInSide />
            </SignedOut>
          </ClerkProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </LocalizationProvider>
  );
}

export default App;

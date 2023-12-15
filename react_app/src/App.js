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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function App() {
  if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
  }

  const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              <SignInSide theme={theme} />
            </SignedOut>
          </ClerkProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </LocalizationProvider>
  );
}

export default App;

// Temporary A/B harness: device-card-sized glass vs activity-sized glass over
// the identical backdrop, to isolate why one reads as glass and the other
// does not. Not referenced by index.html.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GlassSurface from './components/LiquidGlass/GlassSurface';
import PageBackdrop from './components/UtilComponent/PageBackdrop';
import { GLASS_RADIUS, glassSurfaceStyle, appBackgroundStyle } from './theme/glass';

const theme = createTheme({
  palette: { mode: 'dark', primary: { main: '#e34040', contrastText: '#000' } },
  shape: { borderRadius: GLASS_RADIUS },
  components: {
    MuiCssBaseline: { styleOverrides: { body: appBackgroundStyle('dark') } },
    MuiPaper: { styleOverrides: { root: glassSurfaceStyle('dark') } },
  },
});

function Label({ children }) {
  return <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>{children}</Typography>;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <PageBackdrop imageUrl="/static/rose_bg.jpeg" />
    <Box sx={{ position: 'relative', zIndex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Exactly the device card's GlassSurface props and size. */}
      <GlassSurface borderRadius={28} sx={{ width: 460, minHeight: 430 }}>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Label>A — device card size (460 x 430)</Label>
        </Box>
      </GlassSurface>

      {/* Same props, activity-table size. */}
      <GlassSurface borderRadius={28} sx={{ width: '100%', minHeight: 548 }}>
        <Box sx={{ width: '100%' }}>
          <Label>B — activity table size (full width x 548)</Label>
        </Box>
      </GlassSurface>

      {/* Same props, activity summary-card size. */}
      <GlassSurface borderRadius={28} sx={{ width: 819, minHeight: 144 }}>
        <Box sx={{ width: '100%' }}>
          <Label>C — activity summary size (819 x 144)</Label>
        </Box>
      </GlassSurface>
    </Box>
  </ThemeProvider>
);

import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import {
  UserButton,
} from "@clerk/clerk-react";
import TemporaryDrawer from '../DrawerSwipe/DrawerSwipe';
import GlassSurface from '../LiquidGlass/GlassSurface';
import { useAppBackground } from '../Utils/appBackground';
import { useLocation } from 'react-router-dom';

const pages = [];
const siteName = 'AIDYN';

function ResponsiveAppBar({ colorMode, theme }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const backgroundImageUrl = useAppBackground();

  // ErrorPage is reached at /error (see UNAUTHORIZED_ROUTE in Utils/checkAuth),
  // and only there does the header pick up the red alert glow.
  const { pathname } = useLocation();
  const isErrorPage = pathname.startsWith('/error');

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 12,
        mx: { xs: 1, sm: 2, md: 3 },
        zIndex: (t) => t.zIndex.appBar,
        color: 'text.primary',
      }}
    >
      {/* The header carries `zIndex: appBar` so it stays above the page's
          fixed PageBackdrop, and that z-index makes it a stacking context —
          which leaves the glass below with no backdrop to sample, so it
          rendered as a flat dark bar. This paints the same wallpaper inside
          that stacking context, clipped to the header. `backgroundAttachment:
          fixed` sizes and positions the image against the viewport exactly as
          PageBackdrop does, so the copy lines up with the page's own
          wallpaper instead of showing a separate crop. */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '24px',
          pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImageUrl})`,
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <GlassSurface borderRadius={24} padding="0px 16px" sx={{ width: '100%' }}>
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 } }}>
          <TemporaryDrawer />
          {/* <HubTwoToneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {siteName}
          </Typography>

          <Box sx={{ flexGrow: 1, display: pages.size > 0 ? { xs: 'flex', md: 'none' } : 'none' }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <HubTwoToneIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {siteName}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit" size="large">
              {theme.palette.mode === 'dark' ? <Brightness7Icon fontSize="medium" /> : <Brightness4Icon fontSize="medium" />}
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <UserButton />
          </Box>
        </Toolbar>
      </Container>
      </GlassSurface>

      {/* Inset alert glow, error page only. It has to be its own layer drawn
          *after* GlassSurface: an `inset` box-shadow on the header wrapper
          would be painted underneath both the wallpaper copy and the glass
          panel, so nothing of it would show. Absolutely positioned over the
          panel with the same 24px radius, and pointer-events: none so it
          never swallows a click on the menu or the avatar. */}
      {isErrorPage && (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '24px',
            pointerEvents: 'none',
            boxShadow: 'inset 0 0 28px 6px rgba(227, 64, 64, 0.5)',
          }}
        />
      )}
    </Box>
  );
}
export default ResponsiveAppBar;


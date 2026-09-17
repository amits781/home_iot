import * as React from 'react';
import './DrawerSwipe.css';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import { IconButton, ListSubheader } from '@mui/material';
import MyMenuItem from '../MyMenuItem/MyMenuItem';

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List
        sx={{ width: '100%', maxWidth: 360 }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader sx={{ backgroundColor: 'inherit' }} component="div" id="nested-list-subheader">
            Menu
          </ListSubheader>
        }
      >
        <Divider />
        {[{ name: "Devices", icon: <DeveloperBoardIcon />, linkUrl: "/" }, { name: "Activity", icon: <QueryStatsIcon />, linkUrl: "/activity" }].map((item, index) => (
          <ListItem key={index} disablePadding>
            <MyMenuItem item={item} />
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* <List>
        {['All mail'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={Link} to={'/activity'}>
              <ListItemIcon>
                {index % 2 === 0 ? <DeveloperBoardIcon /> : <QueryStatsIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(anchor, true)}
            sx={{ mr: 2, ...(state[anchor] && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            // The drawer's Paper is already the glass surface: the theme's
            // MuiPaper override gives it the translucent fill, the backdrop
            // blur and the hairline border, and its backdrop-filter does
            // resolve here.
            //
            // A GlassPanel used to be overlaid on top of it as well.
            // liquid-glass-react sizes and centres its specular ring from a
            // single measurement taken on mount, and inside the sliding drawer
            // that ring landed offset from the panel it belongs to — so the
            // drawer showed that ring *and* this Paper's own border as two
            // nested outlines. (The panel's own glass ended up translated
            // off-screen, so it contributed nothing but the stray outline.)
            // The Paper is now the only surface, which leaves one border.
            //
            // Styled from the Drawer's `sx` rather than `PaperProps.sx`: the
            // latter never reached the Paper at all here, which is why the
            // `backgroundColor: 'transparent'` that used to sit in it had no
            // effect.
            sx={{
              '& .MuiDrawer-paper': {
                borderTopRightRadius: 24,
                borderBottomRightRadius: 24,
                borderLeft: 'none',
                overflow: 'hidden',
              },
            }}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
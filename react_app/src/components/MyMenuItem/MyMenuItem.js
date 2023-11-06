import React from 'react';
import './MyMenuItem.css';

import { NavLink, useLocation } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function MyMenuItem({ item }) {
  const location = useLocation();
  const theme = useTheme();

  // Check if the current location matches the NavLink's "to" prop
  const isActive = location.pathname === item.linkUrl;
  const isDarkTheme = theme.palette.mode === 'dark';

  return (
    <ListItemButton
      component={NavLink}
      to={item.linkUrl}
      sx={{ backgroundColor: isActive? isDarkTheme? '#0000009c' : theme.palette.primary.mainTransparent: '' }}
    >
      <ListItemIcon>
        {item.icon}
      </ListItemIcon>
      <ListItemText primary={item.name} />
    </ListItemButton>
  );
}


export default MyMenuItem;

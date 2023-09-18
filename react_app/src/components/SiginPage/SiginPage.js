import * as React from 'react';
import './SiginPage.css';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { SignIn } from "@clerk/clerk-react";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      AIDYN{' '}
      {new Date().getFullYear()}
      {' Website.'}
    </Typography>
  );
}

export default function SignInSide({ theme }) {
  return (
    <Grid container component="main" sx={{
      height: "100vh",
      backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
      backgroundRepeat: 'no-repeat',
      backgroundColor: (t) =>
        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={6} lg={5} component={Paper} elevation={6} square sx={{
        background: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(225,225,225,0.4)',
        backdropFilter: "blur(10px) !important",
      }}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

          }}
        >

          <LockOutlinedIcon />
          <Typography component="h1" variant="h5" sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            AIDYN
          </Typography>
          <Box sx={{ mt: 1 }}>
            <SignIn />
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
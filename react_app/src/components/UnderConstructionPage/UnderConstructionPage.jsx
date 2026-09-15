import React from 'react';
import './UnderConstructionPage.css';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { useTheme } from '@mui/material/styles';

const UnderConstructionPage = () => {
  
  const theme = useTheme();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="false" >
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="warning">This page is under maintenance.</Alert>
          </Stack>
          <Card sx={{ width: '75%', height: '75%', marginTop:'30px' }}>
            <CardMedia
              sx={{ height: '75%', backgroundSize: 'contain' , backgroundColor: theme.palette.mode === 'dark' ? "black": "white", backgroundBlendMode: theme.palette.mode === 'dark' ? "hard-light":"darken"}}
              image={theme.palette.mode === 'dark' ? "/static/maintenance.jpg": "/static/under_construction_light.png"}
              title="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Coming Soon...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This site is still under development, once developed this page will contain the stats for the device operations.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </React.Fragment>
  )
}

export default UnderConstructionPage;

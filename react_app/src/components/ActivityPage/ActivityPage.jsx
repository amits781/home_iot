import React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import StickyHeadTable from '../StickyHeadTable/StickyHeadTable';
import AnimatedNumbersCustom from '../AnimatedNumbers/AnimatedNumbers';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useState, useEffect } from 'react';
import { getHeadersFromToken, hostUrl, navbarHeight } from '../Utils/Utils';
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import DataSkeleton from '../UtilComponent/DataSkeleton';
import PageBackdrop from '../UtilComponent/PageBackdrop';
import GlassPanel from '../LiquidGlass/GlassPanel';
import { transparentPaperSx } from '../../theme/glass';
import usePixabayBackground from '../Utils/usePixabayBackground';

const ActivityPage = () => {

  const { getToken } = useAuth();
  const navigate = useNavigate();
  const backgroundImageUrl = usePixabayBackground('abstract dark', 'computer');

  // Left unset (no lower/upper bound) until the user picks a filter, so the
  // table and total consumption both start out covering the full history.
  const [selectedFromDate, setSelectedFromDate] = React.useState(null);
  const [selectedToDate, setSelectedToDate] = React.useState(null);

  const [totalConsumption, setTotalConsumption] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleDateChange = (date, setFunction) => {
    setFunction(date);
  };

  // First useEffect for authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        const url = hostUrl + '/checkAuth';
        const response = await fetch(url, {
          method: 'GET',
          headers: getHeadersFromToken(token),
        });

        if (response.status === 200) {
          // setLoading(false);
        } else {
          const responseData = await response.json();
          console.log("Check Auth Fail: " + responseData.payload);
          navigate('/error?cause=user_unauthorized');
        }
      } catch (error) {
        console.log("Check Auth Fail: " + error.message);
        navigate('/error?cause=unexpected_error');
      }
    };

    checkAuth();
  }, [getToken, navigate]);

  // Total consumption is computed server-side (rate applied there too) so it
  // stays correct even if the client changes; re-fetched whenever the date
  // filter changes since the figure is scoped to the selected range.
  useEffect(() => {
    let cancelled = false;

    const fetchTotalConsumption = async () => {
      const params = new URLSearchParams();
      if (selectedFromDate) {
        params.set('from', selectedFromDate.format('YYYY-MM-DD'));
      }
      if (selectedToDate) {
        params.set('to', selectedToDate.format('YYYY-MM-DD'));
      }

      try {
        const token = await getToken();
        const response = await fetch(`${hostUrl}/activities/totalConsumption?${params.toString()}`, {
          method: 'GET',
          headers: getHeadersFromToken(token),
        });
        const responseData = await response.json();

        if (!cancelled && response.status === 200) {
          setTotalConsumption(responseData.payload.totalConsumption);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching total consumption:', error);
      }
    };

    fetchTotalConsumption();

    return () => {
      cancelled = true;
    };
  }, [selectedFromDate, selectedToDate, getToken]);

  function ActivityPageSummary() {
    return (<React.Fragment>
      <Grid xs={12} md={8} display="flex" justifyContent="left" alignItems="left">
        <GlassPanel borderRadius={20} sx={{ width: '100%' }}>
          <Card sx={{
            minWidth: { sm: 275, xs: '100%' },
            overflow: 'auto',
            textAlign: { xs: 'center', sm: 'left' },
            ...transparentPaperSx,
          }}>
            <CardContent sx={{ py: 1.5 }}>
              <Typography sx={{ fontSize: '0.8rem', marginBottom: 1 }} color="text.secondary" gutterBottom>
                Filter Data
              </Typography>
              <Stack direction="row" spacing={1}>
                <DatePicker
                  sx={{ flex: 1, minWidth: 0 }}
                  label="From"
                  disableFuture={true}
                  defaultValue={selectedFromDate}
                  views={['year', 'month', 'day']}
                  onChange={(date) => handleDateChange(date, setSelectedFromDate)}
                  slotProps={{
                    textField: { size: 'small' }
                  }} />
                <DatePicker
                  sx={{ flex: 1, minWidth: 0 }}
                  label="To"
                  disableFuture={true}
                  minDate={selectedFromDate || undefined}
                  defaultValue={selectedToDate}
                  onChange={(date) => handleDateChange(date, setSelectedToDate)}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    textField: { size: 'small' }
                  }} />
              </Stack>
            </CardContent>
          </Card>
        </GlassPanel>
      </Grid>
      <Grid xs={12} md={4} display="flex" justifyContent="right" alignItems="right">
        {/*
          The rupee figure animates continuously (spring-driven digit
          ticks). Putting animating content *inside* a GlassPanel forces the
          browser to recompute the expensive backdrop/SVG filter on every
          animation frame. Keeping GlassPanel as a plain, static background
          layer and the animating Card as a normal sibling on top lets the
          browser composite them independently, so the glass is computed
          once and only the (cheap, transform-based) number repaints.
        */}
        <Box sx={{ position: 'relative', width: '100%' }}>
          <GlassPanel borderRadius={20} sx={{ position: 'absolute', inset: 0, zIndex: 0 }} />
          <Card sx={{
            position: 'relative',
            zIndex: 1,
            minWidth: { sm: 275, xs: '100%' },
            overflow: 'auto',
            textAlign: { xs: 'left' },
            display: 'flex',
            alignItems: 'center',
            ...transparentPaperSx,
          }}>
            <CardContent>
              <Typography sx={{ fontSize: '0.8rem' }} color="text.secondary" gutterBottom>
                Total consumption
              </Typography>
              <Typography variant='body' sx={{ fontSize: { xs: '2rem', sm: '4rem' } }}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent={{ xs: 'center', sm: 'left' }}
                  alignItems={{ xs: 'center', sm: 'left' }}
                >
                  <span>&#8377;</span>
                  <AnimatedNumbersCustom num={totalConsumption} />
                </Stack>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </React.Fragment>);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <PageBackdrop imageUrl={backgroundImageUrl} />
      <Container maxWidth="false" sx={{
        margin: 0,
        padding: '0px !important',
        overflow: 'auto',
        minHeight: `calc(100vh - ${navbarHeight}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{ flexGrow: 1, paddingTop: '20px', overflow: 'auto' }}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ margin: '0 20px' }}>
            {
              loading ? <React.Fragment /> : <ActivityPageSummary />
            }
            <Grid xs={12}>
              {
                loading ? <DataSkeleton /> : <StickyHeadTable fromDate={selectedFromDate} toDate={selectedToDate} />
              }
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  )


}

export default ActivityPage

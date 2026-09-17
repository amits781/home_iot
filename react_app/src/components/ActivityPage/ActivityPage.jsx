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
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useState, useEffect } from 'react';
import { getHeadersFromToken, hostUrl, navbarHeight } from '../Utils/Utils';
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import DataSkeleton from '../UtilComponent/DataSkeleton';
import PageBackdrop from '../UtilComponent/PageBackdrop';
import GlassSurface from '../LiquidGlass/GlassSurface';
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

        if (response.status !== 200) {
          const responseData = await response.json();
          console.log("Check Auth Fail: " + responseData.payload);
        }
      } catch (error) {
        console.log("Check Auth Fail: " + error.message);
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
      <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex' }}>
        <GlassSurface borderRadius={28} sx={{ width: '100%', minHeight: 120 }}>
          <Box
            sx={{
              width: '100%',
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
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
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                sx={{ flex: 1, minWidth: 0 }}
                label="To"
                disableFuture={true}
                minDate={selectedFromDate || undefined}
                defaultValue={selectedToDate}
                onChange={(date) => handleDateChange(date, setSelectedToDate)}
                views={['year', 'month', 'day']}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Stack>
          </Box>
        </GlassSurface>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
        <GlassSurface borderRadius={28} sx={{ width: '100%', minHeight: 120 }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography sx={{ fontSize: '0.8rem' }} color="text.secondary" gutterBottom>
                Total consumption
              </Typography>
              <Typography variant='body' sx={{ fontSize: { xs: '2rem', sm: '4rem' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, alignItems: { xs: 'center', sm: 'flex-start' } }}>
                  <span>&#8377;</span>
                  <AnimatedNumbersCustom num={totalConsumption} />
                </Box>
              </Typography>
            </Box>
          </Box>
        </GlassSurface>
      </Grid>
    </React.Fragment>);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <PageBackdrop imageUrl={backgroundImageUrl} />
      {/* No `zIndex` here on purpose. A z-index on a positioned element makes
          it a stacking context, and the glass panels inside it then have no
          backdrop to sample: PageBackdrop is a sibling *outside* this
          Container, so the wallpaper is not part of that stacking context and
          `backdrop-filter` resolves against nothing, leaving every panel fully
          transparent. HomePage keeps its z-index only because it renders
          PageBackdrop *inside* the same stacking context. Paint order is
          already correct without it: this Container is still positioned and
          comes after PageBackdrop in the DOM, so it paints above the
          wallpaper. */}
      <Container maxWidth={false} sx={{
        position: 'relative',
        margin: 0,
        padding: '0px !important',
        overflow: 'auto',
        minHeight: `calc(100vh - ${navbarHeight}px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Box sx={{ width: '100%', maxWidth: 1280, margin: '20px auto', px: { xs: 1.5, sm: 2.5 } }}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {
              loading ? <React.Fragment /> : <ActivityPageSummary />
            }
            <Grid size={12}>
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

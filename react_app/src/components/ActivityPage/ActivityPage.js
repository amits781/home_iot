import React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import StickyHeadTable from '../StickyHeadTable/StickyHeadTable';
import AnimatedNumbersCustom from '../AnimatedNumbers/AnimatedNumbers';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useState, useEffect } from 'react';
import { getHeadersFromToken, hostUrl, navbarHeight } from '../Utils/Utils';
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import DataSkeleton from '../UtilComponent/DataSkeleton';
import moment from 'moment';

const ActivityPage = () => {

  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [activityState, setActivityState] = useState({
    data: [],
    filteredData: [],
  });

  const [minDate, setMinDate] = React.useState(moment());
  const [selectedFromDate, setSelectedFromDate] = React.useState(moment());
  const [selectedToDate, setSelectedToDate] = React.useState(moment());

  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    maxWidth: '200px',
  }));

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      const obj1 = arr1[i];
      const obj2 = arr2[i];

      // Compare properties of each object
      for (const key in obj1) {
        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }
    }

    return true;
  };

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

  // Second useEffect for fetching activity data
  useEffect(() => {
    const fetchData = async () => {
      const url = hostUrl + '/activities';
      try {
        const token = await getToken();
        const response = await fetch(url, {
          method: 'GET',
          headers: getHeadersFromToken(token),
        });

        if (response.status === 200) {
          const responseData = await response.json();
          const activityData = responseData.payload;

          const isEqual = arraysEqual(activityState.data, activityData);

          if (!isEqual) {
            const dates = activityData.map((item) => moment(item.startTime));
            const smallestDate = moment.min(dates);
            const sumOfDurations = activityData.reduce((acc, entry) => acc + entry.duration, 0);
            setMinDate(smallestDate);
            setSelectedFromDate(smallestDate);

            setActivityState((prevActivityState) => {
              return {
                ...prevActivityState,
                data: activityData,
                filteredData: activityData,
                filteredSumOfDurations: sumOfDurations,
              }
            });
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error making GET request:', error);
      }
    };

    fetchData();
  }, [activityState.data, getToken]);

  //3rd useEffect to handle date change
  useEffect(() => {
    // Callback function to execute after state is updated
    const filteredData = activityState.data.filter((item) => {
      const startTime = moment(item.startTime);
      const endTime = moment(item.endTime);

      return (startTime.isSameOrAfter(selectedFromDate, 'day') && endTime.isSameOrBefore(selectedToDate, 'day')) || (item.endTime===null);
    });
    const sumOfDurations = filteredData.reduce((acc, entry) => acc + entry.duration, 0);
    setActivityState((prevActivityState) => {
      return {
        ...prevActivityState,
        filteredData: filteredData, 
        filteredSumOfDurations: sumOfDurations
      }
    });
  }, [selectedFromDate, selectedToDate, activityState.data]);

  function ActivityPageSummary() {
    return (<React.Fragment>
      <Grid xs={6} md={8} display="flex" justifyContent="left" alignItems="left">
        <Card sx={{
          minWidth: { sm: 275, xs: '100%' },
          overflow: 'auto',
          textAlign: { xs: 'center', sm: 'left' },
          background: (t) => t.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(225,225,225,0.4)',
          boxShadow: (t) => t.palette.mode === 'dark' ? '0px 0px 16px -2px rgba(255,255,255,0.1)' : '',
        }}>
          <CardContent>
            <Typography sx={{ fontSize: 14, marginBottom: 2 }} color="text.secondary" gutterBottom>
              Filter Data
            </Typography>
            <DatePicker
              sx={{ margin: 1 }}
              label="From"
              disableFuture={true}
              minDate={minDate}
              defaultValue={selectedFromDate}
              views={['year', 'month', 'day']}
              onChange={(date) => handleDateChange(date, setSelectedFromDate)}
              slotProps={{
                textField: { size: 'small' }
              }} />
            <DatePicker
              sx={{ margin: 1 }}
              label="To"
              disableFuture={true}
              minDate={selectedFromDate}
              defaultValue={selectedToDate}
              onChange={(date) => handleDateChange(date, setSelectedToDate)}
              views={['year', 'month', 'day']}
              slotProps={{
                textField: { size: 'small' }
              }} />
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={6} md={4} display="flex" justifyContent="right" alignItems="right">
        <Card sx={{
          minWidth: { sm: 275, xs: '100%' },
          overflow: 'auto',
          textAlign: { xs: 'left' },
          display: 'flex',
          alignItems: 'center',
          background: (t) => t.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(225,225,225,0.4)',
          boxShadow: (t) => t.palette.mode === 'dark' ? '0px 0px 16px -2px rgba(255,255,255,0.1)' : '',
        }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
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
                <AnimatedNumbersCustom num={((activityState.filteredSumOfDurations / 3600) * 6)} />
              </Stack>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </React.Fragment>);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="false" sx={{
        margin: 0,
        backgroundImage: `url(${"/static/rose_bg.jpeg"})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '0px !important',
        overflow: 'auto',
        minHeight: `calc(100vh - ${navbarHeight}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{
          flexGrow: 1, background: (t) => t.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(225,225,225,0.4)',
          backdropFilter: "blur(10px) !important", paddingTop: '20px', overflow: 'auto'
        }}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ margin: '0 20px' }}>
            {
              loading ? <React.Fragment /> : <ActivityPageSummary />
            }
            <Grid xs={12}>
              {
                loading ? <DataSkeleton /> : <StickyHeadTable activityState={activityState} />
              }
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  )


}

export default ActivityPage
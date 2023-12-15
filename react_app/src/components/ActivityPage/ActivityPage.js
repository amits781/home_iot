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

import { useState, useEffect } from 'react';
import { getHeadersFromToken, hostUrl } from '../Utils/Utils';
import { useAuth } from "@clerk/clerk-react";

const ActivityPage = () => {

  const { getToken } = useAuth();
  const [activityState, setActivityState] = useState({
    data: [],
  });

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

  useEffect(() => {
    const url = hostUrl + '/activities';
    getToken().then(token => {
      fetch(url, {
        method: 'GET',
        headers: getHeadersFromToken(token),
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          if (responseData.status === 200) {
            const activityData = responseData.payload;
            const isEqual = arraysEqual(activityState.data, activityData);
            if (!isEqual) {
              const sumOfDurations = activityData.reduce((acc, entry) => acc + entry.duration, 0);
              setActivityState({ ...activityState, data: activityData, sumOfDurations: sumOfDurations });
            }
          }
        })
        .catch((error) => {
          console.error('Error making GET request:', error);
        });
    });
  }, [activityState, getToken]);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="false" sx={{
        height: "100vh",
        backgroundImage: `url(${"/static/rose_bg.jpeg"})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '0px !important',

      }}>
        <Box sx={{
          height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: (t) => t.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(225,225,225,0.4)',
          backdropFilter: "blur(10px) !important", paddingTop: '20px'
        }} >

          <Stack spacing={{ xs: 1, sm: 2 }}>
            <Card sx={{ minWidth: 275, maxWidth: 200 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Total consumption
                </Typography>
                <Typography variant="h3">
                  <Stack
                    direction="row"
                    spacing={1}
                  >
                    <span>&#8377;</span>
                    <AnimatedNumbersCustom num={((activityState.sumOfDurations / 3600) * 6)} />
                  </Stack>
                </Typography>
              </CardContent>
            </Card>
            <StickyHeadTable activityState={activityState} />
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  )
}

export default ActivityPage
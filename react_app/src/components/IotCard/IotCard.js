import * as React from 'react';
import './IotCard.css';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CycloneOutlinedIcon from '@mui/icons-material/CycloneOutlined';


import { Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { getHeadersFromToken, hostUrl } from '../Utils/Utils';
import LinearProgress from '@mui/material/LinearProgress';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import IconButton from '@mui/material/IconButton';
import { useAuth } from "@clerk/clerk-react";
import WifiSignal from '../WifiSignal/WifiSignal';

export default function IotCard() {

  const { getToken } = useAuth();

  const [iotState, setIotState] = useState({
    responseMessage: '',
    deviceStatus: false,
    motorStatus: false,
    buttonOnCondition: false,
    buttonOnDisable: true,
    buttonOffDisable: true,
    loadingDisplay: 'block',
    refreshButtonClass: '',
    wifiStrength: 0,
  });


  const [refreshButtonClass, setRefreshButtonClass] = useState('');

  const handleMotorOnButtonClick = async () => {
    // Disable the button while the API call is in progress
    setIotState({ ...iotState, buttonOnDisable: true, loadingDisplay: 'block' });

    const url = hostUrl + '/motorOn';
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
            setIotState({ ...iotState, buttonOffDisable: false, motorStatus: true, buttonOnCondition: true, loadingDisplay: 'hidden' });
          } else {
            console.log("Motor On Fail: " + responseData.payload);
            setIotState({ ...iotState, buttonOnDisable: false, motorStatus: false, buttonOnCondition: false, loadingDisplay: 'hidden' });
          }
        })
        .catch((error) => {
          setIotState({ ...iotState, buttonOnDisable: false, motorStatus: false, buttonOnCondition: false, loadingDisplay: 'hidden' });
          console.error('Error making GET request:', error);
        });
    });

  };

  const handleMotorOffButtonClick = async () => {
    // Disable the button while the API call is in progress
    setIotState({ ...iotState, buttonOffDisable: true, loadingDisplay: 'block' });

    const url = hostUrl + '/motorOff';
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
            setIotState({ ...iotState, buttonOnDisable: false, motorStatus: false, buttonOnCondition: false, loadingDisplay: 'hidden' });
          } else {
            console.log("Motor Off Fail: " + responseData.payload);
            setIotState({ ...iotState, buttonOffDisable: false, motorStatus: true, buttonOnCondition: true, loadingDisplay: 'hidden' });
          }
        })
        .catch((error) => {
          setIotState({ ...iotState, buttonOffDisable: false, motorStatus: true, buttonOnCondition: true, loadingDisplay: 'hidden' });
          console.error('Error making GET request:', error);
        });
    });

  };

  const getData = React.useCallback(async (refresh = '') => {
    const url = hostUrl + '/motorStatus';
    getToken().then(token => {
      fetch(url, {
        method: 'GET',
        headers: getHeadersFromToken(token),
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          const responseMessageValue = responseData.payload;
          const responseOk = responseData.status === 200 ? true : false;

          if (!(responseMessageValue === "") && responseOk) {
            const deviceStatusValue = responseData.payload.status === 2 ? false : true;
            const buttonOffDisableValue = !deviceStatusValue;
            const buttonOnDisableValue = !deviceStatusValue;
            const motorStatusValue = responseData.payload.status === 1 ? true : false;
            const buttonOnConditionValue = deviceStatusValue ? motorStatusValue : false;

            setIotState({
              responseMessage: responseMessageValue,
              deviceStatus: deviceStatusValue,
              motorStatus: motorStatusValue,
              buttonOnCondition: buttonOnConditionValue,
              buttonOnDisable: buttonOnDisableValue,
              buttonOffDisable: buttonOffDisableValue,
              loadingDisplay: 'hidden',
              wifiStrength: (responseData.payload.strength + 1),
            });

          }
        })
        .catch((error) => {
          setIotState({
            ...iotState, responseMessage: 'Server Error', loadingDisplay: 'hidden', buttonOnDisable: true, wifiStrength: null,
            buttonOffDisable: true, deviceStatus: false
          });
          console.error('Error making GET request:', error);
        });
    });
  }, [iotState, getToken]);

  useEffect(() => {

    // Call the function immediately when the component mounts
    if (iotState.responseMessage === '') {
      getData();
    }

    // Set up an interval to call getData every 5 seconds
    const intervalId = setInterval(() => {
      getData();
    }, 10000); // 5000 milliseconds = 5 seconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [getData, iotState.responseMessage]);

  const handleRefreshButtonClick = async () => {

    setRefreshButtonClass('start');
    getData('refresh');
    await sleep(2000);
    setRefreshButtonClass('');
  };

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  return (
    <>
      <Card raised={true} sx={{
        width: { xs: 275, md: 350 }, background: (t) =>
          t.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(225,225,225,0.4)',
        boxShadow: (t) => t.palette.mode === 'dark' ? '0px 0px 16px -2px rgba(255,255,255,0.1)' : '',
      }}>
        <Box sx={{ width: '100%', display: iotState.loadingDisplay }}>
          <LinearProgress color="inherit" />
        </Box>
        <CardContent sx={{ paddingTop: "0px" }}>
          <Stack
            direction={{ xs: 'row' }}
            alignItems={{ xs: 'center' }}
            justifyContent="space-between"
            spacing={{ xs: 1, sm: 2, md: 4, lg: 6 }}
          >

            <WifiSignal iconName={iotState.wifiStrength} />
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Device status: {iotState.deviceStatus ? 'On' : 'Device not Reachable'}
            </Typography>
            <IconButton aria-label="refresh" onClick={handleRefreshButtonClick} className={refreshButtonClass}>
              <CachedRoundedIcon />
            </IconButton>

          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 4, lg: 6 }}
            alignItems={{ xs: 'center' }}
          >
            <Box>
              <CycloneOutlinedIcon sx={{ fontSize: '80px', borderRadius: '50px' }} className={iotState.deviceStatus ? (iotState.buttonOnCondition || iotState.buttonOnDisable) ? "start-motor" : "stop-motor" : ""} />
            </Box>
            <Box>
              <Typography sx={{
                mb: 1.5, textAlign: {
                  xs: 'center',
                  sm: 'left',
                  md: 'left',
                  lg: 'left',
                }
              }} color="text.secondary">
                House Pump
              </Typography>
              <Typography sx={{
                textAlign: {
                  xs: 'center',
                  sm: 'left',
                  md: 'left',
                  lg: 'left',
                }
              }} variant="body2">
                Motor Status is: {iotState.deviceStatus ? iotState.motorStatus ? 'On' : 'Off' : 'N/A'}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
        <CardActions sx={{ paddingBottom: "0px" }}>
          <Stack
            width={'100%'}
            justifyContent="space-around"
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 4, lg: 6 }}
            alignItems={{ xs: 'center' }}
          >
            <Button
              variant="contained"
              onClick={handleMotorOnButtonClick}
              disabled={(iotState.buttonOnCondition || iotState.buttonOnDisable)}
              sx={{
                width: {
                  xs: 'inherit',
                  sm: 'inherit',
                  md: 'inherit',
                  lg: 'inherit',
                },
                margin: {
                  xs: '20px 5px',
                }
              }}
              // size={{xs : "large", lg: "small"}}
              // fullWidth={{xs : true, lg: false}}
              color="success">
              Turn On</Button>
            <Button
              variant="contained"
              onClick={handleMotorOffButtonClick}
              disabled={(!iotState.buttonOnCondition || iotState.buttonOffDisable)}
              sx={{
                width: {
                  xs: 'inherit',
                  sm: 'inherit',
                  md: 'inherit',
                  lg: 'inherit',
                },
                margin: {
                  xs: '20px 5px !important',
                  lg: '0px 5px'
                }
              }}
              // size="small"
              // fullWidth={true}
              color="error">
              Turn Off
            </Button>
          </Stack>
        </CardActions>
      </Card >
    </>

  );
}

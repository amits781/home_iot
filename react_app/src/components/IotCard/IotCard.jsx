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
import GlassPanel from '../LiquidGlass/GlassPanel';
import { transparentPaperSx } from '../../theme/glass';

// Tinted glass pill: sits on the GlassPanel's own blur/refraction, adding a
// translucent colour wash instead of MUI's opaque `contained` fill so the
// background still shows through. The glow lives here (not on GlassPanel's
// square outer wrapper) so its box-shadow follows the pill's own rounded
// corners instead of rendering as a square behind it.
const glassButtonSx = (tintColor, glow) => ({
  width: { xs: '100%', sm: 'auto' },
  px: 4,
  borderRadius: 999,
  color: '#fff',
  fontWeight: 600,
  backgroundColor: `${tintColor}40`,
  boxShadow: glow ? `0 0 28px 6px ${glow}` : 'none',
  transition: 'box-shadow 0.3s ease, background-color 0.2s ease',
  '&:hover': {
    backgroundColor: `${tintColor}5c`,
  },
  '&.Mui-disabled': {
    color: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    boxShadow: 'none',
  },
});

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

  const turnOnDisabled = iotState.buttonOnCondition || iotState.buttonOnDisable;
  const turnOffDisabled = !iotState.buttonOnCondition || iotState.buttonOffDisable;

  return (
    <GlassPanel borderRadius={28}>
      <Card
        raised={false}
        sx={{
          width: { xs: 340, sm: 420, md: 460 },
          ...transparentPaperSx,
        }}
      >
        <Box sx={{ width: '100%', display: iotState.loadingDisplay }}>
          <LinearProgress color="inherit" />
        </Box>
        <CardContent sx={{ paddingTop: '12px', px: { xs: 3, sm: 4 } }}>
          <Stack
            direction={{ xs: 'row' }}
            alignItems={{ xs: 'center' }}
            justifyContent="space-between"
            spacing={{ xs: 1, sm: 2, md: 4, lg: 6 }}
            sx={{ mb: 1 }}
          >

            <WifiSignal iconName={iotState.wifiStrength} />
            <Typography sx={{ fontSize: '0.8rem' }} color="text.secondary" gutterBottom>
              Device status: {iotState.deviceStatus ? 'On' : 'Device not Reachable'}
            </Typography>
            <IconButton
              aria-label="refresh"
              onClick={handleRefreshButtonClick}
              className={refreshButtonClass}
              size="large"
            >
              <CachedRoundedIcon fontSize="medium" />
            </IconButton>

          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }}
            alignItems={{ xs: 'center' }}
            sx={{ my: 2 }}
          >
            <Box>
              <CycloneOutlinedIcon sx={{ fontSize: '130px', borderRadius: '65px' }} className={iotState.deviceStatus ? (iotState.buttonOnCondition || iotState.buttonOnDisable) ? "start-motor" : "stop-motor" : ""} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{
                mb: 1, fontWeight: 600, textAlign: {
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
              }} variant="body1">
                Motor Status is: {iotState.deviceStatus ? iotState.motorStatus ? 'On' : 'Off' : 'N/A'}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
        <CardActions sx={{ paddingBottom: '28px', px: { xs: 3, sm: 4 } }}>
          <Stack
            width={'100%'}
            justifyContent="space-around"
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }}
            alignItems={{ xs: 'center' }}
          >
            <GlassPanel
              borderRadius={999}
              blur={10}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Button
                variant="text"
                size="large"
                onClick={handleMotorOnButtonClick}
                disabled={turnOnDisabled}
                sx={glassButtonSx('#38c156', turnOnDisabled ? null : 'rgba(56,193,86,0.55)')}
              >
                Turn On
              </Button>
            </GlassPanel>
            <GlassPanel
              borderRadius={999}
              blur={10}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Button
                variant="text"
                size="large"
                onClick={handleMotorOffButtonClick}
                disabled={turnOffDisabled}
                sx={glassButtonSx('#d82a3f', turnOffDisabled ? null : 'rgba(216,42,63,0.55)')}
              >
                Turn Off
              </Button>
            </GlassPanel>
          </Stack>
        </CardActions>
      </Card>
    </GlassPanel>
  );
}

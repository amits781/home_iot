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
import GlassSurface from '../LiquidGlass/GlassSurface';
import { transparentPaperSx } from '../../theme/glass';

// Tinted glass pill: sits on the GlassSurface's own blur/refraction, adding a
// translucent colour wash instead of MUI's opaque `contained` fill so the
// background still shows through. The glow lives here (not on GlassSurface's
// square outer wrapper) so its box-shadow follows the pill's own rounded
// corners instead of rendering as a square behind it.
const glassButtonSx = (tintColor, glow) => ({
  width: '100%',
  px: 4,
  minHeight: 52,
  borderRadius: 999,
  color: '#fff',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  background: `linear-gradient(180deg, ${tintColor}66 0%, ${tintColor}32 100%)`,
  border: `1px solid ${tintColor}88`,
  backdropFilter: 'blur(18px) saturate(160%)',
  WebkitBackdropFilter: 'blur(18px) saturate(160%)',
  boxShadow: glow ? `0 0 30px 4px ${glow}` : 'inset 0 1px 0 rgba(255,255,255,0.16)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: `linear-gradient(180deg, ${tintColor}7a 0%, ${tintColor}44 100%)`,
    boxShadow: glow ? `0 0 28px 6px ${glow}` : 'inset 0 1px 0 rgba(255,255,255,0.22)',
  },
  '&.Mui-disabled': {
    color: 'rgba(255,255,255,0.42)',
    background: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
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
    <GlassSurface
      borderRadius={28}
      sx={{
        width: { xs: 340, sm: 420, md: 460 },
        minHeight: 430,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ width: '100%', display: iotState.loadingDisplay }}>
          <LinearProgress color="inherit" />
        </Box>

        <Box sx={{ pt: 1.5, pb: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: { xs: 1, sm: 2 },
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.5,
            }}
          >
            <WifiSignal iconName={iotState.wifiStrength} />
            <Typography sx={{ fontSize: '0.8rem', flexGrow: 1, textAlign: 'center' }} color="text.secondary">
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
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 3 },
              alignItems: 'center',
              my: 2,
            }}
          >
            <Box>
              <CycloneOutlinedIcon
                sx={{ fontSize: '130px', borderRadius: '65px' }}
                className={iotState.deviceStatus ? (iotState.buttonOnCondition || iotState.buttonOnDisable) ? 'start-motor' : 'stop-motor' : ''}
              />
            </Box>
            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }} color="text.secondary">
                House Pump
              </Typography>
              <Typography variant="body1">
                Motor Status is: {iotState.deviceStatus ? iotState.motorStatus ? 'On' : 'Off' : 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ pb: 0.5, pt: 0.5 }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 2.5 },
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <GlassSurface
              borderRadius={999}
              padding="0px"
              displacementScale={80}
              sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 0, sm: 170 } }}
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
            </GlassSurface>
            <GlassSurface
              borderRadius={999}
              padding="0px"
              displacementScale={80}
              sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 0, sm: 170 } }}
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
            </GlassSurface>
          </Box>
        </Box>
      </Box>
    </GlassSurface>
  );
}

import React from 'react';
import SignalWifi4BarIcon from '@mui/icons-material/SignalWifi4Bar';
import NetworkWifi2BarIcon from '@mui/icons-material/NetworkWifi2Bar';
import NetworkWifi3BarIcon from '@mui/icons-material/NetworkWifi3Bar';
import NetworkWifi1BarIcon from '@mui/icons-material/NetworkWifi1Bar';
import SignalWifiConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiConnectedNoInternet4';
import './WifiSignal.css';

const WifiSignal = (props) => {
  let icon;
  let iconStyle = {padding: "8px", minWidth: "40px", minHeight: "40px"};

  if (props.iconName === 1) {
    icon = <NetworkWifi1BarIcon style={iconStyle}/>; 
  } else if (props.iconName === 2) {
    icon = <NetworkWifi2BarIcon style={iconStyle}/>;
  } else if (props.iconName === 3) {
    icon = <NetworkWifi3BarIcon style={iconStyle}/>;
  } else if (props.iconName > 3) {
    icon = <SignalWifi4BarIcon style={iconStyle}/>;
  } else {
    icon = <SignalWifiConnectedNoInternet4Icon style={iconStyle}/>;
  }

  return (
    <>
      {icon}
      </>
  );
};

WifiSignal.propTypes = {};

WifiSignal.defaultProps = {};

export default WifiSignal;

import React, { useEffect, useState } from 'react';
import './SiginPage.css';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { SignIn } from "@clerk/clerk-react";
import axios from 'axios';
import { pixbayKey } from '../Utils/Utils';

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

  const [videoSrc, setVideoSrc] = useState('');
  const [videoData, setVideoData] = useState([]);
  console.log(process.env.PIXBAY_KEY);
  // Function to set a random videpixbayKeyo source from the fetched data
  const setRandomVideoSrc = (videos) => {
    if (videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length);
      setVideoSrc(videos[randomIndex].videos.large.url);
    }
  };

  useEffect(() => {
    // Function to fetch video data from Pixabay API
    const fetchVideoData = async () => {
      try {
        const response = await axios.get('https://pixabay.com/api/videos/', {
          params: {
            key: pixbayKey,
            q: 'aerial',
            orientation: 'horizontal',
            category: 'backgrounds',
            safesearch: 'true',
          },
        });
        const { hits } = response.data;
        setVideoData(hits);
        // Set initial video source
        setRandomVideoSrc(hits);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    // Fetch video data on component mount
    fetchVideoData();
  }, []);

  useEffect(() => {
    // Update video source every 10 minutes (600000 ms) using the existing JSON data
    const intervalId = setInterval(() => {
      setRandomVideoSrc(videoData);
    }, 600000); // 10 minutes in milliseconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [videoData]);


  return (
    <Grid container component="main" sx={{
      height: "100vh",
      // backgroundImage: `url(${"/static/rainBg1.jpg"})`,
      // backgroundRepeat: 'no-repeat',
      backgroundColor: 'rgba(0,0,0,0.0)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <video id="background-video" autoPlay loop muted src={videoSrc} typeof="video/mp4">
      </video>
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
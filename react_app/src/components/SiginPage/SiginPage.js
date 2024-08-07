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
  const [searchHits, setSearchHits] = useState(0);


  // Function to set a random videpixbayKeyo source from the fetched data
  const setRandomVideoSrc = (videos) => {
    if (videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length);
      const selectedVideo = videos[randomIndex];
      setVideoSrc(selectedVideo.videos.large.url);
      return selectedVideo.duration;
    }
    return 600000; // Default interval time if no videos are available
  };

  useEffect(() => {
    // Function to fetch video data from Pixabay API
    const fetchVideoData = async () => {
      var curr_page = searchHits === 0 ? 1 : Math.floor(Math.random() * searchHits) + 1;
      try {
        const response = await axios.get('https://pixabay.com/api/videos/', {
          params: {
            key: process.env.REACT_APP_PIXBAY_KEY,
            q: 'nature,sky',
            orientation: 'horizontal',
            category: 'travel',
            safesearch: 'true',
            per_page: 20,
            page: curr_page,
          },
        });
        const { hits } = response.data;
        const total_page = Math.floor(response.data.totalHits/20);
        setSearchHits(total_page);
        setVideoData(hits);
        // Set initial video source
        setRandomVideoSrc(hits);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    // Fetch video data on component mount
    

    const intervalId = setInterval(() => {
      fetchVideoData();
    }, 600000); // 10 minutes in milliseconds
    fetchVideoData();
    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [searchHits]);

  useEffect(() => {
    let intervalId;
  
    const updateVideoSrc = () => {
      const duration = setRandomVideoSrc(videoData);
      clearInterval(intervalId);
      intervalId = setInterval(updateVideoSrc, duration * 1000 * 5); // assuming duration is in seconds
    };
  
    updateVideoSrc(); // Set initial video and interval
  
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
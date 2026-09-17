import React, { useEffect, useState } from 'react';
import './SiginPage.css';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { SignIn } from "@clerk/clerk-react";
import axios from 'axios';
import GlassPanel from '../LiquidGlass/GlassPanel';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      AIDYN{' '}
      {new Date().getFullYear()}
      {' Website.'}
    </Typography>
  );
}

export default function SignInSide() {

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
            key: import.meta.env.REACT_APP_PIXBAY_KEY,
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
    <Box component="main" sx={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: 'rgba(0,0,0,0.0)',
      px: 2,
      py: 4,
    }}>
      <video id="background-video" autoPlay loop muted src={videoSrc} typeof="video/mp4">
      </video>
      <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)' }} />
      <CssBaseline />
      <GlassPanel
        cornerRadius={36}
        blurAmount={0.4}
        saturation={140}
        displacementScale={100}
        aberrationIntensity={2}
        elasticity={0.0}
        padding="28px 32px"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          width: 'min(440px, calc(100vw - 32px))',
          minHeight: 420,
          maxWidth: '100%',
          display: 'block',
        }}
      >
        <Box
          sx={{
            width: '100%',
            px: { xs: 3, sm: 6 },
            py: { xs: 4, sm: 7 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            // background: 'transparent',
            borderRadius: 'inherit',
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: { xs: 40, sm: 66 }, mb: 1.5 }} />
          <Typography component="h1" variant="h4" sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: { xs: '.2rem', sm: '.35rem' },
            color: 'inherit',
            textDecoration: 'none',
            fontSize: { xs: '2.1rem', sm: '3.2rem' },
          }}>
            AIDYN
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, mb: 1.5, fontSize: { xs: '1rem', sm: '1.5rem' } }}>
            Sign in to continue
          </Typography>
          <Box sx={{ width: '100%' }}>
            <SignIn
              appearance={{
                elements: {
                  rootBox: { width: '100%' },
                  cardBox: { width: '100%' },
                  card: { width: '100%', boxSizing: 'border-box' },
                  header: { display: 'none', padding: 0, margin: 0 },
                  main: { width: '100%', boxSizing: 'border-box', paddingTop: 0, marginTop: 0 },
                  socialButtons: {
                    width: '100%',
                    boxSizing: 'border-box',
                    gridTemplateColumns: '1fr',
                    justifyItems: 'stretch',
                    marginTop: 0,
                  },
                  socialButtonsBlockButton: {
                    width: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    justifyContent: 'center',
                  },
                  socialButtonsBlockButtonText: {
                    fontSize: '0.95em',
                    overflow: 'visible',
                    whiteSpace: 'normal',
                  },
                  socialButtonsBlockButtonArrow: {
                    display: 'none',
                  },
                },
              }}
            />
            <Copyright sx={{ mt: 5, fontSize: { xs: '0.85rem', sm: '1.3rem' } }} />
          </Box>
        </Box>
      </GlassPanel>
    </Box>
  );
}
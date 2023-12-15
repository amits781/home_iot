import './HomePage.css';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { CssBaseline, Grid } from '@mui/material';
import IotCard from '../IotCard/IotCard';
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from 'react';
import { getHeadersFromToken, hostUrl, navbarHeight } from '../Utils/Utils';
import { useNavigate } from 'react-router-dom';
import CardSkeleton from '../UtilComponent/CardSkeleton';



export default function HomePage() {

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const url = hostUrl + '/checkAuth';
        const response = await fetch(url, {
          method: 'GET',
          headers: getHeadersFromToken(token),
        });

        if (response.status === 200) {
          setLoading(false);
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

    fetchData();
  }, [getToken, navigate]);

  return (
    <Grid container component="main" sx={{
      minHeight: `calc(100vh - ${navbarHeight}px)`,
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: `url(${"/static/rose_bg.jpeg"})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <CssBaseline />
      <Box
        sx={{
          width: "100%",
          background: (t) => t.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(225,225,225,0.4)',
          backdropFilter: "blur(10px) !important",
          padding: "60px 20px 0px 20px",
          flexGrow: 1,
          alignItems: 'center',
          overflow: 'auto'
        }}
      >

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4, lg: 6 }}
          justifyContent={'center'}
          alignItems={'center'}
        >
          {
            loading ? <CardSkeleton /> : <IotCard />
          }

        </Stack>
      </Box>
    </Grid>
  );
}

HomePage.propTypes = {};

HomePage.defaultProps = {};


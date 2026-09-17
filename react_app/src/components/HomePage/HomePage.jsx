import './HomePage.css';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { CssBaseline, Grid } from '@mui/material';
import IotCard from '../IotCard/IotCard';
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from 'react';
import { navbarHeight } from '../Utils/Utils';
import { useNavigate } from 'react-router-dom';
import CardSkeleton from '../UtilComponent/CardSkeleton';
import PageBackdrop from '../UtilComponent/PageBackdrop';
import usePixabayBackground from '../Utils/usePixabayBackground';
import { isAuthorized, UNAUTHORIZED_ROUTE } from '../Utils/checkAuth';



export default function HomePage() {

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const backgroundImageUrl = usePixabayBackground('abstract dark', 'computer');

  // Gate: the device card is only rendered once /checkAuth has actually
  // confirmed the caller. On any failure we leave `loading` set, so the
  // skeleton stays up and the card never mounts, and send the user to the
  // error page instead.
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const token = await getToken();
        const authorized = await isAuthorized(token);

        if (cancelled) {
          return;
        }
        if (!authorized) {
          navigate(UNAUTHORIZED_ROUTE, { replace: true });
          return;
        }

        setLoading(false);
      } catch (error) {
        console.log("Check Auth Fail: " + error.message);
        if (!cancelled) {
          navigate(UNAUTHORIZED_ROUTE, { replace: true });
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [getToken, navigate]);

  return (
    <Grid container component="main" sx={{
      position: 'relative',
      zIndex: 1,
      minHeight: `calc(100vh - ${navbarHeight}px)`,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <PageBackdrop imageUrl={backgroundImageUrl} />
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          padding: '32px 20px',
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1120,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 2, md: 4, lg: 6 },
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {
            loading ? <CardSkeleton /> : <IotCard />
          }
        </Box>
      </Box>
    </Grid>
  );
}

HomePage.propTypes = {};

HomePage.defaultProps = {};


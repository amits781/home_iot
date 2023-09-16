import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Button, CssBaseline, Grid } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import { useClerk } from "@clerk/clerk-react";
import './ErrorPage.css';
import Typography from '@mui/material/Typography';

function ErrorPage() {

    const { signOut } = useClerk();
    const [cause, setCause] = useState('');

    useEffect(() => {
        // Parse the current URL
        const url = new URL(window.location.href);

        // Get the 'cause' query parameter value
        const causeParam = url.searchParams.get('cause');

        if (causeParam) {
            // Set the 'cause' state with the extracted value
            if (causeParam === 'user_unauthorized') {
                setCause('Permission denied to access this site.');
            } else {
                setCause(causeParam);
            }
        }
    }, []);

    return (
        <Grid container component="main" sx={{
            height: "100vh",
            backgroundImage: `url(${"/static/errorbg.jpg"})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <CssBaseline />
            <Box
                sx={{
                    width: "100%",
                    height: "fill-content",
                    background: (t) => t.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(225,225,225,0.4)',
                    backdropFilter: "blur(10px) !important",
                    padding: "60px 20px 0px 20px",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'column' }}
                    spacing={{ xs: 1, sm: 2, md: 4, lg: 6 }}
                >
                    <Typography sx={{ fontSize: { xs: '15vw', lg: '10vw' } }} gutterBottom variant="h1" component="div">
                        Something
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '8vw', lg: '5vw' }, margin: '0px' }} variant="h2" component="div" color="text.secondary">
                        went <span className="hero glitch layers" data-text="wrong"><span>wrong</span></span>
                    </Typography>
                    {
                        cause ? (<Typography variant="subtitle2" gutterBottom>
                            {cause}
                        </Typography>) : (<></>)
                    }

                    <CardActions>
                        <Button onClick={() => signOut()} variant='contained' color="error">Try Again</Button>
                    </CardActions>
                </Stack>
            </Box>
        </Grid>
    );
}

export default ErrorPage
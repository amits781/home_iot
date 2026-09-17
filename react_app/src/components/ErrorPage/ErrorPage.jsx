import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Button, CssBaseline, Grid } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import { useClerk } from "@clerk/clerk-react";
import './ErrorPage.css';
import Typography from '@mui/material/Typography';
import {
    glassOverlayStyle,
    glassButtonSx,
    GLASS_TINT_DANGER,
    GLASS_GLOW_DANGER,
} from '../../theme/glass';
import GlassSurface from '../LiquidGlass/GlassSurface';
import { navbarHeight } from '../Utils/Utils';
import { publishAppBackground } from '../Utils/appBackground';

const ERROR_BACKGROUND = '/static/errorbg.jpg';

function ErrorPage() {

    const { signOut } = useClerk();
    const [cause, setCause] = useState('');

    // The navbar paints its own copy of the page wallpaper behind its glass
    // (see Utils/appBackground.js). Without this it would keep blurring
    // whichever photo the previous page happened to load.
    useEffect(() => {
        publishAppBackground(ERROR_BACKGROUND);
    }, []);

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
        <React.Fragment>
            <CssBaseline />
            {/* This used to be a `backgroundImage` on the Grid below. A
                background only paints behind its own element's box, and the
                Grid starts *below* the sticky navbar (which takes real layout
                space), so the wallpaper left an empty strip across the top of
                the page. `position: fixed; inset: 0` covers the whole viewport
                instead, including the area behind the navbar.
                
                This is PageBackdrop's job, but PageBackdrop also bakes in a
                50% black wash to keep photos readable under glass, and this
                page already darkens itself with glassOverlayStyle below.
                Stacking both washed the artwork out, so the layer is inlined
                here without one and the page keeps the tone it always had.
                
                It stays outside the Grid, and the Grid deliberately carries no
                z-index, so the Grid is not a stacking context and the glass
                inside it can still sample this backdrop. */}
            <Box
                aria-hidden
                sx={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                    backgroundImage: `url(${ERROR_BACKGROUND})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid container component="main" sx={{
                position: 'relative',
                minHeight: `calc(100vh - ${navbarHeight}px)`,
            }}>
            <Box
                sx={[
                    {
                        width: "100%",
                        height: "fill-content",
                        padding: "60px 20px 0px 20px",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                    },
                    (t) => glassOverlayStyle(t.palette.mode),
                ]}
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
                        {/* The padding the liquid-glass button config puts on
                            the glass itself lives on the Button instead, so
                            the whole pill is clickable rather than just the
                            text. GlassSurface is our in-flow wrapper around
                            the same liquid-glass-react dependency the cards
                            use; it pins elasticity at 0 because panels in
                            normal flow must not be translated, so the
                            elasticity from the snippet would be a no-op here. */}
                        <GlassSurface
                            borderRadius={100}
                            padding="0px"
                            displacementScale={64}
                            blurAmount={0.1}
                            saturation={130}
                            aberrationIntensity={2}
                        >
                            <Button
                                onClick={() => signOut()}
                                sx={{
                                    // Same red glass fill as the card's stop
                                    // button; sizing stays local so this reads
                                    // as a compact inline action rather than a
                                    // full-width card button.
                                    ...glassButtonSx(GLASS_TINT_DANGER, GLASS_GLOW_DANGER),
                                    padding: '8px 16px',
                                    minWidth: 0,
                                }}
                            >
                                Try Again
                            </Button>
                        </GlassSurface>
                    </CardActions>
                </Stack>
                </Box>
            </Grid>
        </React.Fragment>
    );
}

export default ErrorPage
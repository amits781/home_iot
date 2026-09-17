import * as React from 'react';
import Box from '@mui/material/Box';
import LiquidGlass from 'liquid-glass-react';
import './GlassSurface.css';

// Same glass material as the sign-in panel, but for surfaces that sit in
// normal document flow (cards, header, table) rather than floating centered
// over the page. See GlassSurface.css for what that takes.
export default function GlassSurface({
  children,
  className = '',
  sx,
  padding = '28px 32px',
  cornerRadius,
  borderRadius,
  displacementScale = 100,
  blurAmount = 0.4,
  saturation = 140,
  aberrationIntensity = 2,
  overLight = false,
  ...rest
}) {
  const resolvedCornerRadius = cornerRadius ?? borderRadius ?? 36;
  const rootRef = React.useRef(null);

  // liquid-glass-react measures itself on mount and then only on window
  // resize, so a panel that grows with its content (the activity table once
  // rows arrive) keeps refracting through a map built for its original size,
  // which reads as no glass at all. Nudge it to re-measure instead.
  React.useEffect(() => {
    const element = rootRef.current;
    let lastWidth = 0;
    let lastHeight = 0;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (Math.abs(width - lastWidth) < 1 && Math.abs(height - lastHeight) < 1) {
        return;
      }
      lastWidth = width;
      lastHeight = height;
      window.dispatchEvent(new Event('resize'));
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={rootRef}
      className="glass-surface-root"
      sx={{ borderRadius: `${resolvedCornerRadius}px`, ...sx }}
      {...rest}
    >
      <LiquidGlass
        className={`glass-surface ${className}`}
        cornerRadius={resolvedCornerRadius}
        blurAmount={blurAmount}
        saturation={saturation}
        displacementScale={displacementScale}
        aberrationIntensity={aberrationIntensity}
        elasticity={0}
        globalMousePos={{ x: 0.5, y: 0.5 }}
        padding={padding}
        overLight={overLight}
        mode="standard"
      >
        {children}
      </LiquidGlass>
    </Box>
  );
}

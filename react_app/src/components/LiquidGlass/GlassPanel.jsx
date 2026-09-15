import * as React from 'react';
import { LiquidGlass } from '@liquidglass/react';
import Box from '@mui/material/Box';
import './GlassPanel.css';

// Thin wrapper around @liquidglass/react.
//
// The library's own root element is `width: 100%; height: 100%` of its
// immediate parent (it fills whatever box you give it) and watches that box
// with a ResizeObserver, so it stays correct as content loads/changes async
// (e.g. Clerk's sign-in widget, live device state). All we need to supply is
// a parent sized to the content — `sx` lets callers control that; the flex
// contexts this app mounts it in already shrink-wrap to content by default.
//
// The library doesn't expose a border prop, so the hairline edge that makes
// the glass read as a distinct surface (rather than just a blur) comes from
// `glass-panel-shell` in GlassPanel.css, applied via `className`.
//
// `displacementScale` is 0, disabling the SVG refraction entirely. The
// library's shader intentionally displaces pixels *most* right at the
// edge (mimicking a lens); feDisplacementMap has no defined output for
// samples it pulls from outside the filter's own region, which near an
// edge is common, so it renders transparent there. blur() runs after the
// displacement in the filter chain, so it can't fix that — a partially
// transparent result just lets the sharp, unblurred page show through
// underneath, seen as a gap between the border and the frosted fill.
// Lowering the scale shrinks the gap but can't remove it; only 0 does,
// which still leaves genuine blur/contrast/saturation glass styling.
//
// IMPORTANT: @liquidglass/react defaults its own `zIndex` prop to 9999, and
// applies it with no stacking context of its own. Left at that default, an
// ordinary in-page card ends up painted above MUI's Drawer (z-index 1200)
// and Modal backdrop (1300), which breaks "click outside to close" and makes
// the drawer look like it renders underneath page content. Pin it low here;
// callers that manage their own stacking (Navbar's sticky header) already
// scope it via an ancestor z-index and can override if truly needed.
export default function GlassPanel({
  children,
  borderRadius = 20,
  blur = 14,
  contrast = 1.1,
  brightness = 1.05,
  saturation = 1.3,
  shadowIntensity = 0.45,
  displacementScale = 0,
  elasticity = 0.5,
  zIndex = 1,
  className,
  sx,
  ...rest
}) {
  return (
    <Box sx={sx}>
      <LiquidGlass
        borderRadius={borderRadius}
        blur={blur}
        contrast={contrast}
        brightness={brightness}
        saturation={saturation}
        shadowIntensity={shadowIntensity}
        displacementScale={displacementScale}
        elasticity={elasticity}
        zIndex={zIndex}
        className={['glass-panel-shell', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </LiquidGlass>
    </Box>
  );
}

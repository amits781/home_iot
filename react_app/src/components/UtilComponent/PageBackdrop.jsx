import Box from '@mui/material/Box';

// A true full-viewport wallpaper layer, independent of where the sticky
// header or page content sit in the layout. Setting `backgroundImage`
// directly on a page's own container only paints behind that container's
// own box, which starts below the header (since the header takes real
// space via `position: sticky`, it isn't an overlay) — leaving a gap above
// it. `position: fixed` + `inset: 0` covers the whole browser window
// regardless of DOM nesting, with `zIndex: -1` keeping it behind everything
// so the glass header can blur it like any other page content.
export default function PageBackdrop({ imageUrl }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        // Darkened with a gradient wash rather than `filter: brightness()`:
        // a filter would make this element a backdrop root, and the glass
        // panels above it would then have nothing to blur.
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imageUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}

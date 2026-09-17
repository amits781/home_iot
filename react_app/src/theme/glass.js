// Shared "Liquid Glass" design tokens, derived from Apple iOS 26's Liquid
// Glass material: a blurred translucent fill, a hairline border, a soft
// ambient drop shadow, and a top/bottom inset highlight that reads as a
// specular edge on the glass.

export const GLASS_RADIUS = 20;
export const GLASS_RADIUS_LG = 24;

const AMBIENT_SHADOW =
  '0 20px 40px -12px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.12)';

const INNER_HIGHLIGHT =
  'inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 1px rgba(255,255,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.05)';

// For discrete surfaces: cards, app bars, menus, dialogs, table containers.
export function glassSurfaceStyle(mode) {
  const dark = mode === 'dark';
  return {
    backgroundColor: dark ? 'rgba(20,22,28,0.55)' : 'rgba(255,255,255,0.45)',
    backgroundImage: dark
      ? 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 100%)'
      : 'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(217,217,217,0.35) 100%)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: dark
      ? '1px solid rgba(255,255,255,0.14)'
      : '1px solid rgba(156,156,156,0.35)',
    boxShadow: `${AMBIENT_SHADOW}, ${INNER_HIGHLIGHT}`,
  };
}

// For large page-level scrims sitting over a photo/video backdrop.
export function glassOverlayStyle(mode) {
  const dark = mode === 'dark';
  return {
    backgroundImage: dark
      ? 'linear-gradient(180deg, rgba(10,12,16,0.55) 0%, rgba(10,12,16,0.78) 100%)'
      : 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.4) 100%)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  };
}

// Tint used for destructive / alert actions (the motor's stop button, the
// error page's retry button).
export const GLASS_TINT_DANGER = '#d82a3f';
export const GLASS_GLOW_DANGER = 'rgba(216, 42, 63, 0.55)';

// Tinted glass pill for an action sitting on a GlassSurface: a translucent
// colour wash instead of MUI's opaque `contained` fill, so the surface behind
// still shows through. The glow belongs on the pill rather than on
// GlassSurface's square outer wrapper, so the box-shadow follows the pill's
// rounded corners instead of rendering as a square behind it.
//
// Appearance only - callers set their own size, since a full-width card
// button and a compact inline one want very different metrics. IotCard keeps
// its own identical private copy for the motor buttons.
export function glassButtonSx(tintColor, glow) {
  return {
    borderRadius: 999,
    color: '#fff',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: `linear-gradient(180deg, ${tintColor}66 0%, ${tintColor}32 100%)`,
    border: `1px solid ${tintColor}88`,
    backdropFilter: 'blur(18px) saturate(160%)',
    WebkitBackdropFilter: 'blur(18px) saturate(160%)',
    boxShadow: glow ? `0 0 30px 4px ${glow}` : 'inset 0 1px 0 rgba(255,255,255,0.16)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: `linear-gradient(180deg, ${tintColor}7a 0%, ${tintColor}44 100%)`,
      boxShadow: glow ? `0 0 28px 6px ${glow}` : 'inset 0 1px 0 rgba(255,255,255,0.22)',
    },
  };
}

// Neutralizes MUI Paper's own themed background/border/shadow so a real
// GlassPanel wrapped around it is the only visible glass surface.
export const transparentPaperSx = {
  backgroundColor: 'transparent',
  backgroundImage: 'none',
  backdropFilter: 'none',
  WebkitBackdropFilter: 'none',
  border: 'none',
  boxShadow: 'none',
};

// Vivid blurred-light wallpaper used as the app's base canvas.
export function appBackgroundStyle(mode) {
  const dark = mode === 'dark';
  return {
    backgroundColor: dark ? '#0b0d12' : '#eef1f6',
    backgroundImage: [
      `radial-gradient(1200px circle at 12% -10%, rgba(227,64,64,${dark ? 0.35 : 0.18}), transparent 55%)`,
      `radial-gradient(1000px circle at 90% 5%, rgba(0,180,255,${dark ? 0.28 : 0.16}), transparent 55%)`,
      `radial-gradient(900px circle at 50% 105%, rgba(130,80,255,${dark ? 0.28 : 0.14}), transparent 55%)`,
    ].join(', '),
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
  };
}

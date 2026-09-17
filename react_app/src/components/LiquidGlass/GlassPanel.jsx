import * as React from 'react';
import LiquidGlass from 'liquid-glass-react';

export default function GlassPanel({
  children,
  className,
  style,
  sx,
  padding = '28px 32px',
  cornerRadius,
  borderRadius,
  displacementScale = 52,
  blurAmount,
  blur = 0.14,
  saturation = 140,
  aberrationIntensity = 2,
  elasticity = 0.2,
  overLight = false,
  shadowIntensity,
  brightness,
  contrast,
  zIndex,
  display,
  position,
  left,
  top,
  right,
  bottom,
  transform,
  justifyContent,
  alignItems,
  ...rest
}) {
  const resolvedCornerRadius = cornerRadius ?? borderRadius ?? 32;
  const resolvedBlurAmount = blurAmount ?? blur ?? 0.14;

  const mergedStyle = {
    ...(typeof sx === 'function' ? sx({}) : sx || {}),
    ...(style || {}),
    ...(typeof display !== 'undefined' ? { display } : {}),
    ...(typeof position !== 'undefined' ? { position } : {}),
    ...(typeof left !== 'undefined' ? { left } : {}),
    ...(typeof top !== 'undefined' ? { top } : {}),
    ...(typeof right !== 'undefined' ? { right } : {}),
    ...(typeof bottom !== 'undefined' ? { bottom } : {}),
    ...(typeof transform !== 'undefined' ? { transform } : {}),
    ...(typeof zIndex !== 'undefined' ? { zIndex } : {}),
    ...(typeof justifyContent !== 'undefined' ? { justifyContent } : {}),
    ...(typeof alignItems !== 'undefined' ? { alignItems } : {}),
  };

  return (
    <LiquidGlass
      cornerRadius={resolvedCornerRadius}
      blurAmount={resolvedBlurAmount}
      saturation={saturation}
      displacementScale={displacementScale}
      aberrationIntensity={aberrationIntensity}
      elasticity={elasticity}
      globalMousePos={{ x: 0.5, y: 0.5 }}
      padding={padding}
      overLight={overLight}
      className={className}
      style={mergedStyle}
      mode="standard"
      {...rest}
    >
      {children}
    </LiquidGlass>
  );
}

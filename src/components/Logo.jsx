import React from 'react';
import { LOGO_VIEWBOX, LOGO_RATIO, LOGO_MARKUP } from './logo-mark';

// Exact mark + wordmark geometry recovered from the retired design-system bundle
// (components/brand/Logo.jsx) — see logo-mark.js.
function Logo({ theme = 'light', width = 160 }) {
  const height = width / LOGO_RATIO;
  return (
    <svg
      className={'logo' + (theme === 'dark' ? ' logo-dark' : '')}
      viewBox={LOGO_VIEWBOX}
      width={width}
      height={height}
      role="img"
      aria-label="CodeBoxx"
      dangerouslySetInnerHTML={{ __html: LOGO_MARKUP }}
    />
  );
}

export default Logo;

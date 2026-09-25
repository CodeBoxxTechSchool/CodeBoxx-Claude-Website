import React from 'react';
import { LOGO_VIEWBOX, LOGO_RATIO, LOGO_MARKUP } from './logo-mark';

// Exact mark + wordmark geometry recovered from the retired design-system bundle
// (components/brand/Logo.jsx) — see logo-mark.js.
function Logo({ theme = 'light', width = 160, label = 'CodeBoxx' }) {
  const height = width / LOGO_RATIO;
  return (
    <svg
      className={'logo' + (theme === 'dark' ? ' logo-dark' : '')}
      viewBox={LOGO_VIEWBOX}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      // <title> (not just aria-label) so a link wrapping only this logo gets an
      // accessible name — Astro's a11y audit only reads an svg's name from it.
      dangerouslySetInnerHTML={{ __html: '<title>' + label + '</title>' + LOGO_MARKUP }}
    />
  );
}

export default Logo;

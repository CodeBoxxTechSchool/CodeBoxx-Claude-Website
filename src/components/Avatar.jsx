import React from 'react';

// Ground truth from the retired Avatar.jsx: navy-500 circle, blue-500 user-circle
// glyph.
function Avatar({ size = 'md' }) {
  return (
    <span className={'avatar avatar-' + size}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="10" r="3.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5.5 19c1.2-2.8 3.6-4.5 6.5-4.5s5.3 1.7 6.5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export default Avatar;

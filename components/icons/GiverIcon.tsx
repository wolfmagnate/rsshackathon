import React from 'react';

const GiverIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    <circle cx="12" cy="12" r="12" fill="#ef4444" />
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dy=".3em"
      fill="white"
      fontSize="14"
      fontWeight="bold"
      fontFamily="sans-serif"
    >
      A
    </text>
  </svg>
);

export default GiverIcon;

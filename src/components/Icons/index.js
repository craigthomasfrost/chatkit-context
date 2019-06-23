import React from 'react';

const AttachmentIcon = () => (
  <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"
      fill="#4E42FF"
    />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#4E42FF" />
  </svg>
);

export { AttachmentIcon, SendIcon };

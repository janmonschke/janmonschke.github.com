import React from 'react';

export default function({ href, children, ...props }) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
      {children}
    </a>
  );
}

import React from 'react';

export function Keywords({ keywords }) {
  return (
    <small
      style={{
        color: '#666'
      }}
    >
      {keywords.map((keyword) => `#${keyword}`).join(' · ')}
    </small>
  );
}

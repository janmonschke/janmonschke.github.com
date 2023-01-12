import React from 'react';
import ExternalLink from './ExternalLink';

import './Likes.css';

export function Likes({ likes }) {
  return (
    <ul className="Likes">
      {likes.map((like) => (
        <Like like={like.node} key={like.id} />
      ))}
    </ul>
  );
}

function Like({ like: { author } }) {
  return (
    <ExternalLink href={author.url} className="Like">
      <img
        src={author.photo}
        alt={author.name}
        title={author.name}
        className="Like__image no-underline"
        loading="lazy"
      />
    </ExternalLink>
  );
}

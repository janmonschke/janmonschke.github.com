import React from 'react';
import ExternalLink from './ExternalLink';

import './Mentions.css';

export function Mentions({ mentions }) {
  return (
    <ul className="Mentions">
      {mentions.map((mention) => (
        <Mention mention={mention.node} key={mention.id} />
      ))}
    </ul>
  );
}

function Mention({ mention: { author, content, url, published } }) {
  return (
    <div className="Mention">
      <ExternalLink href={author.url} className="Mention__authorImageLink">
        <img
          src={author.photo}
          alt={author.name}
          title={author.name}
          className="Mention__image"
          loading="lazy"
        />
      </ExternalLink>
      <div>
        <strong className="Mention__authorLink">
          <ExternalLink href={author.url}>{author.name}</ExternalLink>
        </strong>
        <div
          className="Mention__content"
          dangerouslySetInnerHTML={{
            __html: replaceUrlsAndAtMentions(content)
          }}
        />
        <small>
          <ExternalLink href={url}>{published}</ExternalLink>
        </small>
      </div>
    </div>
  );
}

const atMentionUrlRegex = /<a href="([http].+)".+class=\"u-url\">(.*?)<\/a>/g;
const urlRegex = /[a-z]+:\/\/\S+/g;
const atMentionRegex = /^@\w+/g;

/**
 * While webmentions.io comes with a HTML version of the mention, it does not
 * feel secure to embed HTML from a 3rd party directly.
 * Therefore we are parsing the text content and the HTML content for the bits
 * and pieces that we do want to create custom HTML for: @mentions and links.
 * We also want to make sure, since these links are all user-generated, that
 * crawlers don't follow (rel=nofollow) these and don't associate them with
 * this site (rel=ugc).
 *
 * Example for content:
 * "@janmon That would be great 🎉🎊
 * Check out this link as well: https://social.lol/tags/bcruhr2"
 *
 * Example for HTML:
 * <p>
 *  <span class=\"h-card\">
 *    <a href=\"https://social.lol/@janmon\" class=\"u-url\">
 *      @<span>janmon</span></a>
 *  </span>
 *  That would be great 🎉🎊
 *  Check out this link as well:
 *  <a href=\"https://social.lol/tags/bcruhr2\">
 *    #<span>bcruhr2</span>
 *  </a>
 * </p>
 *
 * @param {{text: string, html: string}} content
 * @returns A "safe" rich text version of the webmention's content
 */
function replaceUrlsAndAtMentions({ text, html }) {
  // Create a lookup for @mention links e.g.:
  // { "@janmon": "https://social.lol/janmon" }
  const atMentionsUrls = [...html.matchAll(atMentionUrlRegex)].reduce(
    (_atMentions, [_, userUrl, userAtMention]) => {
      _atMentions[userAtMention.replace('<span>', '').replace('</span>', '')] =
        userUrl;
      return _atMentions;
    },
    {}
  );

  return (
    text
      // Replace all urls in the text with nofollow + ugc links
      .replace(urlRegex, (url) => {
        return `<a href="${url}" rel="nofollow ugc" target="_blank">${url}</a>`;
      })
      // Replace all @mentions with links nofollow + ugc links that were parsed before
      .replace(atMentionRegex, (atMention) => {
        return `<a href="${atMentionsUrls[atMention]}" rel="nofollow ugc" target="_blank">${atMention}</a>`;
      })
  );
}

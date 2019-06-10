import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import { rhythm } from '../utils/typography';

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { twitter, github } = data.site.siteMetadata;
        return (
          <aside>
            Hi, I'm Jan 👋 I am a frontend engineer working for{' '}
            <ExternalLink href="https://soundcloud.com">
              SoundCloud
            </ExternalLink>{' '}
            in Berlin.
            <br />
            You can find me on{' '}
            <ExternalLink href={`https://twitter.com/${twitter}`}>
              🐦 Twitter
            </ExternalLink>
            {', '}
            <ExternalLink href={`https://github.com/${github}`}>
              💻 GitHub
            </ExternalLink>{' '}
            and{' '}
            <ExternalLink
              href={`https://www.linkedin.com/in/jan-monschke-aa6a249a/`}
            >
              💼 LinkedIn
            </ExternalLink>
            .
          </aside>
        );
      }}
    />
  );
}
import ExternalLink from './ExternalLink';

export default Bio;

const bioQuery = graphql`
  query BioQuery {
    site {
      siteMetadata {
        author
        twitter
        github
      }
    }
  }
`;

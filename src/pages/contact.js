import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { TiSocialTwitter } from 'react-icons/ti';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { rhythm } from '../utils/typography';
import ExternalLink from '../components/ExternalLink';

export default function Contact({ location }) {
  return (
    <StaticQuery
      query={contactQuery}
      render={data => {
        const { twitter } = data.site.siteMetadata;
        const twitterLink = `https://twitter.com/${twitter}`;
        const email =
          '&#106;&#097;&#110;&#064;&#106;&#097;&#110;&#109;&#111;&#110;&#115;&#099;&#104;&#107;&#101;&#046;&#099;&#111;&#109;';
        const emailLink = `mailto:${email}`;
        return (
          <Layout location={location} title="Jan Monschke">
            <SEO title="Contact" />
            <p>
              If you have any questions, you can contact me via Twitter or via
              email.
              <br />
              Looking forward to hearing from you 😊
            </p>
            <ExternalLink
              style={{ display: 'flex', alignItems: 'center' }}
              href={twitterLink}
            >
              <TiSocialTwitter size="24" style={{ marginRight: rhythm(0.2) }} />{' '}
              {twitter}
            </ExternalLink>
            <div
              dangerouslySetInnerHTML={{
                __html: `
              <a href="${emailLink}">${email}</a>
            `
              }}
            />
          </Layout>
        );
      }}
    />
  );
}

const contactQuery = graphql`
  query ContactQuery {
    site {
      siteMetadata {
        twitter
      }
    }
  }
`;

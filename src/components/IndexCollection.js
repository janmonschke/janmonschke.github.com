import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import Layout from './Layout';

export default function IndexCollection({ location, children }) {
  return (
    <StaticQuery
      query={graphql`
        query {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={(data) => (
        <Layout location={location} title={data.site.siteMetadata.title}>
          {children}
        </Layout>
      )}
    />
  );
}

import React from 'react';
import { Link, graphql } from 'gatsby';
import { MdRssFeed } from 'react-icons/md';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { rhythm } from '../utils/typography';
import Talks from '../components/Talks';

export default function BlogIndex({ data, location }) {
  const { title, keywords } = data.site.siteMetadata;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} title={title}>
      <SEO title="Blog" keywords={keywords} />
      <div
        style={{
          marginBottom: rhythm(1.5)
        }}
      >
        <Bio />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          marginBottom: rhythm(1)
        }}
      >
        <h2 style={{ margin: 0 }}>Posts</h2>
        <a href="/rss.xml" aria-label="RSS feed">
          <MdRssFeed
            size="24"
            style={{ marginLeft: rhythm(0.2), color: '#f26522' }}
          />
        </a>
      </div>
      {posts.map(IndexPost)}
      <h2 style={{ margin: 0, marginBottom: rhythm(1) }}>Talks</h2>
      <Talks />
    </Layout>
  );
}

function IndexPost({ node }) {
  const title = node.frontmatter.title || node.fields.slug;
  return (
    <div key={node.fields.slug}>
      <h3
        style={{
          marginTop: rhythm(1.5),
          marginBottom: rhythm(1 / 4)
        }}
      >
        <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
          {title}
        </Link>
      </h3>
      <small>{node.frontmatter.date}</small>
      <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
    </div>
  );
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        keywords
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { type: { eq: "blog" } } }
      limit: 5
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`;

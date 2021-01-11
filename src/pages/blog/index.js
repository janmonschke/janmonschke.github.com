import React from 'react';
import { Link, graphql, StaticQuery } from 'gatsby';
import { rhythm } from '../../utils/typography';
import { MdRssFeed } from 'react-icons/md';
import IndexCollection from '../../components/IndexCollection';
import SEO from '../../components/SEO';

export default function BlogPostsIndex({ location }) {
  return (
    <IndexCollection location={location}>
      <SEO title="All blog posts" />
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          marginBottom: rhythm(0.5)
        }}
      >
        <h2 style={{ margin: 0 }} id="blog-posts">
          All blog posts
        </h2>
        <a href="/rss.xml" aria-label="Blog post RSS feed">
          <MdRssFeed
            size="24"
            style={{ marginLeft: rhythm(0.2), color: '#f26522' }}
          />
        </a>
      </div>
      <StaticQuery
        query={graphql`
          query BlogPostsIndex {
            site {
              siteMetadata {
                title
                keywords
              }
            }
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              filter: { frontmatter: { type: { eq: "blog" } } }
            ) {
              edges {
                node {
                  id
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
        `}
        render={(data) =>
          data.allMarkdownRemark.edges.map(({ node }) => (
            <IndexPost key={node.id} node={node} />
          ))
        }
      />
    </IndexCollection>
  );
}

function IndexPost({ node }) {
  const title = node.frontmatter.title || node.fields.slug;
  return (
    <div key={node.fields.slug}>
      <h3
        style={{
          marginTop: rhythm(1),
          marginBottom: 0,
          fontSize: rhythm(0.7)
        }}
      >
        <Link to={node.fields.slug}>{title}</Link>
      </h3>
      <small>{node.frontmatter.date}</small>
    </div>
  );
}

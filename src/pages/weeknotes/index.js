import React from 'react';
import { Link, graphql, StaticQuery } from 'gatsby';
import { rhythm } from '../../utils/typography';
import { MdRssFeed } from 'react-icons/md';
import IndexCollection from '../../components/IndexCollection';
import SEO from '../../components/SEO';
import { Keywords } from '../../components/Keywords';

export default function WeeknotesIndex({ location }) {
  return (
    <IndexCollection location={location}>
      <SEO title="All weeknotes" />
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          marginBottom: rhythm(0.5)
        }}
      >
        <h2 style={{ margin: 0 }} id="blog-posts">
          All weeknotes
        </h2>
        <a href="/weeknotes.xml" aria-label="Weeknotes RSS feed">
          <MdRssFeed
            size="24"
            style={{ marginLeft: rhythm(0.2), color: '#f26522' }}
          />
        </a>
      </div>
      <StaticQuery
        query={graphql`
          query WeeknotesIndex {
            site {
              siteMetadata {
                title
                keywords
              }
            }
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              filter: { frontmatter: { type: { eq: "weeknote" } } }
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
                    keywords
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
          marginTop: rhythm(0.6),
          marginBottom: 0,
          fontSize: rhythm(0.7)
        }}
      >
        <Link to={node.fields.slug}>{title}</Link>
      </h3>
      <Keywords keywords={node.frontmatter.keywords} />
    </div>
  );
}

import React from 'react';
import { Link, graphql, StaticQuery } from 'gatsby';
import { rhythm } from '../../utils/typography';

export function WeeknotesOnIndex() {
  return (
    <StaticQuery
      query={graphql`
        query WeeknotesOnIndex {
          allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { type: { eq: "weeknote" } } }
            limit: 5
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
          <WeeknotePreview key={node.id} node={node} />
        ))
      }
    />
  );
}

function WeeknotePreview({ node }) {
  const title = node.frontmatter.title || node.fields.slug;
  console.log(node);
  return (
    <div style={{ marginBottom: rhythm(0.2) }}>
      <h3
        style={{
          marginTop: rhythm(0.2),
          marginBottom: 0,
          fontSize: rhythm(0.8)
        }}
      >
        <Link to={node.fields.slug}>{title}</Link>
      </h3>
      <small
        style={{
          color: '#666'
        }}
      >
        {node.frontmatter.keywords.map((keyword) => `#${keyword}`).join(' · ')}
      </small>
    </div>
  );
}

import React from 'react';
import { Link, graphql, StaticQuery } from 'gatsby';
import { rhythm, scale } from '../../utils/typography';
import { Keywords } from '../Keywords';

export function BlogPostsOnIndex() {
  return (
    <StaticQuery
      query={graphql`
        query BlogPostsOnIndex {
          allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { type: { eq: "blog" } } }
            limit: 5
          ) {
            edges {
              node {
                id
                excerpt
                fields {
                  slug
                }
                frontmatter {
                  date(formatString: "MMM DD, YYYY")
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
  );
}

function IndexPost({ node }) {
  const title = node.frontmatter.title || node.fields.slug;
  return (
    <div key={node.fields.slug}>
      <h3
        style={{
          marginTop: rhythm(0.2),
          marginBottom: 0,
          fontWeight: 'normal',
          ...scale(0.1)
        }}
      >
        <Link to={node.fields.slug}>
          <span style={{ color: 'initial' }}>{node.frontmatter.date}:</span>{' '}
          {title}
        </Link>
      </h3>
    </div>
  );
}

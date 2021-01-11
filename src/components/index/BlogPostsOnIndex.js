import React from 'react';
import { Link, graphql, StaticQuery } from 'gatsby';
import { rhythm } from '../../utils/typography';

export function BlogPostsOnIndex() {
  return (
    <StaticQuery
      query={graphql`
        query BlogPostsOnIndex {
          allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { type: { eq: "blog" } } }
            limit: 10
          ) {
            edges {
              node {
                id
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
          marginTop: rhythm(1),
          marginBottom: 0
        }}
      >
        <Link to={node.fields.slug}>{title}</Link>
      </h3>
      <small>{node.frontmatter.date}</small>
      <p
        style={{ margin: 0 }}
        dangerouslySetInnerHTML={{ __html: node.excerpt }}
      />
    </div>
  );
}

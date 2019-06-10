import React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { rhythm, scale } from '../utils/typography';

import './blog-post.css';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = this.props.data.site.siteMetadata.title;
    const { previous, next } = this.props.pageContext;
    const { title, date, keywords, pomodoros } = post.frontmatter;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={title}
          description={post.excerpt}
          keywords={keywords || []}
        />
        <h1
          style={{
            marginBottom: rhythm(1)
          }}
        >
          {title}
        </h1>
        <p
          style={{
            ...scale(-1 / 8),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1)
          }}
        >
          {date}
        </p>
        <div
          className="blogPost"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        {pomodoros && (
          <p
            style={{
              marginBottom: rhythm(1 / 2)
            }}
          >
            🍅 It took {pomodoros} pomodoros to write this post 🍅
          </p>
        )}
        <hr
          style={{
            marginBottom: rhythm(1)
          }}
        />
        <div
          style={{
            marginBottom: rhythm(1)
          }}
        >
          <Bio />
        </div>
        <hr
          style={{
            marginBottom: rhythm(1)
          }}
        />

        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
            margin: 0
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        pomodoros
        keywords
      }
    }
  }
`;

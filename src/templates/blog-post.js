import React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { rhythm, scale } from '../utils/typography';

import './blog-post.css';
import { Keywords } from '../components/Keywords';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const { previous, next } = this.props.pageContext;
    const { title, date, keywords, pomodoros, type, image } = post.frontmatter;
    const isWeeknote = type === 'weeknote';
    const siteTitle = this.props.data.site.siteMetadata.title;
    const imageSrc = image && image.childImageSharp.fluid.src;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={title}
          description={post.excerpt}
          keywords={keywords || []}
          image={imageSrc}
        />
        <h1
          style={{
            marginBottom: rhythm(1)
          }}
        >
          {title}
        </h1>
        <div
          style={{
            ...scale(-1 / 8),
            display: 'block',
            marginBottom: rhythm(1),
            marginTop: rhythm(-1)
          }}
        >
          {isWeeknote ? (
            <div>
              <Keywords keywords={keywords} />
            </div>
          ) : null}
          {date}
        </div>
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
            🍅 It took {pomodoros} {pomodoros === 1 ? 'pomodoro' : 'pomodoros'}{' '}
            to write this post 🍅
          </p>
        )}
        <Separator />
        <div
          style={{
            marginBottom: rhythm(0.6)
          }}
        >
          <Bio />
        </div>
        <Separator />

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
            {next && (
              <Link to={next.fields.slug} rel="next">
                ← {next.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                {previous.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    );
  }
}

function Separator() {
  return (
    <hr
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: rhythm(0.6),
        width: '75%',
        backgroundColor: '#eee'
      }}
    />
  );
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
        type
        date(formatString: "MMMM DD, YYYY")
        pomodoros
        keywords
        image {
          childImageSharp {
            fluid {
              src
            }
          }
        }
      }
    }
  }
`;

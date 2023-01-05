import React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { rhythm, scale } from '../utils/typography';
import { Keywords } from '../components/Keywords';
import { Mentions } from '../components/Mentions';
import { Likes } from '../components/Likes';

import './blog-post.css';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const {
      webmentions: { edges: webmentions },
      likes: { edges: likes }
    } = this.props.data;
    const { previous, next } = this.props.pageContext;
    const { title, date, keywords, pomodoros, type, image } = post.frontmatter;
    const isWeeknote = type === 'weeknote';
    const siteTitle = this.props.data.site.siteMetadata.title;
    const imageSrc =
      image && image.childImageSharp.gatsbyImageData.images.fallback.src;
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
            marginTop: rhythm(0.6),
            marginBottom: rhythm(1)
          }}
        >
          {title}
        </h1>
        <section
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
        </section>
        <div
          className="blogPost"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        {likes.length > 0 && (
          <section
            style={{
              marginBottom: rhythm(1 / 1.5)
            }}
          >
            <h3>Likes</h3>
            <Likes likes={likes} />
          </section>
        )}

        {webmentions.length > 0 && (
          <section
            style={{
              marginBottom: rhythm(1 / 1.5)
            }}
          >
            <h3>Mentions</h3>
            <Mentions mentions={webmentions} />
          </section>
        )}

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
  query BlogPostBySlug($slug: String!, $publicUrl: String!) {
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
            gatsbyImageData(width: 800, layout: FIXED)
          }
        }
      }
    }
    webmentions: allWebmentions(
      filter: {
        wm_property: { eq: "in-reply-to" }
        wm_target: { eq: $publicUrl }
      }
      sort: { fields: published, order: ASC }
    ) {
      edges {
        node {
          id
          author {
            name
            photo
            url
          }
          content {
            text
            html
          }
          url
          published(formatString: "YYYY/MM/DD hh:mm")
        }
      }
    }
    likes: allWebmentions(
      filter: { wm_property: { eq: "like-of" }, wm_target: { eq: $publicUrl } }
    ) {
      edges {
        node {
          author {
            name
            photo
            url
          }
          id
        }
      }
    }
  }
`;

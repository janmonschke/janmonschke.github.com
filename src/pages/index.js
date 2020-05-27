import React, { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { Link, graphql } from 'gatsby';
import { MdRssFeed } from 'react-icons/md';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { rhythm } from '../utils/typography';
import Talks from '../components/Talks';

import './index.css';

export default function BlogIndex({ data, location }) {
  const { title, keywords } = data.site.siteMetadata;
  const posts = data.allMarkdownRemark.edges;
  const talksRef = useRef();
  const [elementPositions, setElementPositions] = useState({
    posts: 0,
    talks: 0
  });
  const [contentMargin, setContentMargin] = useState(0);
  const [current, setCurrent] = useState('posts');

  useLayoutEffect(() => {
    const talks = talksRef.current.offsetTop;

    setElementPositions({
      talks,
      posts
    });
  }, [talksRef]);

  const onTalksClicked = useCallback(() => {
    setContentMargin(elementPositions.talks);
    setCurrent('talks');
  }, [elementPositions]);

  const onBlogPostsClicked = useCallback(() => {
    setContentMargin(0);
    setCurrent('posts');
  }, []);

  return (
    <Layout location={location} title={title}>
      <SEO title="Blog" keywords={keywords} />
      <div
        style={{
          marginBottom: rhythm(0.8)
        }}
      >
        <Bio />
      </div>
      <nav
        className="index__nav"
        aria-hidden={true}
        style={{ marginBottom: rhythm(0.8), fontSize: rhythm(0.7) }}
      >
        <button
          className={`${current === 'posts' ? 'm-current' : ''} index__navBtn`}
          onClick={onBlogPostsClicked}
        >
          <span>Blog posts</span>
        </button>
        <button
          className={`${current === 'talks' ? 'm-current' : ''} index__navBtn`}
          onClick={onTalksClicked}
        >
          <span>Talks</span>
        </button>
      </nav>
      <div className="index__contentContainer">
        <div
          className="index__content"
          style={{ transform: `translateY(${-contentMargin}px)` }}
        >
          <div className="posts">
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                marginBottom: rhythm(1)
              }}
            >
              <h2 style={{ margin: 0 }} id="blog-posts">
                Posts
              </h2>
              <a href="/rss.xml" aria-label="RSS feed">
                <MdRssFeed
                  size="24"
                  style={{ marginLeft: rhythm(0.2), color: '#f26522' }}
                />
              </a>
            </div>
            {posts.map(IndexPost)}
          </div>

          <div className="talks" ref={talksRef}>
            <h2 style={{ margin: 0, marginBottom: rhythm(1) }} id="talks">
              Talks
            </h2>
            <Talks />
          </div>
        </div>
      </div>
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
          marginBottom: 0
        }}
      >
        <Link to={node.fields.slug}>{title}</Link>
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
      limit: 10
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

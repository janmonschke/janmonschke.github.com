import React, { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { graphql, Link } from 'gatsby';
import { MdRssFeed } from 'react-icons/md';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { rhythm } from '../utils/typography';
import Talks from '../components/Talks';

import './index.css';
import { BlogPostsOnIndex } from '../components/index/BlogPostsOnIndex';
import { WeeknotesOnIndex } from '../components/index/WeeknotesOnIndex';

export default function BlogIndex(props) {
  const { data, location } = props;
  const { title, keywords } = data.site.siteMetadata;
  const weeknotesRef = useRef();
  const talksRef = useRef();
  const [elementPositions, setElementPositions] = useState({
    posts: 0,
    weeknotes: 0,
    talks: 0
  });
  const [contentMargin, setContentMargin] = useState(0);
  const [current, setCurrent] = useState('posts');

  useLayoutEffect(() => {
    const talks = talksRef.current.offsetTop;
    const weeknotes = weeknotesRef.current.offsetTop;

    setElementPositions({
      posts: 0,
      weeknotes,
      talks
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

  const onWeeknotesClicked = useCallback(() => {
    setContentMargin(elementPositions.weeknotes);
    setCurrent('weeknotes');
  });

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
          type="button"
          onClick={onBlogPostsClicked}
        >
          <span>Blog posts</span>
        </button>
        <button
          className={`${
            current === 'weeknotes' ? 'm-current' : ''
          } index__navBtn`}
          type="button"
          onClick={onWeeknotesClicked}
        >
          <span>Weeknotes</span>
        </button>
        <button
          className={`${current === 'talks' ? 'm-current' : ''} index__navBtn`}
          type="button"
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
          <div className="posts" style={{ marginBottom: rhythm(1) }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                marginBottom: rhythm(0.5)
              }}
            >
              <h2 style={{ margin: 0 }} id="blog-posts">
                Posts
              </h2>
              <a href="/rss.xml" aria-label="Blog post RSS feed">
                <MdRssFeed
                  size="24"
                  style={{ marginLeft: rhythm(0.2), color: '#f26522' }}
                />
              </a>
            </div>
            <BlogPostsOnIndex />
            <div
              style={{
                marginTop: rhythm(0.4),
                fontSize: rhythm(0.6),
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Link to="/blog">→ More blog posts</Link>
            </div>
          </div>

          <div
            className="weeknotes"
            ref={weeknotesRef}
            style={{ marginBottom: rhythm(1) }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline'
              }}
            >
              <h2 style={{ margin: 0 }} id="talks">
                Weeknotes
              </h2>
              <a href="/weeknotes.xml" aria-label="Weeknotes RSS feed">
                <MdRssFeed
                  size="24"
                  style={{ marginLeft: rhythm(0.2), color: '#f26522' }}
                />
              </a>
            </div>
            <p
              style={{
                margin: 0,
                marginTop: rhythm(0.5),
                marginBottom: rhythm(0.5)
              }}
            >
              Weeknotes are shorter, more regular and more personal blog posts
              that I publish on a weekly basis. Expect to read about updates of
              side projects, books that I like to read, food, living in Berlin
              and general life things.
            </p>
            <WeeknotesOnIndex />
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

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        keywords
      }
    }
  }
`;

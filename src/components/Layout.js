import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';

import { rhythm, scale } from '../utils/typography';

import favicon from '../images/favicon.ico';
import favicon16 from '../images/favicon-16x16.png';
import favicon32 from '../images/favicon-32x32.png';
import profile from '../images/profile.jpg';

import './Layout.css';

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;
    let header;

    if (location.pathname === rootPath) {
      header = (
        <div className="h-card">
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`
            }}
            to={`/`}
            className="Layout__homeLink u-url"
          >
            <img
              src={profile}
              className="Layout__titleProfile u-photo"
              alt=""
            />
            <h1
              style={{
                ...scale(0.8),
                marginBottom: rhythm(1.5)
              }}
              className="Layout__title p-name"
            >
              {title}
            </h1>
          </Link>
        </div>
      );
    } else {
      header = (
        <div className="Layout__titleContainer m-small h-card">
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`
            }}
            to={`/`}
            className="Layout__homeLink u-url"
          >
            <img
              src={profile}
              className="Layout__titleProfile u-photo"
              alt=""
            />
            <h3
              style={{
                marginTop: 0
              }}
              className="Layout__title p-name"
            >
              {title}
            </h3>
          </Link>
          <nav className="Layout__menuContainer">
            <ul className="Layout__menu">
              <li>
                <Link to="/blog" className="Layout__menuLink">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/weeknotes" className="Layout__menuLink">
                  Weeknotes
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      );
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(26),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
        }}
      >
        <Helmet
          link={[
            {
              rel: 'shortcut icon',
              type: 'image/x-icon',
              href: `${favicon}`
            },
            {
              rel: 'icon',
              type: 'image/png',
              sizes: '16x16',
              href: `${favicon16}`
            },
            {
              rel: 'icon',
              type: 'image/png',
              sizes: '32x32',
              href: `${favicon32}`
            }
          ]}
        />
        {header}
        {children}
        <script async defer src="https://scripts.withcabin.com/hello.js"></script>
      </div>
    );
  }
}

export default Layout;

import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';

import { rhythm, scale } from '../utils/typography';

import favicon from '../images/favicon.ico';
import favicon16 from '../images/favicon-16x16.png';
import favicon32 from '../images/favicon-32x32.png';

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;
    let header;

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.3),
            marginBottom: rhythm(1.5),
            marginTop: 0
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      );
    } else {
      header = (
        <h3
          style={{
            marginTop: 0
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      );
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
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
      </div>
    );
  }
}

export default Layout;

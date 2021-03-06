import React from 'react';
import { StaticQuery } from 'gatsby';
import cover from './assets/react-native-multiplayer-game-cover-v3.png';
import Bio from '../../components/Bio';
import './react-native-multiplayer-game.css';
import SEO from '../../components/SEO';

export default function ReactNativeMultiplayerGame() {
  const imageUrlWithoutSlash = cover.replace(/^\/+/, '');
  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              siteUrl
            }
          }
        }
      `}
      render={data => (
        <div className="reactNativeMGBook">
          <SEO
            title="Build a multiplayer game with React Native and Firebase"
            description="Learn how to use React Native and Firebase to build a fun mobile multiplayer puzzle game."
            meta={[
              {
                name: 'og:image',
                content: `${data.site.siteMetadata.siteUrl}${imageUrlWithoutSlash}`
              }
            ]}
          />
          <div className="reactNativeMGBook__bg"></div>
          <div className="reactNativeMGBook__top">
            <h1 className="reactNativeMGBook__headline">
              Build a multiplayer game
            </h1>
            <h2 className="reactNativeMGBook__subHeadline">
              with{' '}
              <span aria-hidden role="presentation">
                ⚛️
              </span>{' '}
              React Native and{' '}
              <span aria-hidden role="presentation">
                🔥
              </span>{' '}
              Firebase
            </h2>
          </div>
          <p>
            This book teaches you how to use <strong>React Native</strong> and{' '}
            <strong>Firebase</strong> to build a fun mobile multiplayer puzzle
            game. You will also learn how to build your own{' '}
            <strong>server</strong> for your app.
          </p>
          <div className="reactNativeMGBook__coverAndFacts">
            <img src={cover} className="reactNativeMGBook__cover" />
            <div className="reactNativeMGBook__facts">
              <p className="reactNativeMGBook__factsIntro ">
                The book will teach you how to:
              </p>
              <ul className="reactNativeMGBook__factsList">
                <li>
                  Build a game in <strong>React Native</strong>
                </li>
                <li>Add a multiplayer mode</li>
                <li>
                  Model <strong>Firebase</strong> databases
                </li>
                <li>Build a multiplayer server</li>
                <li>
                  Apply <strong>anti-cheating</strong> mechanisms
                </li>
                <li>Allow players to challenge their friends</li>
                <li>
                  Port the game <strong>to the browser</strong>
                </li>
              </ul>
            </div>
          </div>

          <p>
            Get notfied about updates on the book and get a{' '}
            <strong>10% discount</strong>{' '}
            <span aria-hidden role="presentation">
              🎉
            </span>{' '}
            when the book is released by subscribing to the newsletter:
          </p>

          <div>
            <form
              action="https://tinyletter.com/janmonschke"
              method="post"
              target="popupwindow"
              onSubmit={openWindow}
            >
              <label
                htmlFor="tlemail"
                className="reactNativeMGBook__newsletterLabel"
              >
                Enter your email address:
              </label>
              <input
                type="email"
                name="email"
                id="tlemail"
                className="reactNativeMGBook__email"
              />
              <input type="hidden" value="1" name="embed" />
              <input
                type="submit"
                value="Receive book updates"
                className="reactNativeMGBook__subscribe"
              />
            </form>
          </div>

          <hr />
          <Bio />
        </div>
      )}
    />
  );
}

function openWindow() {
  window.open(
    'https://tinyletter.com/janmonschke',
    'popupwindow',
    'scrollbars=yes,width=800,height=600'
  );
  return true;
}

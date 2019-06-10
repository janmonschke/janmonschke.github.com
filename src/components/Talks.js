import React from 'react';
import ExternalLink from './ExternalLink';
import { rhythm } from '../utils/typography';

export default function Talks() {
  return (
    <ul style={{ listStyle: 'none', margin: 0 }}>
      {talks.map(({ name, conferences, slides }) => (
        <li key={name} style={{ marginBottom: rhythm(1) }}>
          <div style={{ fontSize: rhythm(0.7), fontWeight: 500 }}>
            {name}{' '}
            {slides && <ExternalLink href={slides}>(Slides)</ExternalLink>}
          </div>
          <ul style={{ marginTop: 0 }}>
            {conferences.map(({ name, video, location }) => (
              <li
                key={name}
                style={{
                  marginBottom: rhythm(0.1)
                }}
              >
                {video && (
                  <ExternalLink href={video}>
                    {name} · {location}
                  </ExternalLink>
                )}
                {!video && (
                  <React.Fragment>
                    {name} · {location}
                  </React.Fragment>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

const slidePrefix = 'https://janmonschke.com';
const talks = [
  {
    name: 'Memory management in modern web applications',
    slides:
      'https://docs.google.com/presentation/d/13t9XpHWtNi498LkU3gTYNYkd6np5015EZmGaVsoEH_c/edit?usp=sharing',
    conferences: [
      {
        name: 'Frontend Con 2018',
        location: 'Warsaw, Poland',
        video: 'https://www.youtube.com/watch?v=dtDELTziIUo'
      },
      {
        name: 'ReactNotAConf 2018',
        location: 'Sofia, Bulgaria',
        video: 'https://www.youtube.com/watch?v=XtcGHhhGoZw'
      },
      {
        name: 'ReactFest 2018',
        location: 'London, UK',
        video: 'https://www.youtube.com/watch?v=aaGacO-Yybs'
      }
    ]
  },
  {
    name: 'Prototyping with React Native @ SoundCloud',
    slides: `${slidePrefix}/prototyping-at-soundcloud/`,
    conferences: [
      {
        name: 'AgentConf 2017',
        location: 'Dornbirn, Austria'
      }
    ]
  },
  {
    name: "How it's made: our opening of JSConf EU 2017",
    slides: 'https://nestedloops.github.io/jsconf-2017-presentation/',
    conferences: [
      {
        name: 'JSConf EU 2017',
        location: 'Berlin, Germany',
        video: 'https://www.youtube.com/watch?v=NpKLt_YO3o8'
      }
    ]
  },
  {
    name: '🎶 Nested Loops: PEOPLE GOT MAD',
    conferences: [
      {
        name: 'JSConf EU 2017',
        location: 'Berlin, Germany',
        video: 'https://www.youtube.com/watch?v=lCn-XCASn98'
      }
    ]
  },
  {
    name: 'Building collaborative & realtime applications with diffsync',
    slides: `${slidePrefix}/diffsync-presentation`,
    conferences: [
      {
        name: 'Frontend Union Conf 2015',
        location: 'Moscow, Russia',
        video: 'https://www.youtube.com/watch?v=YFaSK-W6u-E'
      }
    ]
  },
  {
    name: '🎶 Nested Loops: JavaScript, what are you?',
    conferences: [
      {
        name: 'JSConf EU 2015',
        location: 'Berlin, Germany',
        video: 'https://www.youtube.com/watch?v=lJ1kY-CSpBk'
      }
    ]
  },
  {
    name: 'Using the web for music production and live performances',
    slides: `${slidePrefix}/JSConf2014`,
    conferences: [
      {
        name: 'JSConf EU 2014',
        location: 'Berlin, Germany',
        video: 'https://www.youtube.com/watch?v=cqtBpCqgOgM'
      }
    ]
  },
  {
    name: 'Building a collaborative audio editor based on the Web Audio API',
    slides: `${slidePrefix}/Building-a-collaborative-web-audio-editor`,
    conferences: [
      {
        name: 'Web Audio Conference 2015',
        location: 'Paris, France',
        video: 'https://medias.ircam.fr/x7bde3a'
      },
      {
        name: 'ScotlandJS 2014',
        location: 'Edinburgh, Scotland',
        video: 'https://vimeo.com/96477738'
      }
    ]
  },
  {
    name: 'Making music with JavaScript and Gamepads',
    slides: `${slidePrefix}/Music-with-JS-and-Gamepads`,
    conferences: [
      {
        name: 'RejectJS 2013',
        location: 'Berlin, Germany',
        video: 'https://www.youtube.com/watch?v=0MigafMWLh0'
      }
    ]
  },
  {
    name: 'Genetic Algorithms in JavaScript',
    slides: `${slidePrefix}/Genetic-Algorithms/presentation`,
    conferences: [{ name: 'BerlinJS 2012', location: 'Berlin, Germany' }]
  }
];

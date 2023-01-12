const cheerio = require('cheerio');
const siteUrl = 'https://janmonschke.com';
const url = process.env.URL || siteUrl;

module.exports = {
  siteMetadata: {
    title: 'Jan Monschke',
    site_name: 'Jan Monschke - Developer Blog',
    author: 'Jan Monschke',
    description: 'The portfolio and blog of Jan Monschke',
    keywords: ['frontend', 'engineering', 'javascript', 'blog'],
    siteUrl,
    github: 'janmonschke',
    twitter: 'thedeftone'
  },
  plugins: [
    'gatsby-plugin-preact',
    {
      resolve: `gatsby-transformer-json`,
      options: {
        typeName: `webmentions`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/webmentions/data`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              quality: 80,
              withWebp: { quality: 80 }
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`
            }
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`
        ]
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [
                    {
                      'content:encoded': replaceBlurryImages(
                        edge.node.frontmatter.title,
                        edge.node.html
                      )
                    }
                  ]
                });
              });
            },
            query: `
            {
              allMarkdownRemark(
                limit: 1000,
                sort: { order: DESC, fields: [frontmatter___date] },
                filter: { frontmatter: { type: { eq: "blog" } } }
              ) {
                edges {
                  node {
                    excerpt
                    html
                    fields { slug }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            }
          `,
            output: '/rss.xml',
            title: 'Blog posts - janmonschke.com'
          },
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [
                    {
                      'content:encoded': replaceBlurryImages(
                        edge.node.frontmatter.title,
                        edge.node.html
                      )
                    }
                  ]
                });
              });
            },
            query: `
            {
              allMarkdownRemark(
                limit: 1000,
                sort: { order: DESC, fields: [frontmatter___date] },
                filter: { frontmatter: { type: { eq: "weeknote" } } }
              ) {
                edges {
                  node {
                    excerpt
                    html
                    fields { slug }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            }
          `,
            output: '/weeknotes.xml',
            title: 'Weeknotes - janmonschke.com'
          }
        ]
      }
    },
    `gatsby-plugin-react-helmet`,
    'gatsby-plugin-image',
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`
      }
    }
  ]
};

function replaceBlurryImages(title, htmlWithImages) {
  const $ = cheerio.load(htmlWithImages);
  const imageWrappers = $('.gatsby-resp-image-wrapper');
  console.log('replacing images', title, imageWrappers.length);
  imageWrappers.each((_, wrapper) => {
    const picture = $('picture', wrapper);
    const sources = $('source,img', picture);
    sources.each((i, source) => {
      const $sourceOrImg = $(source);
      const srcset = $sourceOrImg.attr('srcset');
      if (srcset) {
        $sourceOrImg.attr(
          'srcset',
          srcset.replaceAll('/static', `${url}/static`)
        );
      }
      const src = $sourceOrImg.attr('src');
      if (src) {
        $sourceOrImg.attr('src', src.replaceAll('/static', `${url}/static`));
      }
      $sourceOrImg.attr('sizes', '');
      $sourceOrImg.attr('style', 'max-width: 100%');
    });
    $(wrapper).replaceWith(picture);
  });

  return $.html();
}

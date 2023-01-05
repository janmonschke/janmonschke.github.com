const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogPost = path.resolve(`./src/templates/blog-post.js`);
  return Promise.all([
    queryByType(graphql, 'blog').then((result) => {
      if (result.errors) {
        throw result.errors;
      }

      // Create blog posts pages.
      const posts = result.data.allMarkdownRemark.edges;

      posts.forEach((post, index) => {
        const previous =
          index === posts.length - 1 ? null : posts[index + 1].node;
        const next = index === 0 ? null : posts[index - 1].node;
        const { slug } = post.node.fields;
        createPage({
          path: slug,
          component: blogPost,
          context: {
            slug,
            publicUrl: ensureTrailingSlash('https://janmonschke.com' + slug),
            previous,
            next
          }
        });
      });
    }),

    queryByType(graphql, 'weeknote').then((result) => {
      if (result.errors) {
        throw result.errors;
      }

      // Create weeknote pages.
      const weeknotes = result.data.allMarkdownRemark.edges;
      weeknotes.forEach((weeknote, index) => {
        const previous =
          index === weeknotes.length - 1 ? null : weeknotes[index + 1].node;
        const next = index === 0 ? null : weeknotes[index - 1].node;
        const { slug } = weeknote.node.fields;
        createPage({
          path: slug,
          component: blogPost,
          context: {
            slug,
            publicUrl: ensureTrailingSlash('https://janmonschke.com' + slug),
            previous,
            next
          }
        });
      });
    }),

    queryByType(graphql, 'project').then((result) => {
      if (result.errors) {
        throw result.errors;
      }

      // Create project pages.
      const projects = result.data.allMarkdownRemark.edges;
      const { slug } = post.node.fields;

      projects.forEach((post) => {
        createPage({
          path: slug,
          component: blogPost,
          context: {
            slug: post.node.fields.slug,
            publicUrl: ensureTrailingSlash('https://janmonschke.com' + slug)
          }
        });
      });
    })
  ]);
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = node.frontmatter.path
      ? `/${node.frontmatter.path}`
      : createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value
    });
  }
};

function queryByType(graphql, type) {
  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { frontmatter: { type: { eq: "${type}" } } }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                type
              }
            }
          }
        }
      }
    `
  );
}

function ensureTrailingSlash(url) {
  return url[url.length - 1] === '/' ? url : url + '/';
}

const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogPost = path.resolve(`./src/templates/blog-post.js`);
  return Promise.all([
    queryByType(graphql, 'blog').then(result => {
      if (result.errors) {
        throw result.errors;
      }

      // Create blog posts pages.
      const posts = result.data.allMarkdownRemark.edges;

      posts.forEach((post, index) => {
        const previous =
          index === posts.length - 1 ? null : posts[index + 1].node;
        const next = index === 0 ? null : posts[index - 1].node;

        createPage({
          path: post.node.fields.slug,
          component: blogPost,
          context: {
            slug: post.node.fields.slug,
            previous,
            next
          }
        });
      });
    }),

    queryByType(graphql, 'weeknote').then(result => {
      if (result.errors) {
        throw result.errors;
      }

      // Create weeknote pages.
      const weeknotes = result.data.allMarkdownRemark.edges;
      console.log(weeknotes.length);
      weeknotes.forEach((weeknote, index) => {
        console.log(JSON.stringify(weeknote, null, 2));
        const previous =
          index === weeknotes.length - 1 ? null : weeknotes[index + 1].node;
        const next = index === 0 ? null : weeknotes[index - 1].node;

        createPage({
          path: weeknote.node.fields.slug,
          component: blogPost,
          context: {
            slug: weeknote.node.fields.slug,
            previous,
            next
          }
        });
      });
    }),

    queryByType(graphql, 'project').then(result => {
      if (result.errors) {
        throw result.errors;
      }

      // Create project pages.
      const projects = result.data.allMarkdownRemark.edges;

      projects.forEach(post => {
        createPage({
          path: post.node.fields.slug,
          component: blogPost,
          context: {
            slug: post.node.fields.slug
          }
        });
      });
    })
  ]);
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = node.frontmatter.path ? `/${node.frontmatter.path}` : createFilePath({ node, getNode });
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

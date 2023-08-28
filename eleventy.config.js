const fs = require("fs");
const path = require("path");
const typography = require("./utils/typography");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const Image = require("@11ty/eleventy-img");
const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItEleventyImg = require("markdown-it-eleventy-img");
const renderBlogPicture = require("./utils/renderBlogPicture");
const metadata = require("./_data/metadata");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { format, parseISO } = require("date-fns");
const { CONTENT_DIR } = require("./utils/constants");
const {
  getSlugFromPathName,
  replaceUrlsAndAtMentions,
} = require("./utils/webmentions");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");

  eleventyConfig.addGlobalData("typographyStyles", typography.toString());

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- more -->",
  });
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginWebc, {
    components: ["./_components/**/*.webc", "npm:@11ty/eleventy-img/*.webc"],
  });

  eleventyConfig.addPlugin(Image.eleventyImagePlugin, imageOptions);

  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      breaks: true,
      linkify: true,
    })
      .use(markdownItFootnote)
      .use(markdownItEleventyImg, {
        imgOptions: {
          ...imageOptions,
        },
        globalAttributes: {
          ...imageOptions.defaultAttributes,
        },
        resolvePath: (filepath, env) => {
          return path.join(path.dirname(env.page.inputPath), filepath);
        },
        renderImage: (_, [src, attributes]) => {
          return renderBlogPicture({
            src,
            attributes,
            includeCaption: true,
            linkToImage: true,
          });
        },
      })
  );

  eleventyConfig.addCollection("weeknotes", async function (collectionApi) {
    // Collections are sorted in ascending order in eleventy,
    // so we reversethat order for blog posts.
    const blogPosts = [...collectionApi.getFilteredByTag("weeknote")].reverse();
    console.log("weeknotes length", blogPosts.length);
    return await Promise.all(mapPosts(blogPosts));
  });

  eleventyConfig.addCollection("blogPosts", async function (collectionApi) {
    // Collections are sorted in ascending order in eleventy,
    // so we reversethat order for blog posts.
    const blogPosts = [...collectionApi.getFilteredByTag("post")].reverse();
    return await Promise.all(mapPosts(blogPosts));
  });

  return {
    dir: {
      input: CONTENT_DIR,
      includes: "../_includes",
      data: "../_data",
    },
  };
};

const imageOptions = {
  formats: ["avif", "webp", "jpeg", "svg"],
  svgShortCircuit: true,

  urlPath: "/img",

  defaultAttributes: {
    loading: "lazy",
    decoding: "async",
  },

  sharpWebpOptions: {
    quality: 80,
  },
  sharpJpegOptions: {
    quality: 90,
  },
  sharpAvifOptions: {
    quality: 80,
  },
};

function getFilename(fullPath) {
  return fullPath.replace(/^.*[\\\/]/, "");
}

function mapPosts(posts) {
  return posts.map(async (blogPost, index, posts) => {
    const isFirstPost = index === 0;
    const isLastPost = index === posts.length - 1;
    const prevPostObj = isLastPost ? undefined : posts[index + 1];
    const nextPostObj = isFirstPost ? undefined : posts[index - 1];

    blogPost.data.prevPost = prevPostObj && {
      title: prevPostObj.data.title,
      url: prevPostObj.url,
    };

    blogPost.data.nextPost = nextPostObj && {
      title: nextPostObj.data.title,
      url: nextPostObj.url,
    };

    blogPost.data.dateDisplay = format(blogPost.data.date, "MMM dd, yyyy");
    blogPost.data.dateDisplayLong = format(blogPost.data.date, "MMMM dd, yyyy");

    const webmentionsFileName = `${getSlugFromPathName(blogPost.url)}.json`;
    const webmentionsFilePath = path.join(
      "webmentions",
      "data",
      webmentionsFileName
    );

    if (fs.existsSync(webmentionsFilePath)) {
      const webmentions = JSON.parse(fs.readFileSync(webmentionsFilePath));
      const mentions = webmentions
        .filter(
          (wm) =>
            wm["wm-property"] === "mention-of" ||
            wm["wm-property"] === "in-reply-to"
        )
        .sort((a, b) => {
          // sort missing dates to the end
          if (!a.published) {
            return 1;
          }
          if (!b.published) {
            return -1;
          }
          const aDate = new Date(a.published);
          const bDate = new Date(b.published);

          return aDate.getTime() - bDate.getTime();
        })
        .map((mention) => {
          if (!mention.content) {
            mention.isReference = true;
            return mention;
          }
          mention.enrichedContent = replaceUrlsAndAtMentions(mention.content);
          mention.publishedDisplay = format(
            parseISO(mention.published),
            "yyyy/MM/dd hh:mm"
          );
          return mention;
        });
      const likes = webmentions.filter((wm) => wm["wm-property"] === "like-of");

      blogPost.data.mentions = mentions;
      blogPost.data.likes = likes;
    }

    const coverImagePath = blogPost.data.image
      ? blogPost.inputPath.replace(
          getFilename(blogPost.inputPath),
          blogPost.data.image
        )
      : undefined;

    if (coverImagePath) {
      let shareMetadata = await Image(coverImagePath, {
        ...imageOptions,
        widths: [600],
        formats: ["jpeg"],
      });
      blogPost.data.shareImageUrl =
        metadata.siteUrl + shareMetadata.jpeg[0].url;
    }

    return blogPost;
  });
}

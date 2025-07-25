const path = require("path");
const Image = require("@11ty/eleventy-img");
const imageOptions = require("./imageOptions");
const { CONTENT_DIR } = require("./constants");

const imageAttributes = {
  ...imageOptions.defaultAttributes,
  sizes: "(max-width: 705px), 100vw",
  class: "picture",
};

const baseUrlPath = "/img/content";
const baseOutputDir = path.join("_site", "img", "content");

const baseImageOptions = {
  ...imageOptions,
  urlPath: "/img/content",
  outputDir: path.join("_site", "img", "content"),
  widths: [352, 705, 1500, 2000],
};

module.exports = function renderBlogPicture({
  src,
  attributes,
  includeCaption,
  linkToImage,
}) {
  // make sure that images have nice urls e.g. /img/content/france/HIKENAME/image
  const pathArray = src.split(path.sep);
  const contentIndex = pathArray.indexOf(CONTENT_DIR);
  const imagesIndex = pathArray.indexOf("images");
  const relativeFolder = pathArray.slice(contentIndex + 1, imagesIndex);
  const urlPath = [baseUrlPath, ...relativeFolder].join("/");
  const outputDir = path.join(baseOutputDir, ...relativeFolder);

  const actualImageOptions = {
    ...baseImageOptions,
    urlPath,
    outputDir,
  };

  Image(src, actualImageOptions);

  const metadata = Image.statsSync(src, actualImageOptions);
  const mergedAttributes = { ...imageAttributes, ...attributes };
  let imageMarkup = Image.generateHTML(metadata, mergedAttributes, {
    whitespaceMode: "inline",
  });

  if (linkToImage) {
    const biggestJpeg = metadata.jpeg?.[metadata.jpeg.length - 1];
    const biggestSvg = metadata.svg?.[metadata.svg.length - 1];
    const imageLinkHref = biggestJpeg ? biggestJpeg.url : biggestSvg.url;
    imageMarkup = `
      <a href="${imageLinkHref}" target="_blank" aria-label="Click to open image in new window">
        ${imageMarkup}
      </a>
    `;
  }

  if (includeCaption) {
    return `
      <figure>
        ${imageMarkup}
        <figcaption class="picture__caption">${mergedAttributes.alt}</figcaption>
      </figure>`;
  } else {
    return imageMarkup;
  }
};

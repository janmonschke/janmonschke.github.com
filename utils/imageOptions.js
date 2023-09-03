module.exports = {
  formats: ["avif", "webp", "jpeg", "svg"],
  svgShortCircuit: true,

  urlPath: "/img/content",

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

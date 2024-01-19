const Typography = require("typography");
const StAnnes = require("typography-theme-st-annes").default;

StAnnes.baseLineHeight = 1.6;
StAnnes.baseFontSize = "18px";

StAnnes.overrideThemeStyles = ({ rhythm }) => ({
  a: {
    color: "#007acc",
  },
  p: {
    marginTop: rhythm(0.7),
    marginBottom: rhythm(0.7),
  },
  "h2,h3,h4": {
    marginBottom: rhythm(0.7),
    marginTop: rhythm(1),
  },
});

delete StAnnes.googleFonts;

const typography = new Typography(StAnnes);

module.exports = typography;

const Typography = require("typography");
const StAnnes = require("typography-theme-st-annes").default;

StAnnes.baseLineHeight = 1.6;
StAnnes.baseFontSize = "18px";

StAnnes.overrideThemeStyles = ({ rhythm }) => ({
  a: {
    color: "#007acc",
  },
  p: {
    marginBottom: rhythm(1),
  },
  "h2,h3,h4": {
    marginBottom: rhythm(1 / 2),
    marginTop: rhythm(1 / 2),
  },
});

delete StAnnes.googleFonts;

const typography = new Typography(StAnnes);

module.exports = typography;

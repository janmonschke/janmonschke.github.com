import Typography from 'typography';
import StAnnes from 'typography-theme-st-annes';

StAnnes.baseLineHeight = 1.6;
StAnnes.baseFontSize = '18px';

StAnnes.overrideThemeStyles = ({ rhythm }) => ({
  a: {
    color: '#007acc'
  },
  p: {
    marginBottom: rhythm(1)
  },
  'h2,h3': {
    marginBottom: rhythm(1 / 2),
    marginTop: rhythm(1 / 2)
  }
});

delete StAnnes.googleFonts;

const typography = new Typography(StAnnes);

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;

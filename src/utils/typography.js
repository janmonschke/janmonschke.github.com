import Typography from 'typography';
import StAnnes from 'typography-theme-st-annes';

StAnnes.baseLineHeight = 1.6;
StAnnes.baseFontSize = '18px';

StAnnes.overrideThemeStyles = () => ({
  a: {
    color: '#007acc'
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

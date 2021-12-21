import { createStitches } from '@stitches/react';

export const { styled, getCssText } = createStitches({
  theme: {
    fonts: {
      system: 'system-ui',
      sans: 'Open Sans',
    },
    colors: {
      primary: '#5865f2',
      secondary: '#4e545c',
      success: '#57f287',
      info: '#5865f2',
      warning: '#fee75c',
      danger: '#ed4245',
      dark: '#36393f',
      light: '#dddddd',
      darker: '#2e3136',
      link: '#2d81ff',

      // Dark
      primaryDark: '#5259d7',

      // Grays
      gray100: '#fafafa',
      gray200: '#f5f5f5',
      gray300: '#eeeeee',
      gray400: '#e0e0e0',
      gray500: '#bdbdbd',
      gray600: '#9e9e9e',
      gray700: '#757575',
      gray800: '#2f3136',
      gray900: '#212529',
    },
    fontSizes: {
      1: '13px',
      2: '15px',
      3: '17px',
    },
    radii: {
      1: '0.3rem',
      2: '0.5rem',
      3: '0.7rem',
    },
  },
  media: {
    bp1: '(min-width: 640px)',
    bp2: '(min-width: 768px)',
    bp3: '(min-width: 1024px)',
  },
});

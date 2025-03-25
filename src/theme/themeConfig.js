// Light and dark theme configurations
const themeConfig = {
  token: {
    borderRadius: 2,
    colorPrimary: '#1890ff', // Primary/6 color (Ant Design's default primary color)
    fontSizeHeading1: 20, // 20px for h1
    lineHeightHeading1: 28 / 20, // 28px line height for h1 (expressed as a multiplier)
    fontSizeHeading2: 16, // 16px for h2
    lineHeightHeading2: 24 / 16, // 24px line height for h2 (expressed as a multiplier)
    fontWeightStrong: 500, // This affects h1 font weight at the token level
    // fontFamily:
    //   "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 2,
    },
    Card: {
      borderRadius: 2,
    },
    Input: {
      borderRadius: 2,
    },
    Select: {
      borderRadius: 2,
    },
    Typography: {
      h1: {
        fontSize: 20,
        lineHeight: 28 / 20,
        fontWeight: 500,
      },
      h2: {
        fontSize: 16,
        lineHeight: 24 / 16,
        fontWeight: 500,
      },
    },
  },
};

export default themeConfig;

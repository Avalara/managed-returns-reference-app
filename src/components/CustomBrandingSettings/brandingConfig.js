/*
 * Contents of this file was produced with a help of a code generation tool and
 * subsequently reviewed and edited by a human.
 *
 * While some of the code was created by an AI assisted service, manual adjustments
 * have been made to ensure correctness, readability, functionality and compliance
 * to Avalara's coding standards and guidelines.
 * Any future modifications should be approached with caution to avoid
 * overwriting the manual changes.
 *
 *
 * This source code is owned by Avalara Inc. Unauthorized copying of this file,
 * via any medium, is strictly prohibited. Proprietary and confidential.
 *
 * For more information, refer to the documentation or contact the development team.
 */

/**
 * Default branding configuration
 * These values will be used as fallbacks if custom configurations are not provided
 */
const defaultThemeSettings = {
  borderRadius: 2,
  fontSizeHeading1: 20, // 20px for h1
  lineHeightHeading1: 28 / 20, // 28px line height for h1 (expressed as a multiplier)
  fontSizeHeading2: 16, // 16px for h2
  lineHeightHeading2: 24 / 16, // 24px line height for h2 (expressed as a multiplier)
  fontWeightStrong: 500,
};
const defaultBrandingConfig = {
  // Theme configuration
  theme: {
    ...defaultThemeSettings,
    colorPrimary: '#1677FF',
  },
  // Branding configuration
  branding: {
    partnerName: 'Avalara',
    logoUrl: null, // Will use the default logo from assets if null
    faviconUrl: null, // Will use the default favicon if null
  },
};

/**
 * Load branding configuration from localStorage or external source
 * This allows admins to customize the theme without committing changes to the repo
 */
export const loadBrandingConfig = () => {
  try {
    // Try to load custom configuration from localStorage
    const storedConfig = localStorage.getItem('brandingConfig');
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig);
      return {
        theme: {
          ...defaultBrandingConfig.theme,
          ...parsedConfig.theme,
        },
        branding: {
          ...defaultBrandingConfig.branding,
          ...parsedConfig.branding,
        },
      };
    }
  } catch (error) {
    console.error('Error loading branding configuration:', error);
  }

  return defaultBrandingConfig;
};

/**
 * Save branding configuration to localStorage
 * @param {Object} config - The branding configuration to save
 */
export const saveBrandingConfig = (config) => {
  try {
    const mergedConfig = {
      theme: {
        ...defaultBrandingConfig.theme,
        ...config.theme,
      },
      branding: {
        ...defaultBrandingConfig.branding,
        ...config.branding,
      },
    };
    localStorage.setItem('brandingConfig', JSON.stringify(mergedConfig));
    return true;
  } catch (error) {
    console.error('Error saving branding configuration:', error);
    return false;
  }
};

/**
 * Clear branding configuration from localStorage
 * @returns {boolean} - True if the configuration was cleared successfully
 */
export const clearBrandingConfig = () => {
  try {
    localStorage.removeItem('brandingConfig');
    return true;
  } catch (error) {
    console.error('Error clearing branding configuration:', error);
    return false;
  }
};

export const updateDocumentTitle = (partnerName) => {
  // Update document title with partner name
  if (partnerName) {
    document.title = `${partnerName} Returns`;
  }
};

export const updateFavicon = (faviconUrl) => {
  if (faviconUrl) {
    const link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
};

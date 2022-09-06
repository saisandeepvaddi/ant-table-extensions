module.exports = {
  stories: ["../stories/**/*.stories.mdx", "../stories/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-postcss",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  features: {
    postcss: false,
  },
};

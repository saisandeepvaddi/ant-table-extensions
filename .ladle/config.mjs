export default {
  stories: ["./stories/*.stories.tsx"],
  storyOrder: (stories) => {
    return [
      "demos--default",
      "demos--searchable",
      "demos--exportable",
      "demos--searchable-and-exportable",
      "demos--advanced-search-input",
      "demos--advanced-export-button",
      "demos--custom-seach-input",
      "demos--custom-export-button",
      "demos--customize-export-data",
      "demos--pick-export-columns",
    ];
  },
};

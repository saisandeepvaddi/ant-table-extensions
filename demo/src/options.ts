export const options = {
  searchable: "Searchable",
  exportable: "Exportable",
  searchableExportable: "Searchable & Exportable",
} as const;

export type Options = keyof typeof options;

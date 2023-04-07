import { ButtonProps, InputProps } from "antd";
import { ColumnGroupType, ColumnType } from "antd/es/table";
import { TableProps as AntTableProps } from "antd/lib/table";
import { ReactNode } from "react";
import Fuse from "fuse.js";

export type DataSource = any;

type CustomDataSourceType<T> = TableProps<T>["dataSource"];

export interface TableProps<T> extends AntTableProps<T> {
  /** Exportable Table */
  exportable?: boolean;
  /** Props object to customize export button */
  exportableProps?: ExportFieldButtonProps;
  /** Searchable Table */
  searchable?: boolean;
  /** Props object to customize export button */
  searchableProps?: SearchTableInputProps;
}

export interface TableExportFields {
  [dataIndex: string]:
    | string
    | {
        header: string;
        formatter?: (fieldValue: any, record: any, index: number) => string;
      };
}

/**@deprecated Removed `I` prefix for interfaces. Use TableExportFields. */
export type ITableExportFields = TableExportFields;

export interface ExportFieldButtonProps<T = DataSource> {
  /** Ant table's dataSource */
  dataSource?: TableProps<T>["dataSource"];
  /** Ant table's columns */
  columns?: TableProps<T>["columns"];
  /** File name to use when exporting to csv */
  fileName?: string;
  /** Customize csv file like column header names, fields to include/exclude. More on this below. */
  fields?: TableExportFields;
  /** Disables export button. Useful when you want to disable when dataSource is loading. */
  disabled?: boolean;
  /** Any of Ant Button component props as object. */
  btnProps?: ButtonProps;
  /** Can be used to change text in button. */
  children?: ReactNode;
  /** Shows a modal to pick which columns to include exported file. */
  showColumnPicker?: boolean;
}

/**@deprecated Removed `I` prefix for interfaces. Use ExportFieldButtonProps. */
export type IExportFieldButtonProps = ExportFieldButtonProps;

export type ColumnWithDataIndex<T = DataSource> = (
  | ColumnGroupType<T>
  | ColumnType<T>
) & {
  dataIndex?: string | string[];
};

export interface SearchTableInputProps<T = DataSource> {
  /** Custom function to search if you want to use your own search.
   *  Takes dataSource and searchTerm and should return filtered dataSource.
   */
  searchFunction?: (
    dataSource: CustomDataSourceType<T>,
    searchTerm: string
  ) => CustomDataSourceType<T>;

  /** Ant table's dataSource. */
  dataSource?: CustomDataSourceType<T>;

  /** Ant table's columns */
  columns?: TableProps<T>["columns"];

  /** `setState` style function which updates dataSource. */
  setDataSource?: (dataSource: CustomDataSourceType<T>) => void;
  /** Debounces search  */
  debounce?: boolean;
  /** Any of Ant Input component's props as object. */
  inputProps?: InputProps;
  /** Allow fuzzy search or search for exact search term. */
  fuzzySearch?: boolean;
  /** Uses Fuse.js for search. Pass any of fuse.js options here as object. */
  fuseProps?: Fuse.IFuseOptions<T>;
}

/**@deprecated Removed `I` prefix for interfaces. Use SearchTableInputProps. */
export type ISearchTableInputProps = SearchTableInputProps;

export type ExportableTableProps<T = DataSource> = TableProps<T> &
  ExportFieldButtonProps<T>;

/**@deprecated Removed `I` prefix for interfaces. Use ExportableTableProps. */
export type IExportableTableProps = ExportableTableProps;

export type ITableUtils<T = DataSource> = {
  /** Exportable Table */
  exportable?: boolean;
  /** Props object to customize export button */
  exportableProps?: ExportFieldButtonProps<T>;
  /** Searchable Table */
  searchable?: boolean;
  /** Props object to customize export button */
  searchableProps?: SearchTableInputProps;
};

/**@deprecated Removed `I` prefix for interfaces. Use TableProps. */
export type ITableProps<T> = TableProps<T>;

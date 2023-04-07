import { ButtonProps, InputProps } from "antd";
import { ColumnGroupType, ColumnsType, ColumnType } from "antd/es/table";
import { TableProps as AntTableProps } from "antd/lib/table";
import { ReactNode } from "react";
import Fuse from "fuse.js";

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

export interface ExportFieldButtonProps {
  /** Ant table's dataSource */
  dataSource?: readonly any[];
  /** Ant table's columns */
  columns?: ColumnsType<any>;
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

export type ColumnWithDataIndex = (ColumnGroupType<any> | ColumnType<any>) & {
  dataIndex?: string | string[];
};

export interface SearchTableInputProps {
  /** Custom function to search if you want to use your own search.
   *  Takes dataSource and searchTerm and should return filtered dataSource.
   */
  searchFunction?: (dataSource: readonly any[], searchTerm: string) => any[];

  /** Ant table's dataSource. */
  dataSource?: readonly any[];

  /** Ant table's columns */
  columns?: ColumnsType<any>;

  /** `setState` style function which updates dataSource. */
  setDataSource?: (dataSource: any[]) => void;
  /** Debounces search  */
  debounce?: boolean;
  /** Any of Ant Input component's props as object. */
  inputProps?: InputProps;
  /** Allow fuzzy search or search for exact search term. */
  fuzzySearch?: boolean;
  /** Uses Fuse.js for search. Pass any of fuse.js options here as object. */
  fuseProps?: Fuse.IFuseOptions<any>;
}

/**@deprecated Removed `I` prefix for interfaces. Use SearchTableInputProps. */
export type ISearchTableInputProps = SearchTableInputProps;

export type ExportableTableProps = TableProps<any> & ExportFieldButtonProps;

/**@deprecated Removed `I` prefix for interfaces. Use ExportableTableProps. */
export type IExportableTableProps = ExportableTableProps;

export type ITableUtils = {
  /** Exportable Table */
  exportable?: boolean;
  /** Props object to customize export button */
  exportableProps?: ExportFieldButtonProps;
  /** Searchable Table */
  searchable?: boolean;
  /** Props object to customize export button */
  searchableProps?: SearchTableInputProps;
};

export type TableProps<T> = AntTableProps<T> & ITableUtils;

/**@deprecated Removed `I` prefix for interfaces. Use TableProps. */
export type ITableProps<T> = TableProps<T>;

import React from "react";
import { Table as AntTable } from "antd";
// import ExportTableButton from "./ExportTableButton";
import { TableProps } from "antd/lib/table";
import { ExportableTable } from "./ExportableTable";
import { IExportFieldButtonProps } from "./ExportTableButton";
import { SearchableTable } from "./SearchableTable";

export type IExportableTableProps = TableProps<any> & IExportFieldButtonProps;

export type ITableUtils = {
  exportable?: boolean;
  exportableProps?: IExportFieldButtonProps;
  searchable?: boolean;
};

export type ITableProps<T> = TableProps<T> & ITableUtils;

export const Table: React.FC<ITableProps<any>> = props => {
  if (props.exportable || props.exportableProps) {
    const { exportable, exportableProps, ...otherProps } = props;
    return (
      <ExportableTable {...otherProps} exportableProps={exportableProps} />
    );
  } else if (props.searchable) {
    const { searchable, ...otherProps } = props;
    return <SearchableTable {...otherProps} />;
  }
  return <AntTable {...props} />;
};

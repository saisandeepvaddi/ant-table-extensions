import React from "react";
import { Table as AntTable } from "antd";
// import ExportTableButton from "./ExportTableButton";
import { TableProps } from "antd/lib/table";
import { ExportableTable } from "./ExportableTable";
import { IExportFieldButtonProps } from "./ExportTableButton";

export type IExportableTableProps = TableProps<any> & IExportFieldButtonProps;

export type ITableUtils = {
  exportable?: boolean;
  exportableProps?: IExportFieldButtonProps;
};

export type ITableProps<T> = TableProps<T> & ITableUtils;

export const Table: React.FC<ITableProps<any>> = props => {
  if (props.exportable || props.exportableProps) {
    const { exportable, exportableProps, ...otherProps } = props;
    return (
      <ExportableTable {...otherProps} exportableProps={exportableProps} />
    );
  }
  return <AntTable {...props} />;
};

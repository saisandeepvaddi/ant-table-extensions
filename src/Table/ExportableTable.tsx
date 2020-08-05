import React from "react";
import { Table as AntTable } from "antd";
import ExportTableButton, {
  IExportFieldButtonProps,
} from "./ExportTableButton";
import { TableProps, ColumnProps } from "antd/lib/table";

type IExportableTableProps = TableProps<any> & IExportFieldButtonProps;
export const ExportableTable: React.FC<IExportableTableProps> = props => {
  const { dataSource, columns } = props;
  const fields = {};
  columns?.forEach((column: ColumnProps<any>) => {
    const { title, key, dataIndex } = column;
    const fieldName =
      (Array.isArray(dataIndex) ? dataIndex.join(".") : dataIndex) ?? key;
    if (fieldName) {
      fields[fieldName] = title;
    }
  });

  return (
    <div>
      <ExportTableButton dataSource={dataSource} fields={fields}>
        Export
      </ExportTableButton>
      <AntTable {...props} />
    </div>
  );
};

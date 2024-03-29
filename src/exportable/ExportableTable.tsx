import React from "react";
import { Table as AntTable } from "antd";
import ExportTableButton from "./ExportTableButton";
import { DataSource, TableProps } from "../types";

export const ExportableTable: React.FC<TableProps<DataSource>> = (props) => {
  const { dataSource, columns, exportableProps } = props;

  return (
    <>
      <div
        className="export-table-button-container"
        style={{ marginBottom: 10 }}
      >
        <ExportTableButton
          dataSource={dataSource}
          columns={columns}
          {...exportableProps}
        >
          Export
        </ExportTableButton>
      </div>
      <AntTable {...props} />
    </>
  );
};

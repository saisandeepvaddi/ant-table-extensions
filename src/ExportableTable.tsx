import React from "react";
import { Table as AntTable } from "antd";
import ExportTableButton from "./ExportTableButton";
import { TableProps } from "./types";

export const ExportableTable: React.FC<TableProps<any>> = props => {
  const { dataSource, columns, exportableProps } = props;

  return (
    <React.Fragment>
      <div style={{ marginBottom: 10 }}>
        <ExportTableButton
          dataSource={dataSource}
          columns={columns}
          {...exportableProps}
        >
          Export
        </ExportTableButton>
      </div>
      <AntTable {...props} />
    </React.Fragment>
  );
};

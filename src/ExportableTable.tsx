import React from "react";
import { Table as AntTable } from "antd";
import ExportTableButton from "./ExportTableButton";
import { ITableProps } from "./index";

export const ExportableTable: React.FC<ITableProps<any>> = props => {
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

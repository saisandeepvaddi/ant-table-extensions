import React from "react";
import { Table } from "../src";
import { FileExcelOutlined } from "@ant-design/icons";
import { columns, dataSource } from "./fixtures/table";
import ExportTableButton from "../src/Table/ExportTableButton";

export default {
  component: Table,
  title: "Table",
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.

export const Default = () => (
  <Table dataSource={dataSource} columns={columns} />
);

export const Searchable = () => {
  return <Table dataSource={dataSource} columns={columns} searchable />;
};

export const Exportable = () => {
  return <Table dataSource={dataSource} columns={columns} exportable />;
};

export const SelectExportColumns = () => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      exportable
      exportableProps={{ showExportColumnPicker: true }}
    />
  );
};

export const CustomExportButton = () => {
  return (
    <div>
      <ExportTableButton
        dataSource={dataSource}
        columns={columns}
        btnProps={{ type: "primary", icon: <FileExcelOutlined /> }}
        showExportColumnPicker
      >
        Export to CSV
      </ExportTableButton>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

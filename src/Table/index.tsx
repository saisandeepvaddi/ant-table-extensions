import React from "react";
import { Table as AntTable } from "antd";
import ExportTableButton from "./ExportTableButton";

export const Table = props => {
  return <AntTable {...props} />;
};

Table.ExportButton = ExportTableButton;

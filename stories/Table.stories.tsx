import React from "react";
import { Table, ExportableTable } from "../src";
import { TableProps } from "antd/lib/table";

export default {
  component: Table,
  title: "Table",
};

const tableProps: TableProps<any> = {
  dataSource: [
    {
      id: 1,
      name: "Sai",
      country: "India",
    },
    {
      id: 2,
      name: "Vaddi",
      country: "USA",
    },
  ],
  columns: [
    {
      dataIndex: "name",
      title: "Name",
    },
    {
      dataIndex: "country",
      title: "Country",
    },
  ],
  rowKey: "id",
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Default = (props: any) => <Table {...props} {...tableProps} />;

export const Exportable = (props: any) => {
  return <ExportableTable {...props} {...tableProps} />;
};

export const CustomExportable = (props: any) => {
  const fieldNames = {
    name: "Name",
    country: "Country",
  };

  return (
    <div>
      <Table.ExportButton
        dataSource={tableProps.dataSource}
        fields={fieldNames}
        btnProps={{ type: "primary" }}
      >
        Export
      </Table.ExportButton>
      <Table {...props} {...tableProps} />
    </div>
  );
};

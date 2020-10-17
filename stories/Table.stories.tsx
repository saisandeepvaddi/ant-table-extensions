import * as React from "react";
import {
  Table,
  ITableProps,
  ExportTableButton,
  SearchTableInput,
  ITableExportFields,
} from "../src";
import { FileExcelOutlined, SearchOutlined } from "@ant-design/icons";
import { columns, dataSource } from "../fixtures/table";
// import ExportTableButton, {
//   ITableExportFields,
// } from "../src/ExportTableButton";
// import SearchTableInput from "../src/SearchTableInput";

import "antd/dist/antd.compact.min.css";
// import { ITableExportFields } from "../src/ExportTableButton";

export default {
  component: Table,
  title: "Demos",
};

// // By passing optional props to this story, you can control the props of the component when
// // you consume the story in a test.

export const Default = (props: ITableProps<any>) => {
  // Default table. Same as Ant Table
  return <Table dataSource={dataSource} columns={columns} {...props} />;
};

export const Searchable = () => {
  return <Table dataSource={dataSource} columns={columns} searchable />;
};

export const Exportable = () => {
  return <Table dataSource={dataSource} columns={columns} exportable />;
};

export const SearchableAndExportable = () => {
  return (
    <Table dataSource={dataSource} columns={columns} exportable searchable />
  );
};

export const PickExportColumns = () => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      exportable
      exportableProps={{ showColumnPicker: true }}
    />
  );
};

export const CustomizeExportData = () => {
  /**
   * {
   *   [dataIndex]: header | {header: "column header name in csv", formatter: (fieldValue, record, rowIndex) => value}
   * }
   *
   */
  const fields: ITableExportFields = {
    firstName: "Name",
    fullName: {
      header: "Full Name",
      formatter: (_fieldValue, record) => {
        return record?.firstName + " " + record?.lastName;
      },
    },
    country: {
      header: "Your Country",
      formatter: fieldValue => {
        return "-->  " + fieldValue;
      },
    },
  };
  return (
    <React.Fragment>
      <p>
        <span role="img" aria-label="red circle">
          🔴
        </span>{" "}
        <b>NOTE:</b> Click 'Show Code' to see usage.
      </p>
      <Table
        dataSource={dataSource}
        columns={columns}
        exportable
        exportableProps={{ fields, fileName: "my-table" }}
      />
    </React.Fragment>
  );
};

export const CustomExportButton = () => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      exportableProps={{
        btnProps: {
          type: "primary",
          icon: <FileExcelOutlined />,
          children: <span>Export to CSV</span>,
        },
      }}
    />
  );
};

export const CustomSeachInput = () => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      searchableProps={{
        // dataSource,
        // setDataSource: setSearchDataSource,
        inputProps: {
          placeholder: "Search this table...",
          prefix: <SearchOutlined />,
        },
      }}
    />
  );
};

export const AdvancedExportButton = () => {
  /**
   * Use if you want to move around the Export button.
   * import { ExportTableButton } from "ant-table-extensions";
   * It accepts all exportableProps along with dataSource, columns props as required props.
   */
  return (
    <div>
      <p>
        <span role="img" aria-label="red circle">
          🔴
        </span>{" "}
        <b>NOTE:</b> Click 'Show Code' to see comments about usage.
      </p>

      <ExportTableButton
        dataSource={dataSource}
        columns={columns}
        btnProps={{ type: "primary", icon: <FileExcelOutlined /> }}
        showColumnPicker
      >
        Export to CSV
      </ExportTableButton>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export const AdvancedSearchInput = () => {
  /*
   * Use if you want to move around the Search input button.
   * import { SearchTableInput } from "ant-table-extensions";
   * It accepts all searchableProps along with a required extra state.
   */

  /* You have to create a new state which will be used to dynamically populate filtered dataSource */
  const [searchDataSource, setSearchDataSource] = React.useState<any>(
    dataSource // 🔴 required
  );

  return (
    <div>
      <p>
        <span role="img" aria-label="red circle">
          🔴
        </span>{" "}
        <b>NOTE:</b> Click 'Show Code' to see comments about usage.
      </p>
      <SearchTableInput
        columns={columns} // 🔴 Original dataSource
        dataSource={dataSource} // 🔴 Original dataSource
        setDataSource={setSearchDataSource} // 🔴 Newly created setSearchDataSource from useState hook
        inputProps={{
          placeholder: "Search this table...",
          prefix: <SearchOutlined />,
        }}
      />
      <Table
        dataSource={searchDataSource} // 🔴 filtered dataSource
        columns={columns}
      />
    </div>
  );
};

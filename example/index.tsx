import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Table as TableOld } from "ant-table-extensions";
import { Table as TableNew } from "../src/index";

import { dataSource, columns } from "./fixtures/groupedColumns";
// const _dataSource = dataSource.map(data => {
//   const { name, visited_city, phone_nr } = data;
//   return {
//     name,
//     visited_city,
//     phone_nr,
//   };
// });

// const dataSource = [
//   {
//     key: "test",
//     name: "test",
//     phoneNumber: 12345,
//     contact: {
//       name: "test_contact",
//     },
//   },
//   {
//     key: "test2",
//     name: "test2",
//     phoneNumber: null,
//     contact: {
//       name: "test2_contact",
//     },
//   },
//   // {
//   //   key: "test2",
//   //   name: "test2",
//   //   phoneNumber: {
//   //     name: "asdfasdf",
//   //   },
//   // },
//   {
//     key: "test3",
//     name: "test3",
//     phoneNumber: Number(0),
//     contact: {
//       name: "test3_contact",
//     },
//   },
// ];

// const columns = [
//   {
//     dataIndex: "name",
//   },
//   {
//     dataIndex: "phoneNumber",
//   },
//   {
//     dataIndex: ["contact", "name"],
//   },
//   {
//     dataIndex: "",
//   },
// ];

const App = () => {
  return (
    <div>
      {/* <TableOld dataSource={dataSource} columns={columns} searchable /> */}
      <TableNew dataSource={dataSource} columns={columns} searchable />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

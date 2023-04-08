import "./App.css";
import { Table as TableNew } from "ant-table-extensions";
import { dataSource, columns, Item } from "../fixtures/groupedColumns";
import { useState } from "react";
import { Radio, Table } from "antd";

function App(): JSX.Element {
  const [tableType, setTableType] = useState<"ant" | "ant-table-extensions">(
    "ant-table-extensions"
  );
  return (
    <>
      <Radio.Group value={tableType}>
        <Radio.Button
          value="ant-table-extensions"
          onClick={() => setTableType("ant-table-extensions")}
        >
          Ant Table Extensions
        </Radio.Button>
        <Radio.Button value="ant" onClick={() => setTableType("ant")}>
          Ant
        </Radio.Button>
      </Radio.Group>
      {tableType === "ant" ? (
        <Table dataSource={dataSource} columns={columns} />
      ) : (
        <TableNew<Item>
          dataSource={dataSource}
          columns={columns}
          searchable
          // searchableProps={{
          //   searchFunction(dataSource, searchTerm) {
          //     return (dataSource ?? []).filter((row) => {
          //       return Object.values(row).some((val) => {
          //         const str =
          //           typeof val === "string"
          //             ? val
          //             : typeof val === "number"
          //             ? val.toString()
          //             : "";
          //         if (typeof val === "string" || typeof val === "number") {
          //           return str.toLowerCase().includes(searchTerm.toLowerCase());
          //         }
          //         return false;
          //       });
          //     });
          //   },
          // }}
          exportable
        />
      )}
    </>
  );
}

export default App;

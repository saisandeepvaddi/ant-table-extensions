import "./App.css";
import { dataSource, columns } from "../fixtures/groupedColumns";
import { useState } from "react";
import { Radio, Table } from "antd";
import WithExportable from "./examples/WithExportable";

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
        <WithExportable />
      )}
    </>
  );
}

export default App;

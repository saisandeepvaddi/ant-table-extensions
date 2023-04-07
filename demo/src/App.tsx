import "./App.css";
import { Table as TableNew } from "ant-table-extensions";
import { dataSource, columns } from "../fixtures/groupedColumns";

function App(): JSX.Element {
  return (
    <TableNew
      dataSource={dataSource}
      columns={columns}
      searchable
      searchableProps={{
        fuzzySearch: true,
      }}
    />
  );
}

export default App;

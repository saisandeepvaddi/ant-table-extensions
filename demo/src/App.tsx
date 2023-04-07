import "./App.css";
import { Table as TableNew } from "ant-table-extensions";
import { dataSource, columns, Item } from "../fixtures/groupedColumns";

function App(): JSX.Element {
  return (
    <TableNew<Item>
      dataSource={dataSource}
      columns={columns}
      searchable
      searchableProps={{
        searchFunction(dataSource, searchTerm) {
          return (dataSource ?? []).filter((row) => {
            return Object.values(row).some((val) => {
              let str =
                typeof val === "string"
                  ? val
                  : typeof val === "number"
                  ? val.toString()
                  : "";
              if (typeof val === "string" || typeof val === "number") {
                return str.toLowerCase().includes(searchTerm.toLowerCase());
              }
              return false;
            });
          });
        },
      }}
    />
  );
}

export default App;

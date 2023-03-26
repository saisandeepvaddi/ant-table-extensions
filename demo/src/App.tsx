import "./App.css";
import { Table as TableNew } from "../../src/index";
import { dataSource, columns } from "../fixtures/groupedColumns";

function App(): JSX.Element {
  return <TableNew dataSource={dataSource} columns={columns} searchable />;
}

export default App;

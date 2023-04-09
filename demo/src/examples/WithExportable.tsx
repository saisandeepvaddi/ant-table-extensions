import { Table as TableNew } from "ant-table-extensions";
import { dataSource, columns } from "../../fixtures/groupedColumns";

function WithExportable(): JSX.Element {
  return (
    <TableNew
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
      exportableProps={{
        showColumnPicker: true,
      }}
    />
  );
}

export default WithExportable;

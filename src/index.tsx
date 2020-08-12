import React, { useState } from "react";
import { Table as AntTable } from "antd";
// import ExportTableButton from "./ExportTableButton";
import { TableProps } from "antd/lib/table";
import ExportTableButton, {
  IExportFieldButtonProps,
} from "./ExportTableButton";
import SearchTableInput, { ISearchTableInputProps } from "./SearchTableInput";

export type IExportableTableProps = TableProps<any> & IExportFieldButtonProps;

export type ITableUtils = {
  /** Exportable Table */
  exportable?: boolean;
  /** Props object to customize export button */
  exportableProps?: IExportFieldButtonProps;
  /** Searchable Table */
  searchable?: boolean;
  /** Props object to customize export button */
  searchableProps?: ISearchTableInputProps;
};

export type ITableProps<T> = TableProps<T> & ITableUtils;

export const Table: React.FC<ITableProps<any>> = ({
  exportable = false,
  exportableProps,
  searchable = false,
  searchableProps,
  dataSource,
  columns,
  ...otherProps
}) => {
  //  const {
  //    exportable,
  //    exportableProps,
  //    searchable,
  //    searchableProps,
  //    dataSource,
  //    columns,
  //    ...otherProps
  //  } = props;

  const isExportable = exportable || exportableProps;
  const isSearchable = searchable || searchableProps;

  const [searchDataSource, setSearchDataSource] = useState<any>(dataSource);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        {isExportable ? (
          <ExportTableButton
            dataSource={dataSource}
            columns={columns}
            {...exportableProps}
          />
        ) : null}
        {isSearchable ? (
          <SearchTableInput
            dataSource={dataSource}
            setDataSource={setSearchDataSource}
            {...searchableProps}
            inputProps={{
              style: {
                width: isExportable ? "60%" : "100%",
                ...searchableProps?.inputProps?.style,
              },
              ...searchableProps?.inputProps,
            }}
          />
        ) : null}
      </div>
      <AntTable
        dataSource={isSearchable ? searchDataSource : dataSource}
        columns={columns}
        {...otherProps}
      />
    </div>
  );
};

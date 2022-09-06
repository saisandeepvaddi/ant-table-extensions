import React, { useState, useEffect } from "react";
import { Table as AntTable } from "antd";
import { TableProps } from "antd/lib/table";
import ExportTableButton, {
  IExportFieldButtonProps,
} from "./ExportTableButton";
import SearchTableInput, { ISearchTableInputProps } from "./SearchTableInput";
import { useMountedState } from "./hooks/isMounted";

export * from "./ExportTableButton";
export * from "./SearchTableInput";

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

export function Table({
  exportable = false,
  exportableProps,
  searchable = false,
  searchableProps,
  dataSource,
  columns,
  ...otherProps
}: ITableProps<any>) {
  const isMounted = useMountedState();
  const isExportable = exportable || exportableProps;
  const isSearchable = searchable || searchableProps;
  const [searchDataSource, setSearchDataSource] = useState<any>(dataSource);

  useEffect(() => {
    if (isSearchable && isMounted()) {
      setSearchDataSource(dataSource);
    }
  }, [isSearchable, dataSource, isMounted]);

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
            columns={columns}
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
}

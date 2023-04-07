import React, { useState, useEffect, useMemo } from "react";
import { Table as AntTable } from "antd";
import ExportTableButton from "./ExportTableButton";
import SearchTableInput from "./SearchTableInput";

import { TableProps, DataSource } from "./types";
import { useIsMounted } from "./hooks/useIsMounted";

export function Table<T extends object = DataSource>({
  exportable = false,
  exportableProps,
  searchable = false,
  searchableProps,
  dataSource,
  columns,
  ...otherProps
}: TableProps<T>) {
  const isExportable = useMemo(
    () => exportable || !!exportableProps,
    [exportable, exportableProps]
  );

  const isSearchable = useMemo(
    () => searchable || searchableProps,
    [searchable, searchableProps]
  );
  const [searchDataSource, setSearchDataSource] = useState<
    readonly T[] | undefined
  >(dataSource);
  const isMounted = useIsMounted();

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

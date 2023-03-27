import React, { useState, useEffect } from "react";
import { Table as AntTable } from "antd";
import ExportTableButton from "./ExportTableButton";
import SearchTableInput from "./SearchTableInput";

import { TableProps } from "./types";
import { useIsMounted } from "./hooks/useIsMounted";

export const Table: React.FC<TableProps<any>> = ({
  exportable = false,
  exportableProps,
  searchable = false,
  searchableProps,
  dataSource,
  columns,
  ...otherProps
}) => {
  const isExportable = exportable || exportableProps;
  const isSearchable = searchable || searchableProps;
  const [searchDataSource, setSearchDataSource] = useState<any>(dataSource);
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
};

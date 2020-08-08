import React, { useState } from "react";
import SearchTableInput from "./SearchTableInput";
import { Table as AntTable } from "antd";

export const SearchableTable = props => {
  const { dataSource, columns, ...otherProps } = props;
  const [searchDataSource, setSearchDataSource] = useState<any>(dataSource);

  return (
    <React.Fragment>
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <SearchTableInput
          columns={columns}
          dataSource={dataSource}
          setDataSource={setSearchDataSource}
          inputProps={{ placeholder: "Search" }}
        />
      </div>
      <AntTable
        {...otherProps}
        dataSource={searchDataSource}
        columns={columns}
      />
    </React.Fragment>
  );
};

import React, { useState } from "react";
import SearchTableInput from "./SearchTableInput";
import { Table as AntTable, Row, Col } from "antd";

export const SearchableTable = (props) => {
  const { dataSource, columns, ...otherProps } = props;
  const [searchDataSource, setSearchDataSource] = useState<any>(dataSource);

  return (
    <React.Fragment>
      <Row justify="end">
        <Col xs={12} sm={12} md={8} lg={4}></Col>
      </Row>
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <SearchTableInput
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

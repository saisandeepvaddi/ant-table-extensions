import React, { useState } from "react";
import { Input } from "antd";
import { debounce as debounceFn } from "lodash-es";

const searchTable = (dataSource: any[], searchTerm = "") => {
  let _dataSource = [];
  if (!searchTerm) {
    _dataSource = [...dataSource];
  } else {
    _dataSource = dataSource.slice(1);
  }
  console.log("_dataSource:", _dataSource);
  return _dataSource;
};

const SearchTableInput = ({
  // query,
  // setQuery,
  searchFunction = null,
  columns,
  dataSource,
  setDataSource,
  debounce = true,
  inputProps,
}) => {
  const [query, setQuery] = useState<string>("");

  const searchTableDebounced = React.useCallback(
    debounceFn(
      (dataSource: any, searchTerm: string, searchFn: any) => {
        const results = searchFn?.(dataSource, searchTerm);
        setDataSource(results);
      },
      1000,
      {
        leading: false,
        trailing: true,
      }
    ),
    []
  );

  const handleInputChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setQuery(value);

    if (debounce) {
      searchTableDebounced(dataSource, value, searchFunction ?? searchTable);
    } else {
      const results =
        searchTable?.(dataSource, value) ?? searchTable(dataSource, value);
      setDataSource(results);
    }
  };

  return <Input value={query} onChange={handleInputChange} {...inputProps} />;
};

export default SearchTableInput;

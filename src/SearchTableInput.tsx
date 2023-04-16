import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "antd";
import debounceFn from "lodash/debounce";
import Fuse from "fuse.js";
import {
  CustomDataSourceType,
  DataSource,
  SearchFunction,
  SearchTableInputProps,
} from "./types";
import { ColumnGroupType, ColumnType, ColumnsType } from "antd/es/table";

const getGroupedColumnKeysFromChildren = <T,>(
  column: ColumnGroupType<T>,
  keys: Array<Fuse.FuseOptionKey<T>> = []
): Array<Fuse.FuseOptionKey<T>> => {
  let newKeys: Array<Fuse.FuseOptionKey<T>> = [];
  for (const child of column.children) {
    const childColumn = child as ColumnGroupType<T>;
    if (childColumn.children && Array.isArray(childColumn.children)) {
      // If child has children, recurse
      newKeys = getGroupedColumnKeysFromChildren(childColumn, keys);
    } else {
      const childColumn = child as ColumnType<T>;

      if (!childColumn.dataIndex) {
        continue;
      }

      if (Array.isArray(childColumn.dataIndex)) {
        newKeys = [...keys, childColumn.dataIndex.join(".")];
        continue;
      }

      newKeys = [...keys, childColumn.dataIndex as Fuse.FuseOptionKey<T>];
    }
  }

  return newKeys;
};

const createDefaultFuseKeys = <T,>(
  dataSource: CustomDataSourceType<T>,
  columns: ColumnsType<T>
): Array<Fuse.FuseOptionKey<T>> => {
  const firstRecord = dataSource?.[0];
  const keys = (columns ?? [])
    .map((column) => {
      const { children } = column as ColumnGroupType<T>;
      // check if grouped column
      if (children && Array.isArray(children)) {
        const keys = getGroupedColumnKeysFromChildren(
          column as ColumnGroupType<T>,
          []
        );
        return keys?.flat();
      }

      const { dataIndex } = column as ColumnType<T>;
      // ant table allows nested objects with array of strings as dataIndex
      if (Array.isArray(dataIndex)) {
        return dataIndex.join(".");
      }

      // If in actual dataIndex the record is object literal but column specified as string, throw error.
      // Even though it's something you shouldn't do based on ant table's API, since users will see fuse.js `value.trim is not a function error` I'm throwing error.
      if (
        firstRecord &&
        Object.prototype.toString.call(firstRecord[dataIndex as keyof T]) ===
          "[object Object]" &&
        ["string", "number"].includes(typeof dataIndex)
      ) {
        throw new Error(
          `'${dataIndex}' is an object in dataSource. But dataIndex is given as string. If it is an object, use array of strings as dataIndex.`
        );
      }
      return dataIndex;
    })
    .filter((dataIndex) => !!dataIndex)
    .flat(10)
    .filter((dataIndex) => ["string", "number"].includes(typeof dataIndex)); // after flattening max depth 10, if there are still arrays, ignore

  return keys as Array<Fuse.FuseOptionKey<T>>;
};

export function SearchTableInput<T extends object = DataSource>({
  searchFunction = undefined,
  dataSource = [],
  setDataSource,
  debounce = true,
  inputProps = {
    placeholder: "Search...",
  },
  fuzzySearch = false,
  columns = [],
  fuseProps,
}: SearchTableInputProps<T>) {
  const [query, setQuery] = useState<string>("");
  const allData = useRef<T[]>([]);
  const fuse = useRef<Fuse<T> | null>();

  const _fuseProps: Fuse.IFuseOptions<T> = React.useMemo(() => {
    return {
      keys: createDefaultFuseKeys(dataSource, columns),
      threshold: fuzzySearch ? 0.6 : 0.1,
      shouldSort: false,
      ...fuseProps,
    };
  }, [fuseProps, dataSource, columns, fuzzySearch]);

  const searchTable = useCallback(
    (
      _dataSource: CustomDataSourceType<T>,
      searchTerm = ""
    ): CustomDataSourceType<T> => {
      if (searchTerm === "" || !fuse || !fuse.current) {
        return allData.current ?? [];
      }

      const newResults = fuse.current.search(searchTerm).map((res) => res.item);
      return newResults;
    },
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTableDebounced = useCallback(
    debounceFn(
      (
        dataSource: CustomDataSourceType<T>,
        searchTerm: string,
        searchFn: SearchFunction<T>
      ) => {
        const results = searchFn?.(dataSource, searchTerm);
        setDataSource?.(results);
      },
      100,
      {
        leading: false,
        trailing: true,
      }
    ),
    []
  );

  const handleInputChange = useCallback(
    (e: { target: { value: string } }): void => {
      const value = e.target.value;
      setQuery(value);

      if (debounce) {
        searchTableDebounced(dataSource, value, searchFunction ?? searchTable);
      } else {
        const results =
          searchFunction?.(dataSource, value) ?? searchTable(dataSource, value);
        setDataSource?.(results);
      }
    },
    [
      dataSource,
      debounce,
      searchFunction,
      searchTable,
      searchTableDebounced,
      setDataSource,
    ]
  );

  useEffect(() => {
    if (!dataSource) {
      return;
    }

    allData.current = [...dataSource];
    fuse.current = new Fuse(dataSource, _fuseProps);
  }, [dataSource, _fuseProps]);

  useEffect(() => {
    // If dataSource updates dynamically (for example, swr or react-query mutates) and the input box is not empty,
    // It should keep the new dataSource filtered if there is a value in input box
    if (!dataSource || !query) {
      return;
    }

    if (debounce) {
      searchTableDebounced(dataSource, query, searchFunction ?? searchTable);
    } else {
      const results =
        searchFunction?.(dataSource, query) ?? searchTable(dataSource, query);
      setDataSource?.(results);
    }
  }, [
    query,
    dataSource,
    searchTableDebounced,
    searchFunction,
    setDataSource,
    debounce,
    searchTable,
  ]);

  return (
    <Input
      value={query}
      onChange={handleInputChange}
      placeholder="Search..."
      allowClear
      {...inputProps}
    />
  );
}

export default SearchTableInput;

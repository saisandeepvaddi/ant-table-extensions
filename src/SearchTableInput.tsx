import React, { useState, useRef, useEffect } from "react";
import { Input } from "antd";
import debounceFn from "lodash/debounce";
import Fuse from "fuse.js";
import { InputProps } from "antd/lib/input";
import { ColumnsType } from "antd/lib/table";

export interface ISearchTableInputProps {
  /** Custom function to search if you want to use your own search.
   *  Takes dataSource and searchTerm and should return filtered dataSource.
   */
  searchFunction?: (
    dataSource: readonly any[] | undefined,
    searchTerm: string
  ) => any[];

  /** Ant table's dataSource. */
  dataSource?: readonly any[] | undefined;

  /** Ant table's columns */
  columns?: ColumnsType<any>;

  /** `setState` style function which updates dataSource. */
  setDataSource?: (dataSource: any[]) => void;
  /** Debounces search  */
  debounce?: boolean;
  /** Any of Ant Input component's props as object. */
  inputProps?: InputProps;
  /** Allow fuzzy search or search for exact search term. */
  fuzzySearch?: boolean;
  /** Uses Fuse.js for search. Pass any of fuse.js options here as object. */
  fuseProps?: Fuse.IFuseOptions<any>;
}

const getGroupedColumnKeysFromChildren = (column: any, keys = []) => {
  for (const child of column.children) {
    if (child.children && Array.isArray(child.children)) {
      // If child has children, recurse
      keys = getGroupedColumnKeysFromChildren(child, keys);
    } else {
      if (!child.dataIndex) {
        continue;
      }

      if (Array.isArray(child.dataIndex)) {
        keys = [...keys, child.dataIndex.join(".")];
        continue;
      }

      keys = [...keys, child.dataIndex];
    }
  }

  return keys;
};

const createDefaultFuseKeys = (
  dataSource: readonly any[] | undefined,
  columns: any[]
) => {
  const firstRecord = dataSource?.[0];
  const keys = columns
    .map((column) => {
      const { dataIndex, children } = column;
      // check if grouped column
      if (children && Array.isArray(children)) {
        const keys = getGroupedColumnKeysFromChildren(column, []);
        return keys?.flat();
      }
      // ant table allows nested objects with array of strings as dataIndex
      if (Array.isArray(dataIndex)) {
        return dataIndex.join(".");
      }

      // If in actual dataIndex the record is object literal but column specified as string, throw error.
      // Even though it's something you shouldn't do based on ant table's API, since users will see fuse.js `value.trim is not a function error` I'm throwing error.
      if (
        firstRecord &&
        Object.prototype.toString.call(firstRecord[dataIndex]) ===
          "[object Object]" &&
        typeof dataIndex === "string"
      ) {
        throw new Error(
          `'${dataIndex}' is an object in dataSource. But dataIndex is given as string. If it is an object, use array of strings as dataIndex.`
        );
      }
      return dataIndex;
    })
    .filter((dataIndex) => !!dataIndex)
    .flat(10)
    .filter((dataIndex) => typeof dataIndex === "string"); // after flattening max depth 10, if there are still arrays, ignore

  return keys;
};

export const SearchTableInput: React.FC<ISearchTableInputProps> = ({
  searchFunction = null,
  dataSource,
  setDataSource,
  debounce = true,
  inputProps = {
    placeholder: "Search...",
  },
  fuzzySearch = false,
  columns,
  fuseProps,
}) => {
  const [query, setQuery] = useState<string>("");
  const allData = useRef<any[] | null>();
  const fuse = useRef<Fuse<any> | null>();

  const _fuseProps = React.useMemo(() => {
    return {
      keys: createDefaultFuseKeys(dataSource, columns),
      threshold: fuzzySearch ? 0.6 : 0,
      ...fuseProps,
    };
  }, [fuseProps, dataSource, columns, fuzzySearch]);

  const searchTable = (
    _dataSource: readonly any[] | undefined,
    searchTerm = ""
  ) => {
    if (searchTerm === "" || !fuse || !fuse.current) {
      return allData.current;
    }

    const newResults = fuse.current.search(searchTerm).map((res) => res.item);
    return newResults;
  };

  const searchTableDebounced = React.useCallback(
    debounceFn(
      (dataSource: any, searchTerm: string, searchFn: any) => {
        const results = searchFn?.(dataSource, searchTerm);
        setDataSource(results);
      },
      100,
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
        searchFunction?.(dataSource, value) ?? searchTable(dataSource, value);
      setDataSource(results);
    }
  };

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
      setDataSource(results);
    }
  }, [
    query,
    dataSource,
    searchTableDebounced,
    searchFunction,
    setDataSource,
    debounce,
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
};

export default SearchTableInput;

import React, { useState, useRef, useEffect } from "react";
import { Input } from "antd";
import { debounce as debounceFn } from "lodash-es";
import Fuse from "fuse.js";
import { InputProps } from "antd/lib/input";

export interface ISearchTableInputProps {
  /** Custom function to search if you want to use your own search.
   *  Takes dataSource and searchTerm and should return filtered dataSource.
   */
  searchFunction?: (dataSource: any[], searchTerm: string) => any[];

  /** Ant table's dataSource. */
  dataSource?: any[];

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

export const SearchTableInput: React.FC<ISearchTableInputProps> = ({
  searchFunction = null,
  dataSource,
  setDataSource,
  debounce = true,
  inputProps = {
    placeholder: "Search...",
  },
  fuzzySearch = false,
  fuseProps = {
    keys: dataSource?.[0] ? Object.keys(dataSource[0]) : [],
    threshold: fuzzySearch ? 0.6 : 0,
  },
}) => {
  const [query, setQuery] = useState<string>("");
  const allData = useRef<any[] | null>();
  const fuse = useRef<Fuse<any> | null>();

  useEffect(() => {
    if (!dataSource) {
      return;
    }

    allData.current = [...dataSource];
    fuse.current = new Fuse(dataSource, fuseProps);
  }, [dataSource, fuseProps]);

  const searchTable = (_dataSource: any[], searchTerm = "") => {
    if (searchTerm === "" || !fuse || !fuse.current) {
      return allData.current;
    }

    const newResults = fuse.current.search(searchTerm).map(res => res.item);
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

  return (
    <Input
      value={query}
      onChange={handleInputChange}
      placeholder="Search..."
      {...inputProps}
    />
  );
};

export default SearchTableInput;

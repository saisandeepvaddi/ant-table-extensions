import React, { useState, useRef, useEffect } from "react";
import { Input } from "antd";
import { debounce as debounceFn } from "lodash-es";
import Fuse from "fuse.js";
import { InputProps } from "antd/lib/input";

export interface ISearchTableInputProps {
  searchFunction?: (dataSource: any[], searchTerm: string) => any[];
  dataSource: any[];
  setDataSource: (dataSource: any[]) => void;
  debounce?: boolean;
  inputProps?: InputProps;
  fuzzySearch?: boolean;
  fuseProps?: Fuse.IFuseOptions<any>;
}

const SearchTableInput: React.FC<ISearchTableInputProps> = ({
  searchFunction = null,
  dataSource,
  setDataSource,
  debounce = true,
  inputProps,
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
  }, [dataSource]);

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

  return <Input value={query} onChange={handleInputChange} {...inputProps} />;
};

export default SearchTableInput;

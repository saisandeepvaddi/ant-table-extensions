import React, { Fragment, ReactChild, ReactNode, useEffect } from "react";
import { Button, Modal, Checkbox } from "antd";
import Papa from "papaparse";
import difference from "lodash/difference";
import union from "lodash/union";
import get from "lodash/get";
import set from "lodash/set";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { ButtonProps } from "antd/lib/button";

export interface ITableExportFields {
  [dataIndex: string]:
    | string
    | {
        header: string;
        formatter?: (fieldValue: any, record: any, index: number) => string;
      };
}

export interface IExportFieldButtonProps {
  /** Ant table's dataSource */
  dataSource?: readonly any[] | undefined;
  /** Ant table's columns */
  columns?: ColumnsType<any>;
  /** File name to use when exporting to csv */
  fileName?: string;
  /** Customize csv file like column header names, fields to include/exclude. More on this below. */
  fields?: ITableExportFields;
  /** Disables export button. Useful when you want to disable when dataSource is loading. */
  disabled?: boolean;
  /** Any of Ant Button component props as object. */
  btnProps?: ButtonProps;
  /** Can be used to change text in button. */
  children?: ReactChild | ReactNode;
  /** Shows a modal to pick which columns to include exported file. */
  showColumnPicker?: boolean;
}

const getFieldsFromColumns = (
  columns: ColumnsType<any>
): ITableExportFields => {
  const fields = {};
  columns?.forEach((column: ColumnType<any>) => {
    const { title, key, dataIndex } = column;
    const fieldName =
      (Array.isArray(dataIndex) ? dataIndex.join(".") : dataIndex) ?? key;
    if (fieldName) {
      set(fields, fieldName, title);
    }
  });

  return fields;
};

const cleanupDataSource = (
  dataSource: readonly any[],
  exportFieldNames: ITableExportFields,
  selectedFields: string[]
) => {
  if (!dataSource || dataSource.length === 0) {
    return { data: [], fields: [] };
  }

  const newData = [...dataSource];
  const fields = selectedFields.map((fieldName) => {
    const fieldValue = get(exportFieldNames, fieldName);
    if (typeof fieldValue === "string") {
      return fieldValue;
    }
    return fieldValue.header || "";
  });

  const data = newData.map((record, rowIndex) => {
    return selectedFields.map((fieldName) => {
      const fieldValue = get(exportFieldNames, fieldName);
      const recordValue = get(record, fieldName);
      if (typeof fieldValue === "string") {
        return recordValue;
      }
      return fieldValue?.formatter?.(recordValue, record, rowIndex) ?? null;
    });
  });

  return [fields, ...data];
};

export const ExportTableButton: React.FC<IExportFieldButtonProps> = (props) => {
  const {
    dataSource,
    fileName,
    fields,
    disabled,
    btnProps,
    columns = [],
    showColumnPicker = false,
  } = props;

  const [showModal, setShowModal] = React.useState(false);

  const fieldsOrColumns = fields ?? getFieldsFromColumns(columns);

  const [selectedFields, setSelectedFields] = React.useState(() => {
    if (fields) {
      return Object.keys(fields);
    } else if (columns) {
      return Object.keys(getFieldsFromColumns(columns));
    }

    return [];
  });

  useEffect(() => {
    if (fields) {
      setSelectedFields(Object.keys(fields));
    } else if (columns) {
      setSelectedFields(Object.keys(getFieldsFromColumns(columns)));
    }
  }, [fields, columns]);

  const handleDownloadCSV = React.useCallback(() => {
    if (!dataSource) {
      return;
    }

    let selectedFieldsInOriginalOrder = Object.keys(fieldsOrColumns).filter(
      (name) => selectedFields.indexOf(name) > -1
    );

    const data = cleanupDataSource(
      dataSource,
      fieldsOrColumns,
      selectedFieldsInOriginalOrder
    );

    const csv = Papa.unparse(data, {
      header: false,
    });
    const blob = new Blob([csv]);
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = `${fileName || "table"}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setShowModal(false);
  }, [dataSource, fieldsOrColumns, selectedFields, fileName]);

  const handleCheckboxChange = React.useCallback(
    (key: string, checked: boolean) => {
      let newSelectedFields = [...selectedFields];
      if (checked) {
        newSelectedFields = union(newSelectedFields, [key]);
      } else {
        newSelectedFields = difference(newSelectedFields, [key]);
      }

      setSelectedFields(newSelectedFields);
    },
    [selectedFields]
  );

  return (
    <Fragment>
      <Button
        onClick={() =>
          showColumnPicker ? setShowModal(true) : handleDownloadCSV()
        }
        disabled={disabled}
        {...btnProps}
      >
        {props.children ?? `Export to CSV`}
      </Button>
      {showColumnPicker ? (
        <Modal
          visible={showModal}
          onOk={() => handleDownloadCSV()}
          onCancel={() => setShowModal(false)}
          width={400}
          okButtonProps={{
            disabled: selectedFields.length < 1,
            title:
              selectedFields.length < 1
                ? "Please select at least one column."
                : undefined,
          }}
          okText={"Export"}
          title={"Select columns to export"}
        >
          <div className="d-flex flex-column align-start">
            {Object.entries(fieldsOrColumns).map(([key, value]) => {
              return (
                <Checkbox
                  key={key}
                  style={{ padding: 0, margin: 0 }}
                  defaultChecked={true}
                  checked={selectedFields.indexOf(key) > -1}
                  onChange={(e) => handleCheckboxChange(key, e.target.checked)}
                >
                  {typeof value === "string" ? value : value?.header ?? ""}
                </Checkbox>
              );
            })}
          </div>
        </Modal>
      ) : null}
    </Fragment>
  );
};

export default ExportTableButton;

import React, { Fragment, useEffect, useMemo } from "react";
import { Button, Modal, Checkbox } from "antd";
import { unparse } from "papaparse";
import get from "lodash/get";
import set from "lodash/set";
import { ColumnsType } from "antd/lib/table";
import type {
  ColumnWithDataIndex,
  CustomDataSourceType,
  ExportFieldButtonProps,
  TableExportFields,
} from "./types";

const getFieldsFromColumns = <T,>(
  columns: ColumnsType<T>
): TableExportFields => {
  const fields = {};
  (columns as ColumnWithDataIndex[])?.forEach((column: ColumnWithDataIndex) => {
    const { title, key, dataIndex } = column;
    const fieldName =
      (Array.isArray(dataIndex) ? dataIndex.join(".") : dataIndex) ?? key;
    if (fieldName) {
      set(fields, fieldName, title);
    }
  });

  return fields;
};

const cleanupDataSource = <T,>(
  dataSource: CustomDataSourceType<T>,
  exportFieldNames: TableExportFields,
  selectedFields: string[]
): any => {
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
      const recordValue: any = get(record, fieldName);
      if (typeof fieldValue === "string") {
        return recordValue;
      }
      return fieldValue?.formatter?.(recordValue, record, rowIndex);
    });
  });

  return [fields, ...data];
};

export const ExportTableButton: React.FC<ExportFieldButtonProps> = (props) => {
  const {
    dataSource = [],
    fileName,
    fields,
    disabled,
    btnProps,
    modalProps,
    columns = [],
    showColumnPicker = false,
  } = props;

  const [showModal, setShowModal] = React.useState(false);

  const fieldsOrColumns = useMemo(
    () => fields ?? getFieldsFromColumns(columns),
    [columns, fields]
  );

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

    const selectedFieldsInOriginalOrder = Object.keys(fieldsOrColumns).filter(
      (name) => selectedFields.indexOf(name) > -1
    );

    console.log("fieldsOrColumns:", fieldsOrColumns);
    const data = cleanupDataSource(
      dataSource,
      fieldsOrColumns,
      selectedFieldsInOriginalOrder
    );

    const csv = unparse(data, {
      skipEmptyLines: "greedy",
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
        newSelectedFields = Array.from(new Set([...newSelectedFields, key]));
      } else {
        newSelectedFields = newSelectedFields.filter((field) => field !== key);
      }

      setSelectedFields(newSelectedFields);
    },
    [selectedFields]
  );

  return (
    <Fragment>
      <Button
        onClick={(): void =>
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
          onOk={(): void => handleDownloadCSV()}
          onCancel={(): void => setShowModal(false)}
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
          {...modalProps}
        >
          <div className="d-flex flex-column align-start">
            {Object.entries(fieldsOrColumns).map(([key, value]) => {
              return (
                <Checkbox
                  key={key}
                  style={{ padding: 0, margin: 0 }}
                  defaultChecked={true}
                  checked={selectedFields.indexOf(key) > -1}
                  onChange={(e): void =>
                    handleCheckboxChange(key, e.target.checked)
                  }
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

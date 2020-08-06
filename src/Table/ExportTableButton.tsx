import React, { Fragment, ReactChild, ReactNode, useEffect } from "react";
import { Button, Modal, Checkbox } from "antd";
import Papa from "papaparse";
import { difference, union } from "lodash-es";
import { ColumnsType, ColumnGroupType, ColumnType } from "antd/lib/table";

export interface TableExportFields {
  [fieldName: string]:
    | string
    | {
        name: string;
        formatter?: (record: any) => string;
      };
}

export interface IExportFieldButtonProps {
  dataSource?: any[];
  columns?: ColumnsType<any>;
  defaultFileName?: string;
  fields?: TableExportFields;
  disabled?: boolean;
  btnProps?: Record<string, any>;
  children?: ReactChild | ReactNode;
  showExportColumnPicker?: boolean;
}

type ColumnWithDataIndex = (ColumnGroupType<any> | ColumnType<any>) & {
  dataIndex?: string | string[];
};

const getFieldsFromColumns = (columns: ColumnsType<any>): TableExportFields => {
  const fields = {};
  columns?.forEach((column: ColumnWithDataIndex) => {
    const { title, key, dataIndex } = column;
    const fieldName =
      (Array.isArray(dataIndex) ? dataIndex.join(".") : dataIndex) ?? key;
    if (fieldName) {
      fields[fieldName] = title;
    }
  });

  return fields;
};

const cleanupDataSource = (dataSource, exportFieldNames, selectedFields) => {
  if (!dataSource || dataSource.length === 0) {
    return { data: [], fields: [] };
  }

  const newData = [...dataSource];
  const fields = selectedFields.map(fieldName => {
    const formatter = exportFieldNames[fieldName];
    if (typeof formatter === "string") {
      return exportFieldNames[fieldName];
    }
    return exportFieldNames[fieldName].name || "";
  });

  const data = newData.map(record => {
    return selectedFields.map(fieldName => {
      const value = exportFieldNames[fieldName];
      if (typeof value === "string") {
        return record[fieldName];
      }
      return value?.formatter(record[fieldName]) || null;
    });
  });

  return [fields, ...data];
};

const ExportTableButton: React.FC<IExportFieldButtonProps> = props => {
  const {
    dataSource,
    defaultFileName,
    fields,
    disabled,
    btnProps,
    columns,
    showExportColumnPicker: showColumnPicker,
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
      name => selectedFields.indexOf(name) > -1
    );

    const data = cleanupDataSource(
      dataSource,
      fieldsOrColumns,
      selectedFieldsInOriginalOrder
    );

    const csv = Papa.unparse(data, {
      greedy: true,
      header: false,
    });
    const blob = new Blob([csv]);
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = `${defaultFileName || "table"}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setShowModal(false);
  }, [dataSource, fieldsOrColumns, selectedFields, defaultFileName]);

  const handleCheckboxChange = React.useCallback(
    (key, checked) => {
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
                : null,
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
                  onChange={e => handleCheckboxChange(key, e.target.checked)}
                >
                  {typeof value === "string" ? value : value?.name ?? ""}
                </Checkbox>
              );
            })}
          </div>
        </Modal>
      ) : null}
    </Fragment>
  );
};

// ExportTableButton.propTypes = {
//   dataSource: PropTypes.array.isRequired,
//   defaultFileName: PropTypes.string.isRequired,
//   exportFieldNames: PropTypes.object.isRequired,
//   disabled: PropTypes.bool.isRequired,
// };

ExportTableButton.defaultProps = {
  dataSource: [],
  showExportColumnPicker: false,
};

export default ExportTableButton;

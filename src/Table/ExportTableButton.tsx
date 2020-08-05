import React, { Fragment, ReactChild } from "react";
import { Button, Modal, Checkbox } from "antd";
import Papa from "papaparse";
import { difference, union } from "lodash-es";

interface ExportFields {
  [fieldName: string]:
    | string
    | {
        name: string;
        formatter?: (record: any) => string;
      };
}

export interface IExportFieldButtonProps {
  dataSource: any[];
  defaultFileName?: string;
  fields: ExportFields;
  disabled?: boolean;
  children?: ReactChild;
  btnProps?: Record<string, any>;
}

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
      return value.formatter(record[fieldName]) || null;
    });
  });

  return [fields, ...data];
};

const ExportTableButton: React.FC<IExportFieldButtonProps> = props => {
  const {
    dataSource,
    defaultFileName,
    fields: exportFieldNames,
    disabled,
    btnProps,
  } = props;
  const [showModal, setShowModal] = React.useState(false);
  const [selectedFields, setSelectedFields] = React.useState(
    Object.keys(exportFieldNames) || []
  );

  React.useEffect(() => {
    setSelectedFields(Object.keys(exportFieldNames) ?? []);
  }, [exportFieldNames]);

  const handleDownloadCSV = React.useCallback(() => {
    if (!dataSource) {
      return;
    }

    let selectedFieldsInOriginalOrder = Object.keys(exportFieldNames).filter(
      name => selectedFields.indexOf(name) > -1
    );
    const data = cleanupDataSource(
      dataSource,
      exportFieldNames,
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
  }, [dataSource, exportFieldNames, selectedFields]);

  const handleCheckboxChange = (key, checked) => {
    let newSelectedFields = [...selectedFields];
    if (checked) {
      newSelectedFields = union(newSelectedFields, [key]);
    } else {
      newSelectedFields = difference(newSelectedFields, [key]);
    }

    setSelectedFields(newSelectedFields);
  };

  return (
    <Fragment>
      <Button
        onClick={() => setShowModal(true)}
        disabled={disabled}
        {...btnProps}
      >
        {props.children ?? `Export to CSV`}
      </Button>
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
          {Object.entries(exportFieldNames).map(([key, value]) => {
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
    </Fragment>
  );
};

// ExportTableButton.propTypes = {
//   dataSource: PropTypes.array.isRequired,
//   defaultFileName: PropTypes.string.isRequired,
//   exportFieldNames: PropTypes.object.isRequired,
//   disabled: PropTypes.bool.isRequired,
// };

// ExportTableButton.defaultProps = {
//   dataSource: [],
//   defaultFileName: "fileName",
//   exportFieldNames: {},
//   disabled: false,
// };

export default React.memo(ExportTableButton);

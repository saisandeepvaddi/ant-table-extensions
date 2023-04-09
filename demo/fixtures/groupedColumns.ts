// Taken directly from ant docs

import type { ColumnsType } from "ant-table-extensions";

// To fix https://github.com/saisandeepvaddi/ant-table-extensions/issues/73
export const columns: ColumnsType<Item> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 100,
    fixed: "left",
    exporter: {
      header: "Name",
      formatter: (fieldValue: any, record: any, index: number): string => {
        return fieldValue;
      },
    },
    filters: [
      {
        text: "Joe",
        value: "Joe",
      },
      {
        text: "John",
        value: "John",
      },
    ],
    onFilter: (value: any, record: any): boolean =>
      record.name.indexOf(value) === 0,
  },
  {
    title: "Other",
    children: [
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
        width: 150,
        exporter: {
          header: "Age",
          formatter: (fieldValue: any, record: any, index: number): string => {
            return fieldValue + " years";
          },
        },
        sorter: (a: any, b: any): number => a.age - b.age,
      },
      {
        title: "Address",
        children: [
          {
            title: "Street",
            dataIndex: "street",
            key: "street",
            width: 150,
          },
          {
            title: "Block",
            children: [
              {
                title: "Building",
                dataIndex: "building",
                key: "building",
                width: 100,
              },
              {
                title: "Door No.",
                dataIndex: "number",
                key: "number",
                width: 100,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Company",
    children: [
      {
        title: "Company Address",
        dataIndex: "companyAddress",
        key: "companyAddress",
        width: 200,
      },
      {
        title: "Company Name",
        dataIndex: "companyName",
        key: "companyName",
      },
    ],
  },
];

export interface Item {
  key: number;
  name: string;
  age: number;
  street: string;
  building: string;
  number: number;
  companyAddress: string;
  companyName: string;
}

export const dataSource: Item[] = [];
for (let i = 0; i < 100; i++) {
  dataSource.push({
    key: i,
    name: "John Brown " + i,
    age: i + 1,
    street: "Lake Park " + i,
    building: "C",
    number: 2035 + (i + 10),
    companyAddress: "Lake Street " + (i + 100),
    companyName: "SoftLake Co " + i * 2,
  });
}

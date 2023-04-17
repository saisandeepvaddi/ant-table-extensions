export { default as dataSource } from "./people-small";

export const columns = [
  {
    dataIndex: "firstName",
    title: "First Name",
  },
  {
    dataIndex: "lastName",
    title: "Last Name",
  },
  {
    title: "Address",
    children: [
      {
        dataIndex: ["address", "street"],
        title: "Street",
      },
      {
        dataIndex: ["address", "city"],
        title: "City",
      },
      {
        dataIndex: ["address", "state"],
        title: "State",
      },
      {
        dataIndex: ["address", "zip"],
        title: "Zip",
      },
      {
        dataIndex: ["address", "country"],
        title: "Country",
      },
    ],
  },
];

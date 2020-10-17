import React from "react";
import { columns, dataSource } from "../fixtures/table";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { Table } from "../src";

// tests using ant not working without it.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

if (typeof window.URL.createObjectURL === "undefined") {
  Object.defineProperty(window.URL, "createObjectURL", {
    value: jest.fn(() => {}),
  });
}

test("Renders default table", async () => {
  // render(<Table dataSource={dataSource} columns={columns} />);
  render(<Table dataSource={dataSource} columns={columns} />);
  expect(screen.getByText(dataSource[0].firstName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].lastName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].country)).toBeInTheDocument();
});

test("Renders searchable table", async () => {
  render(<Table dataSource={dataSource} columns={columns} searchable />);
  expect(screen.getByText(dataSource[0].firstName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].lastName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].country)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
});

test("Renders exportable table", async () => {
  render(<Table dataSource={dataSource} columns={columns} exportable />);
  expect(screen.getByText(dataSource[0].firstName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].lastName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].country)).toBeInTheDocument();
  const btn = screen.getByRole("button", { name: /export/i });
  expect(btn).toBeInTheDocument();
});

test("Renders searchable & exportable table", async () => {
  render(
    <Table dataSource={dataSource} columns={columns} searchable exportable />
  );
  expect(screen.getByText(dataSource[0].firstName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].lastName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].country)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  const btn = screen.getByRole("button", { name: /export/i });
  expect(btn).toBeInTheDocument();
});

test("Renders export column picker on export button click", async () => {
  render(
    <Table
      dataSource={dataSource}
      columns={columns}
      searchable
      exportable
      exportableProps={{ showColumnPicker: true }}
    />
  );
  expect(screen.getByText(dataSource[0].firstName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].lastName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].country)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  const btn = screen.getByRole("button", { name: /export/i });
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);

  expect(screen.getByText(/select columns to export/i)).toBeInTheDocument();
});

test("Searches in searchable table", async () => {
  render(<Table dataSource={dataSource} columns={columns} searchable />);
  expect(screen.getByText(dataSource[0].lastName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[1].lastName)).toBeInTheDocument();
  const searchBox = screen.getByPlaceholderText(/search/i);
  expect(searchBox).toBeInTheDocument();
  userEvent.type(searchBox, dataSource[1].lastName);
  await waitFor(() =>
    expect(screen.queryByText(dataSource[0].lastName)).not.toBeInTheDocument()
  );
  expect(screen.getByText(dataSource[1].lastName)).toBeInTheDocument();
});

test("Searches in modified dataSource", async () => {
  const { rerender } = render(
    <Table dataSource={dataSource} columns={columns} searchable />
  );
  expect(screen.getByText(dataSource[0].lastName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[1].lastName)).toBeInTheDocument();
  const searchBox = screen.getByPlaceholderText(/search/i);
  expect(searchBox).toBeInTheDocument();
  userEvent.type(searchBox, dataSource[1].lastName);
  await waitFor(() =>
    expect(screen.queryByText(dataSource[0].lastName)).not.toBeInTheDocument()
  );
  expect(screen.getByText(dataSource[1].lastName)).toBeInTheDocument();

  const newDataSource = dataSource.slice(2, 5);
  rerender(<Table dataSource={newDataSource} columns={columns} searchable />);
  expect(screen.queryByText(/no data/i)).not.toBeInTheDocument();

  expect(screen.queryByText(dataSource[0].lastName)).not.toBeInTheDocument();
  expect(screen.queryByText(dataSource[1].lastName)).not.toBeInTheDocument();

  expect(screen.getByText(dataSource[2].lastName)).toBeInTheDocument();
  const newSearchBox = screen.getByPlaceholderText(/search/i);
  expect(newSearchBox).toBeInTheDocument();

  userEvent.clear(newSearchBox);
  userEvent.type(newSearchBox, newDataSource[1].lastName);

  await waitFor(() =>
    expect(
      screen.queryByText(newDataSource[0].lastName)
    ).not.toBeInTheDocument()
  );

  expect(screen.queryByText(newDataSource[1].lastName)).toBeInTheDocument();
});

test("Keeps results filtered if dataSource changed and input has previous value", async () => {
  const { rerender } = render(
    <Table dataSource={dataSource} columns={columns} searchable />
  );

  expect(screen.getByText(dataSource[0].lastName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[1].lastName)).toBeInTheDocument();
  const searchBox = screen.getByPlaceholderText(/search/i);
  expect(searchBox).toBeInTheDocument();

  userEvent.type(searchBox, dataSource[1].lastName);
  await waitFor(() =>
    expect(screen.queryByText(dataSource[0].lastName)).not.toBeInTheDocument()
  );

  expect(screen.getByText(dataSource[1].lastName)).toBeInTheDocument();

  const newDataSource = dataSource.slice(0);
  rerender(<Table dataSource={newDataSource} columns={columns} searchable />);
  expect(screen.queryByText(/no data/i)).not.toBeInTheDocument();

  await waitFor(() =>
    expect(screen.queryByText(dataSource[0].lastName)).not.toBeInTheDocument()
  );

  expect(screen.getByText(dataSource[1].lastName)).toBeInTheDocument();
});

test("Exports csv file on export btn click", async () => {
  render(<Table dataSource={dataSource} columns={columns} exportable />);
  expect(screen.getByText(dataSource[0].firstName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].lastName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].country)).toBeInTheDocument();
  const btn = screen.getByRole("button", { name: /export/i });
  expect(btn).toBeInTheDocument();
  userEvent.click(btn);

  // To avoid some window.navigation error temporarily.
  console.error = jest.fn();
  await waitFor(() => expect(window.URL.createObjectURL).toHaveBeenCalled());
});

test("Searches objects in dataSource in searchable", async () => {
  const _dataSource = [
    {
      key: -1,
      firstName: "test_fname",
      lastName: "test_lname",
      contact: {
        name: "pikachu",
      },
    },
    ...dataSource,
  ];

  const _columns = [
    ...columns,
    {
      dataIndex: ["contact", "name"],
    },
  ];

  render(<Table dataSource={_dataSource} columns={_columns} searchable />);
  expect(screen.getByText(dataSource[0].firstName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].lastName)).toBeInTheDocument();
  expect(screen.getByText(dataSource[0].country)).toBeInTheDocument();

  expect(screen.getByText(dataSource[1].lastName)).toBeInTheDocument();

  const searchBox = screen.getByPlaceholderText(/search/i);
  expect(searchBox).toBeInTheDocument();

  userEvent.type(searchBox, "pikachu");
  expect(screen.queryByText("pikachu")).toBeInTheDocument();
});

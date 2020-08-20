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
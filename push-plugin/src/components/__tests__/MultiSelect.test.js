import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MultiSelect from "../MultiSelect";

describe("MultiSelect", () => {
  const mockData = [
    { id: 1, name: "Tag 1" },
    { id: 2, name: "Tag 2" },
    { id: 3, name: "Tag 3" },
  ];

  const defaultProps = {
    data: mockData,
    selectedItems: [],
    setSelectedItems: jest.fn(),
    showValidation: false,
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<MultiSelect {...defaultProps} />);
    expect(screen.getByText("Push Tags")).toBeInTheDocument();
  });

  it("shows validation message when showValidation is true", () => {
    render(<MultiSelect {...defaultProps} showValidation={true} />);
    expect(screen.getByText("*select tags")).toBeInTheDocument();
  });

  it("filters items based on search query", () => {
    render(<MultiSelect {...defaultProps} />);
    const input = screen.getByPlaceholderText("Find Tags");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Tag 1" } });

    expect(screen.getByText("Tag 1")).toBeInTheDocument();
    expect(screen.queryByText("Tag 2")).not.toBeInTheDocument();
  });

  it("selects an item when clicked", () => {
    render(<MultiSelect {...defaultProps} />);
    const input = screen.getByPlaceholderText("Find Tags");

    fireEvent.focus(input);
    fireEvent.click(screen.getByText("Tag 1"));

    expect(defaultProps.setSelectedItems).toHaveBeenCalledWith([mockData[0]]);
  });

  it("clears selected items when clear button is clicked", () => {
    render(<MultiSelect {...defaultProps} selectedItems={[mockData[0]]} />);

    const clearButton = screen.getByTitle("Clear all");
    fireEvent.click(clearButton);

    expect(defaultProps.setSelectedItems).toHaveBeenCalledWith([]);
  });
});

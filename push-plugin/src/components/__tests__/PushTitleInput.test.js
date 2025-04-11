import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PushTitleInput from "../PushTitleInput";

describe("PushTitleInput", () => {
  const defaultProps = {
    title: "",
    setTitle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct label", () => {
    render(<PushTitleInput {...defaultProps} />);
    expect(screen.getByLabelText("Push Title")).toBeInTheDocument();
  });

  it("displays the provided title value", () => {
    render(<PushTitleInput {...defaultProps} title="Test Title" />);
    expect(screen.getByLabelText("Push Title")).toHaveValue("Test Title");
  });

  it("calls setTitle when input value changes", () => {
    render(<PushTitleInput {...defaultProps} />);
    const input = screen.getByLabelText("Push Title");

    fireEvent.change(input, { target: { value: "New Title" } });
    expect(defaultProps.setTitle).toHaveBeenCalledWith("New Title");
  });

  it("changes border color on focus and blur", () => {
    render(<PushTitleInput {...defaultProps} />);
    const input = screen.getByLabelText("Push Title");

    fireEvent.focus(input);
    expect(input.style.borderColor).toBe("#09ab00");

    fireEvent.blur(input);
    expect(input.style.borderColor).toBe("#ccc");
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PushMessageInput from "../PushMessageInput";

describe("PushMessageInput", () => {
  const defaultProps = {
    message: "",
    setMessage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct label", () => {
    render(<PushMessageInput {...defaultProps} />);
    expect(screen.getByLabelText("Push Message")).toBeInTheDocument();
  });

  it("displays the provided message value", () => {
    const testMessage = "Test Message Content";
    render(<PushMessageInput {...defaultProps} message={testMessage} />);
    expect(screen.getByLabelText("Push Message")).toHaveValue(testMessage);
  });

  it("calls setMessage when textarea value changes", () => {
    render(<PushMessageInput {...defaultProps} />);
    const textarea = screen.getByLabelText("Push Message");

    fireEvent.change(textarea, { target: { value: "New message content" } });
    expect(defaultProps.setMessage).toHaveBeenCalledWith("New message content");
  });

  it("changes border color on focus and blur", () => {
    render(<PushMessageInput {...defaultProps} />);
    const textarea = screen.getByLabelText("Push Message");

    fireEvent.focus(textarea);
    expect(textarea.style.borderColor).toBe("#09ab00");

    fireEvent.blur(textarea);
    expect(textarea.style.borderColor).toBe("#ccc");
  });

  it("has correct default styles", () => {
    render(<PushMessageInput {...defaultProps} />);
    const textarea = screen.getByLabelText("Push Message");

    expect(textarea).toHaveStyle({
      width: "100%",
      height: "60px",
      borderRadius: "5px",
      resize: "none",
      fontSize: "14px",
      lineHeight: "1.5",
      fontWeight: "200",
    });
  });
});

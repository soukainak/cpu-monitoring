import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
jest.mock("axios", () => ({
  create: jest.fn(),
  get: jest.fn(),
}));
describe("App component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders component with initial state", () => {
    const { container, getByText } = render(<App />);

    expect(container).toBeDefined();
    expect(
      getByText("the average CPU load change over last 10 minutes")
    ).toBeInTheDocument();
    expect(
      getByText("Number of CPU cores on my computer : 0")
    ).toBeInTheDocument();
    expect(getByText("Current average CPU load : 0")).toBeInTheDocument();
  });
});

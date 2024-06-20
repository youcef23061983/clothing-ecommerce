import { render, screen } from "@testing-library/react";
import { beforeEach, expect } from "vitest";
import Story from "../info & contact/Story";

describe("group of testing Story component", () => {
  beforeEach(async () => {
    render(<Story />);
  });
  it("should render the right elements", () => {
    const header = screen.getByRole("heading", { name: "Our Story" });
    const p = screen.getByText(
      /on the evolution and growth of the male clothing ecommerce website:/i
    );
    expect(header).toBeInTheDocument();
    expect(p).toBeInTheDocument();
  });
});

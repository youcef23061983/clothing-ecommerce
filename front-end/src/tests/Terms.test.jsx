import { render, screen } from "@testing-library/react";
import { beforeEach, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Terms from "../info & contact/Terms";

describe("group of tetsing Terms component", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Terms />
      </QueryClientProvider>
    );
  });
  it("should render the proper elemnets", () => {
    const header = screen.getByRole("heading", { name: "Terms & Conditions" });
    expect(header).toBeInTheDocument();
    const policyP = screen.getByText(
      /These terms shall be governed and construed in/i
    );
    expect(policyP).toBeInTheDocument();
    const smallheader = screen.getByRole("heading", {
      name: "Contact Us :",
    });
    expect(smallheader).toBeInTheDocument();
  });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, expect } from "vitest";
import Cookies from "../info & contact/Cookies";
import { BrowserRouter } from "react-router-dom";

describe("group of testing  Cookies component", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Cookies />
        </BrowserRouter>
      </QueryClientProvider>
    );
  });
  it("should render the proper elements", () => {
    const header = screen.getByRole("heading", {
      name: "Cookies Policy for Desire",
    });
    expect(header).toBeInTheDocument();
    const policyP = screen.getByText(
      /Cookies are small pieces of text sent by your web browser by a website/i
    );
    expect(policyP).toBeInTheDocument();
    const smallheader = screen.getByRole("heading", {
      name: "What Are Your Choices Regarding Cookies",
    });
    expect(smallheader).toBeInTheDocument();
  });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, expect } from "vitest";
import Policy from "../info & contact/Policy";

describe("group of testing policy component ", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Policy />
      </QueryClientProvider>
    );
  });
  it("should render theproper elments", () => {
    const policyHeader = screen.getByRole("heading", {
      name: "Privacy Policy",
    });
    expect(policyHeader).toBeInTheDocument();
    const smallHeader = screen.getByRole("heading", {
      name: "Information Collection and Use:",
    });
    expect(smallHeader).toBeInTheDocument();
    const policyP = screen.getByText(
      /We collect several different types of information for various purposes/i
    );
    expect(policyP).toBeInTheDocument();
  });
});

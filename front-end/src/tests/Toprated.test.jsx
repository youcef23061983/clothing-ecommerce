import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect } from "vitest";
import Toprated from "../pages/Toprated";
import Cart from "../pages/Cart";
import Detail from "../pages/Detail";
import userEvent from "@testing-library/user-event";

describe("group of testing Toprated component", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/rating"]}>
          <Routes>
            <Route path="/rating" element={<Toprated />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/:id" element={<Detail />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText("...is loading")).toBeNull();
    });
  });
  it("should render the right elements ", async () => {
    const header = screen.getByRole("heading", { name: "Your Top Rated" });
    expect(header).toBeInTheDocument();

    const price = screen.getByRole("heading", { name: "69.99 $" });
    expect(price).toBeInTheDocument();
    const addLink = screen.getAllByRole("link", { name: "add to cart" })[0];
    expect(addLink).toBeInTheDocument();
  });
  it("should render to the detail page", async () => {
    const slugLink = screen.getByRole("link", {
      name: "2023 Woolen Coat High Quality Men's wool coat...",
    });
    expect(slugLink).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(slugLink);
    await waitFor(() => {
      expect(screen.queryByText("...is loading")).toBeNull();
    });

    const detailHeader = screen.getByRole("heading", {
      name: "Product Detail",
    });
    const priceHeader = screen.getByRole("heading", { name: "79.99 $" });
    const productName = screen.getByText(
      /Latest 2023 Custom Latest Design Spring/i
    );
    expect(detailHeader).toBeInTheDocument();
    expect(priceHeader).toBeInTheDocument();
    expect(productName).toBeInTheDocument();
  });
  it("should the right elements to Cart componenet", async () => {
    const productLink = screen.getAllByRole("link", {
      name: "add to cart",
    })[0];
    expect(productLink).toBeInTheDocument();

    const user3 = userEvent.setup();
    await user3.click(productLink);

    await waitFor(() => {
      expect(screen.queryByText("...is loading")).toBeNull();
    });

    const cartTitle = await screen.findByText("your bag");
    expect(cartTitle).toBeInTheDocument();
    screen.debug();
  });
});

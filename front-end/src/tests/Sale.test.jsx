import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect } from "vitest";
import Cart from "../pages/Cart";
import Detail from "../pages/Detail";
import Sale from "../pages/Sale";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";

describe("group of testinf Sale component ", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <MemoryRouter initialEntries={["/sale"]}>
            <Routes>
              <Route path="/sale" element={<Sale />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/:id" element={<Detail />} />
            </Routes>
          </MemoryRouter>
        </HelmetProvider>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText("...is loading")).toBeNull();
    });
  });
  it("should render the right elements", async () => {
    const header = screen.getByRole("heading", { name: "Your Sale" });
    expect(header).toBeInTheDocument();

    const price = screen.getByRole("heading", { name: "39.99 $" });
    expect(price).toBeInTheDocument();
    const addLink = screen.getAllByRole("link", { name: "add to cart" })[0];
    expect(addLink).toBeInTheDocument();
  });
  it("should render to the detail page", async () => {
    const slugLink = screen.getByRole("link", {
      name: "Latest 2023 jeans...",
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
    const priceHeader = screen.getByRole("heading", {
      name: "new price: 39.99 $",
    });
    const productName = screen.getByText(
      /Long Lasting Quality Popular Brown In Color/i
    );
    expect(detailHeader).toBeInTheDocument();
    expect(priceHeader).toBeInTheDocument();
    expect(productName).toBeInTheDocument();
    screen.debug();
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

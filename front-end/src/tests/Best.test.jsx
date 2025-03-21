import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect, vi } from "vitest";
import Cart from "../pages/Cart";
import Detail from "../pages/Detail";
import Best from "../pages/Best";

import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import AppProvider from "../data managment/AppProvider";
describe("group of testing Best component", () => {
  const queryClient = new QueryClient({
    // defaultOptions: {
    //   queries: { retry: false },
    // },
  });
  beforeEach(async () => {
    // vi.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <MemoryRouter initialEntries={["/best"]}>
            <AppProvider>
              <Routes>
                <Route path="/best" element={<Best />} />
                <Route path="/:id" element={<Detail />} />

                <Route path="/cart" element={<Cart />} />
              </Routes>
            </AppProvider>
          </MemoryRouter>
        </HelmetProvider>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText("...is loading")).toBeNull();
    });
  });
  it("should render the right elements", async () => {
    const header = screen.getByRole("heading", { name: "Your Best Sellers" });
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
    const user = userEvent.setup();
    await user.click(slugLink);
    await waitFor(() => {
      expect(screen.queryByText("...is loading")).toBeNull();
    });
    // await waitForElementToBeRemoved(() => screen.queryByText("...is loading"), {
    //   timeout: 3000,
    // });
    const detailHeader = screen.getByRole("heading", {
      name: "Product Detail",
    });
    expect(detailHeader).toBeInTheDocument();
    const priceHeader = screen.getByRole("heading", { name: "69.99 $" });
    const productName = screen.getByText(
      /2023 Woolen Coat High Quality Men's wool coat/i
    );
    expect(priceHeader).toBeInTheDocument();
    expect(productName).toBeInTheDocument();
  });
  it("should the right elements to Cart component", async () => {
    const productLink = screen.getAllByRole("link", {
      name: "add to cart",
    })[0];
    expect(productLink).toBeInTheDocument();
    const user3 = userEvent.setup();
    await user3.click(productLink);
    const cartTitle = await screen.findByText("your bag");
    expect(cartTitle).toBeInTheDocument();
    const amountHeader = screen.getByRole("heading", { name: "amount: 1" });
    const priceHeader = screen.getByRole("heading", {
      name: "SUBTOTAL: 69.99 $",
    });
    const productName = screen.getByText("2023 Woole...");
    const proceedHeader = screen.getByRole("link", {
      name: "proceed to checkout",
    });
    expect(amountHeader).toBeInTheDocument();
    expect(priceHeader).toBeInTheDocument();
    expect(productName).toBeInTheDocument();
    expect(proceedHeader).toBeInTheDocument();
  });
});

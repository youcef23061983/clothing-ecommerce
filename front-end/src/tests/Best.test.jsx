import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect } from "vitest";
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
  const queryClient = new QueryClient();
  beforeEach(async () => {
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
    console.log("Before click:", window.location.pathname);
  });
  it("should render to the detail page", async () => {
    const slugLink = screen.getByRole("link", {
      name: "2023 Woolen Coat High Quality Men's wool coat...",
    });
    expect(slugLink).toBeInTheDocument();
    console.log("Before click:", window.location.pathname);

    const user = userEvent.setup();
    await user.click(slugLink);
    console.log("after click:", window.location.pathname);

    // await waitFor(
    //   () => {
    //     expect(screen.queryByText("...is loading")).toBeNull();
    //   },
    //   { timeout: 5000 }
    // );
    await waitForElementToBeRemoved(() => screen.queryByText("...is loading"));
    screen.debug();

    // const detailHeader = screen.getByRole("heading", {
    //   name: "Product Detail",
    // });
    // const priceHeader = screen.getByRole("heading", { name: "79.99 $" });
    // const productName = screen.getByText(
    //   /Latest 2023 Custom Latest Design Spring/i
    // );
    // expect(detailHeader).toBeInTheDocument();
    // expect(priceHeader).toBeInTheDocument();
    // expect(productName).toBeInTheDocument();
  });
  // it("should the right elements to Cart componenet", async () => {
  //   const productLink = screen.getAllByRole("link", {
  //     name: "add to cart",
  //   })[0];
  //   expect(productLink).toBeInTheDocument();

  //   const user3 = userEvent.setup();
  //   await user3.click(productLink);

  //   await waitFor(() => {
  //     expect(screen.queryByText("...is loading")).toBeNull();
  //   });

  //   const cartTitle = await screen.findByText("your bag");
  //   expect(cartTitle).toBeInTheDocument();
  //   // screen.debug();
  // });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect } from "vitest";
import AppProvider from "../data managment/AppProvider";
import Homepage from "../front page/Homepage";
import Cart from "../pages/Cart";
import Shipping from "../cart & payment/Shipping";
import Detail from "../pages/Detail";
import userEvent from "@testing-library/user-event";
import { mockData } from "./SetupTest";
import { HelmetProvider } from "react-helmet-async";

describe("group of Homepage component", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter>
            <AppProvider>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/:id" element={<Detail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/shipping" element={<Shipping />} />
              </Routes>
            </AppProvider>
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText("...is loading")).toBeNull();
    });
  });

  it("should render the right elements", async () => {
    const type = screen.getByRole("combobox", { name: "Products Type" });
    expect(type).toBeInTheDocument();

    const user1 = userEvent.setup();
    await user1.selectOptions(type, "tshirt");
    expect(type.value).toBe("tshirt");
    const productSlug = screen.getByRole("link", { name: "2023 tshirt2..." });
    expect(productSlug).toBeInTheDocument();
    const productPrice = screen.getByRole("heading", { name: "9.99 $" });
    expect(productPrice).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "19.99 $" }));
  });
  it("should render the right bestSeller", async () => {
    screen.debug();

    const productName = screen.getByRole("link", {
      name: "2023 Woolen Coat High Quality Men's wool coat...",
    });
    const productPrice = screen.getByRole("heading", { name: "49.99 $" });

    const bestTag = screen.getAllByText(/best seller/i)[0];
    const bestProducts = screen.getByRole("checkbox", { name: /bestSeller/i });
    const user5 = userEvent.setup();
    await user5.click(bestProducts);
    expect(bestProducts).toBeEnabled();
    expect(bestProducts).toBeChecked();
    expect(productName).toBeInTheDocument();
    expect(productPrice).toBeInTheDocument();
    expect(bestTag).toBeInTheDocument();
  });

  it("should to the right detail product component ", async () => {
    const priceSlider = screen.getByRole("slider");
    const minPrice = "30";
    fireEvent.change(priceSlider, { target: { value: minPrice } });
    const productName = screen.getByRole("link", {
      name: "2023 Woolen Coat High Quality Men's wool coat...",
    });
    expect(productName).toBeInTheDocument();
    const productPrice = screen.getByText("59.99 $");
    expect(productPrice).toBeInTheDocument();
  });

  it("should render the Detail component when a product is clicked", async () => {
    const productLink = screen.getByRole("link", {
      name: "2023 Woolen Coat High Quality Men's wool coat...",
    });
    expect(productLink).toBeInTheDocument();
    const user2 = userEvent.setup();
    await user2.click(productLink);

    await waitFor(() => {
      expect(screen.queryByText("...is loading")).toBeNull();
    });

    const detailHeader = await screen.findByTestId("detailId");
    expect(detailHeader).toHaveTextContent("Product Detail");
    expect(
      screen.getByText(
        "Latest 2023 Custom Latest Design Spring Winter Wool Men Overcoat Casual Slim Fit Long Woolen Coat High Quality Men's wool coat"
      )
    ).toBeInTheDocument();
    // screen.debug();
    expect(screen.getByText("jacket")).toBeInTheDocument();
    const productPrice = screen.getByRole("heading", { name: "79.99 $" });
    expect(productPrice).toBeInTheDocument();
  });
  // it("should render the Cart component when an add to cart button is clicked", async () => {
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

  //   const itemPrices = screen.getAllByRole("heading", { name: "69.99 $" })[0];
  //   expect(itemPrices).toBeInTheDocument();
  //   const amount = screen.getByRole("heading", { name: "amount: 1" });
  //   expect(amount).toBeInTheDocument();
  //   const tax = screen.getByRole("heading", { name: "TAX: 7 $" });
  //   expect(tax).toBeInTheDocument();
  //   const total = screen.getByRole("heading", { name: "TOTAL: 76.99 $" });
  //   expect(total).toBeInTheDocument();
  //   const proceed = screen.getByRole("link", { name: "proceed to checkout" });
  //   expect(proceed).toBeInTheDocument();
  //   const user4 = userEvent.setup();
  //   await user4.click(proceed);
  //   await waitFor(() => {
  //     expect(screen.queryByText("...is loading")).toBeNull();
  //   });
  //   const shippingHeader = screen.getByRole("heading", {
  //     name: "Shipping Address",
  //   });
  //   expect(shippingHeader).toBeInTheDocument();
  //   // screen.debug(shippingHeader);
  // });
});

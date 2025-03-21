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
import { HelmetProvider } from "react-helmet-async";
import Payment from "../cart & payment/Payment";

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
                <Route path="/payment" element={<Payment />} />
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
    expect(
      screen.getByRole("heading", { name: "19.99 $" })
    ).toBeInTheDocument();
  });
  it("should render the right bestSeller product", async () => {
    const productName = screen.getByRole("link", {
      name: "2023 tshirt...",
    });
    expect(productName).toBeInTheDocument();

    const productPrice = screen.getByRole("heading", { name: "9.99 $" });
    expect(productPrice).toBeInTheDocument();

    const bestTag = screen.getAllByText(/best seller/i)[0];
    const bestProducts = screen.getByRole("checkbox", { name: /bestSeller/i });
    const user2 = userEvent.setup();
    await user2.click(bestProducts);
    expect(bestProducts).toBeEnabled();
    expect(bestProducts).toBeChecked();
    expect(bestTag).toBeInTheDocument();
    const productSlug = screen.getByRole("link", { name: "2023 tshirt2..." });
    expect(productSlug).toBeInTheDocument();
  });

  it("should to the right product which has min price  ", () => {
    const priceSlider = screen.getByRole("slider");
    const minPrice = "15";

    fireEvent.change(priceSlider, { target: { value: minPrice } });
    const productSlug = screen.getByRole("link", { name: "2023 tshirt2..." });
    expect(productSlug).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "19.99 $" })
    ).toBeInTheDocument();
  });

  it("should render the Detail component when a product is clicked", async () => {
    const productSlug = screen.getByRole("link", { name: "2023 tshirt2..." });
    expect(productSlug).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "19.99 $" })
    ).toBeInTheDocument();
    const user3 = userEvent.setup();
    await user3.click(productSlug);

    await waitFor(() => {
      expect(screen.queryByText("...is loading")).toBeNull();
    });

    const detailHeader = await screen.findByTestId("detailId");
    expect(detailHeader).toHaveTextContent("Product Detail");
    expect(
      screen.getByText("2023 Woolen Coat High Quality Men's wool coat")
    ).toBeInTheDocument();
    expect(screen.getByText("jacket")).toBeInTheDocument();
    const productPrice = screen.getByRole("heading", { name: "69.99 $" });
    expect(productPrice).toBeInTheDocument();
  });
  it("should render the Cart component when an add to cart button is clicked", async () => {
    screen.debug();

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

    const itemPrices = screen.getAllByRole("heading", { name: "69.99 $" })[0];
    expect(itemPrices).toBeInTheDocument();
    const amount = screen.getByRole("heading", { name: "amount: 1" });
    expect(amount).toBeInTheDocument();
    const tax = screen.getByRole("heading", { name: "TAX: 7 $" });
    expect(tax).toBeInTheDocument();
    const total = screen.getByRole("heading", { name: "TOTAL: 76.99 $" });
    expect(total).toBeInTheDocument();
    const proceed = screen.getByRole("link", { name: "proceed to checkout" });
    expect(proceed).toBeInTheDocument();
    const user4 = userEvent.setup();
    await user4.click(proceed);

    const shippingHeader = screen.getByRole("heading", {
      name: "Shipping Address",
    });
    expect(shippingHeader).toBeInTheDocument();
    const nameInput = screen.getByLabelText("Full Name:");
    expect(nameInput).toBeInTheDocument();
    const adressInput = screen.getByLabelText("Address:");
    expect(adressInput).toBeInTheDocument();
    const cityInput = screen.getByLabelText("City:");
    expect(cityInput).toBeInTheDocument();
    const postInput = screen.getByLabelText("Postal Code:");
    expect(postInput).toBeInTheDocument();
    const countryInput = screen.getByLabelText("Country:");
    expect(countryInput).toBeInTheDocument();

    const fullName = "you";
    const address = "11 street";
    const city = "algiers";
    const postalCode = "1600";
    const country = "algeria";
    const continueBtn = screen.getByRole("button", { name: "Continue" });
    expect(continueBtn).toBeInTheDocument();
    const user5 = userEvent.setup();
    await user5.type(nameInput, fullName);
    await user5.type(adressInput, address);
    await user5.type(cityInput, city);
    await user5.type(postInput, postalCode);
    await user5.type(countryInput, country);
    await user5.click(continueBtn);

    const paymentHeader = screen.getByRole("heading", {
      name: "Payment Method",
    });
    expect(paymentHeader).toBeInTheDocument();

    const paypalRadioButton = screen.getByLabelText("Paypal:");
    const stripeRadioButton = screen.getByLabelText("Stripe:");
    expect(paypalRadioButton).toBeInTheDocument();
    expect(stripeRadioButton).toBeInTheDocument();

    // screen.debug();
  });
});

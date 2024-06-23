import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect } from "vitest";
import { AppContext } from "./SetupTest";
import Shipping from "../cart & payment/Shipping";
import Payment from "../cart & payment/Payment";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("group of testing Shipping component", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/shipping"]}>
          <AppContext.Provider>
            <Routes>
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/payment" element={<Payment />} />
            </Routes>
          </AppContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  });
  it("should render the right elements", async () => {
    const header = screen.getByRole("heading", { name: "Shipping Address" });
    expect(header).toBeInTheDocument();
    const fullName = screen.getByLabelText("Full Name:");
    expect(fullName).toBeInTheDocument();
    const Address = screen.getByLabelText("Address:");
    expect(Address).toBeInTheDocument();
    const City = screen.getByLabelText("City:");
    expect(City).toBeInTheDocument();
    const PostalCode = screen.getByLabelText("Postal Code:");
    expect(PostalCode).toBeInTheDocument();
    const Country = screen.getByLabelText("Country:");
    expect(Country).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Continue" });
    expect(btn).toBeInTheDocument();
    const name = "you";
    const adress = "25 you , algiers";
    const city = "algiers";
    const code = "11";
    const country = "algeria";
    const user = userEvent.setup();
    await user.type(fullName, name);
    await user.type(Address, adress);
    await user.type(City, city);
    await user.type(PostalCode, code);
    await user.type(Country, country);
    await user.click(btn);
    // submit.mockReturnValueOnce({ name, email, password });
    console.log(name, adress, city, code, country);

    const paymentHeader = screen.getByRole("heading", {
      name: "Payment Method",
    });
    expect(paymentHeader).toBeInTheDocument();
    // screen.debug(paymentHeader);
  });
});

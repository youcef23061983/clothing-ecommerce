import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Order from "../cart & payment/Order";
import { beforeEach, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Payment from "../cart & payment/Payment";
import userEvent from "@testing-library/user-event";
import { AppContext } from "./SetupTest";
import CheckoutForm from "../cart & payment/CheckoutForm";
// import Checkout from "../cart & payment/Checkout";
import { useState } from "react";

// Create a mock Checkout component
const MockCheckout = ({ onSuccess }) => {
  useEffect(() => {
    onSuccess(); // Simulate successful payment
  }, [onSuccess]);
  return <div>Mock Checkout Component</div>;
};

describe("group of testing Payment component", () => {
  const queryClient = new QueryClient();
  const mockCartContext = {
    cartPayment: vi.fn(),
  };

  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/payment"]}>
          <AppContext.Provider value={mockCartContext}>
            <Routes>
              <Route path="/payment" element={<Payment />} />
              <Route path="/order" element={<Order />} />
            </Routes>
          </AppContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText("LOADING...")).toBe(null);
    });
  });

  it("should render the right elements", async () => {
    const paymentHeader = screen.getByRole("heading", {
      name: "Payment Method",
    });
    expect(paymentHeader).toBeInTheDocument();

    const paypalRadioButton = screen.getByLabelText("Paypal:");
    const stripeRadioButton = screen.getByLabelText("Stripe:");

    const user = userEvent.setup();
    await user.click(paypalRadioButton);

    const btn = screen.getByRole("button", { name: "Continue" });
    expect(btn).toBeInTheDocument();

    await user.click(btn);

    const header = screen.getByRole("heading", {
      name: "Your Payment Has Been Succeeded",
    });
    expect(header).toBeInTheDocument();

    screen.debug();
  });
});

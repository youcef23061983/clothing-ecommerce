import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Order from "../cart & payment/Order";
import { beforeEach, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Payment from "../cart & payment/Payment";
import userEvent from "@testing-library/user-event";
import AppProvider from "../data managment/AppProvider";

// Mock the Checkout component
vi.mock("../cart & payment/Checkout", () => ({
  default: ({ onSuccess }) => {
    // Simulate a successful payment
    setTimeout(() => onSuccess(), 100); // Simulate async behavior
    return <div>Mock Checkout Component</div>;
  },
}));

describe("group of testing Payment component", () => {
  const queryClient = new QueryClient();

  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/payment"]}>
          <AppProvider>
            <Routes>
              <Route path="/payment" element={<Payment />} />
              <Route path="/order" element={<Order />} />
            </Routes>
          </AppProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText("LOADING...")).toBe(null);
    });
  });

  it("should render the right elements", async () => {
    // Verify the payment header
    const paymentHeader = screen.getByRole("heading", {
      name: "Payment Method",
    });
    expect(paymentHeader).toBeInTheDocument();

    // Verify radio buttons
    const paypalRadioButton = screen.getByLabelText("Paypal:");
    const stripeRadioButton = screen.getByLabelText("Stripe:");
    expect(paypalRadioButton).toBeInTheDocument();
    expect(stripeRadioButton).toBeInTheDocument();

    // Simulate user selecting PayPal
    const user = userEvent.setup();
    await user.click(paypalRadioButton);

    // Wait for the mock Checkout component to render
    await waitFor(() => {
      expect(screen.getByText("Mock Checkout Component")).toBeInTheDocument();
    });

    // Wait for the "Continue" button to appear (simulating payment success)
    const btn = await screen.findByRole("button", { name: "Continue" });
    // const btn = screen.getByRole("button", { name: "Continue" });

    expect(btn).toBeInTheDocument();

    // Simulate clicking the "Continue" button
    await user.click(btn);

    // Verify navigation to the Order page
    await waitFor(() => {
      const orderheader = screen.getByRole("heading", {
        name: "Your order",
      });
      expect(orderheader).toBeInTheDocument();
    });

    // Verify the success message and order details
    const Succeedheader = screen.getByRole("heading", {
      name: "Your Payment Has Been Succeeded",
    });
    const amountHeader = screen.getByRole("heading", { name: "amount: 1" });
    const priceHeader = screen.getByRole("heading", {
      name: "SUBTOTAL: 69.99 $",
    });
    expect(Succeedheader).toBeInTheDocument();
    expect(amountHeader).toBeInTheDocument();
    expect(priceHeader).toBeInTheDocument();

    screen.debug();
  });
});

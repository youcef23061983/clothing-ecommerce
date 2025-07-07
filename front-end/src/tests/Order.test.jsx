import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect } from "vitest";
import { AppContext } from "./SetupTest";
import Order from "../cart & payment/Order";
import userEvent from "@testing-library/user-event";
import Homepage from "../front page/Homepage";
import Shipping from "../cart & payment/Shipping";
import { HelmetProvider } from "react-helmet-async";

describe("group of testing Order component", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <MemoryRouter initialEntries={["/order"]}>
            <AppContext.Provider>
              <Routes>
                <Route path="/order" element={<Order />} />
                <Route path="/" element={<Homepage />} />
                <Route path="/shipping" element={<Shipping />} />
              </Routes>
            </AppContext.Provider>
          </MemoryRouter>
        </HelmetProvider>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText("LOADING...")).toBe(null);
    });
  });
  it("should render the right elements", async () => {
    const header = screen.getByRole("heading", {
      name: "Your Payment Has Been Succeeded",
    });
    expect(header).toBeInTheDocument();
    const tothehomepage = screen.getByRole("link", { name: "Place Order" });
    expect(tothehomepage).toBeInTheDocument();
    const paypalTag = screen.getByText(/paypal/i);
    expect(paypalTag).toBeInTheDocument();
    const name = screen.getByText(/youcef/i);
    expect(name).toBeInTheDocument();
    const adress = screen.getByText(/11 street/i);
    expect(adress).toBeInTheDocument();
    await userEvent.click(tothehomepage);
    expect(screen.getByText(/Products Type/i)).toBeInTheDocument();
  });
});

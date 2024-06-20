import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect } from "vitest";
import Login from "../info & contact/Login";
import Cart from "../pages/Cart";
import userEvent from "@testing-library/user-event";

describe("group of testing Login component", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  });
  it("should render the right elemnets", async () => {
    const loginHeader = screen.getByRole("heading", {
      name: "Sign in to your account",
    });
    expect(loginHeader).toBeInTheDocument();
    const nameInput = screen.getByPlaceholderText("Name");
    expect(nameInput).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText("Email address");
    expect(emailInput).toBeInTheDocument();
    const passwordInput = screen.getByPlaceholderText("Password");

    expect(passwordInput).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Sign in" });
    expect(btn).toBeInTheDocument();
    const name = "youcef";
    const email = "youcef@g.com";
    const password = "youcef";
    const user = userEvent.setup();

    await user.type(nameInput, name);
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    await user.click(btn);
    console.log(name, password, email);
    await waitFor(() => {
      expect(screen.queryByText("...is loading")).toBeNull();
    });
    const cartHeader = screen.getByRole("heading", { name: "your bag" });
    expect(cartHeader).toBeInTheDocument();
    screen.debug(cartHeader);

    screen.debug();
  });
});

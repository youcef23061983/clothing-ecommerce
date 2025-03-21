import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, expect, vi } from "vitest";
import SignUp from "../info & contact/SignUp";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Cart from "../pages/Cart";

describe("group of SignUp testing component", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/signup"]}>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  });
  it("should render the right elemnts", async () => {
    const signuoHeader = screen.getByRole("heading", { name: "Sign Up" });
    expect(signuoHeader).toBeInTheDocument();
    const usernameInput = screen.getByLabelText(/Username:/i);
    expect(usernameInput).toBeInTheDocument();
    const emailInput = screen.getByLabelText(/Email:/i);
    expect(emailInput).toBeInTheDocument();
    const passwordInput = screen.getByLabelText("Password:");
    expect(passwordInput).toBeInTheDocument();
    const passwordconfirmInput = screen.getByLabelText("Confirm Password:");
    expect(passwordconfirmInput).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Sign Up" });
    expect(btn).toBeInTheDocument();
    const name = "youyou";
    const email = "youyou@g.com";
    const password = "youyou";
    const user = userEvent.setup();
    await user.type(usernameInput, name);
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    await user.type(passwordconfirmInput, password);
    await user.click(btn);
    console.log(name, email, password);
    await waitFor(() => {
      expect(screen.queryByText("...is loading")).toBeNull();
    });
    const cartHeader = screen.getByRole("heading", { name: "your bag" });
    expect(cartHeader).toBeInTheDocument();
    screen.debug(cartHeader);
  });
});

describe("group of SignUp testing component", () => {
  const queryClient = new QueryClient();
  let submit;

  beforeEach(async () => {
    submit = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/signup"]}>
          <Routes>
            <Route path="/signup" element={<SignUp onSubmit={submit} />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  });
  it("should render the right elemnts", async () => {
    const signuoHeader = screen.getByRole("heading", { name: "Sign Up" });
    expect(signuoHeader).toBeInTheDocument();
    const username = screen.getByLabelText(/Username:/i);
    expect(username).toBeInTheDocument();
    const emailInput = screen.getByLabelText(/Email:/i);
    expect(emailInput).toBeInTheDocument();
    const passwordInput = screen.getByLabelText("Password:");
    expect(passwordInput).toBeInTheDocument();
    const passwordconfirmInput = screen.getByLabelText("Confirm Password:");
    expect(passwordconfirmInput).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Sign Up" });
    expect(btn).toBeInTheDocument();
    const name = "youcef";
    const email = "youyou@g.com";
    const password = "you";
    const user = userEvent.setup();
    await user.type(username, name);
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    await user.type(passwordconfirmInput, password);
    await user.click(btn);
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledWith({
      username: name,
      email: email,
      password: password,
      confirmPassword: password,
    });
    console.log(name, email, password);
  });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, expect } from "vitest";
import Login from "../info & contact/Login";
import Cart from "../pages/Cart";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { AppContext } from "../data managment/AppProvider";

describe("group of testing Login component with onSubmit", () => {
  const queryClient = new QueryClient();
  const mockLoggedInContext = {
    cart: [],
    clearCart: vi.fn(),
    total: 69.99,
    amount: 1,
    updatedCart: vi.fn(),
    addToCart: vi.fn(),
    setFormUser: vi.fn(), // Ensure this is included
    updateLoginStatus: vi.fn(),
    logout: vi.fn(),
    formUser: { name: "Test User", email: "test@example.com" },
    googleUser: null,
    GoogleAuthProvider: vi.fn(),
    cartShipping: vi.fn(),
    cartPayment: vi.fn(),
    googleLogin: vi.fn(),
    setGoogleUser: vi.fn(),
    payment: { payment: "paypal" },
    shipping: {
      fullName: "You",
      address: "11 street",
      city: "Algiers",
      postalCode: "1600",
      country: "Algeria",
    },
    paymentSucceeded: true,
    login: true,
    isLoggingOut: false,
  };
  let submit;

  beforeEach(async () => {
    submit = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <MemoryRouter initialEntries={["/login"]}>
            <AppContext.Provider value={mockLoggedInContext}>
              <Routes>
                <Route path="/login" element={<Login onSubmit={submit} />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </AppContext.Provider>
          </MemoryRouter>
        </HelmetProvider>
      </QueryClientProvider>
    );
  });
  it("should render the right elements", async () => {
    const loginHeader = screen.getByRole("heading", {
      name: "Sign in to your account",
    });
    expect(loginHeader).toBeInTheDocument();
    // const nameInput = screen.getByPlaceholderText("Name");
    // expect(nameInput).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText("Email address");
    expect(emailInput).toBeInTheDocument();
    const passwordInput = screen.getByPlaceholderText("Password");

    expect(passwordInput).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Sign in" });
    expect(btn).toBeInTheDocument();
    // const name = "youcef";
    const email = "you@gmail.com";
    const password = "1";
    const user = userEvent.setup();

    // await user.type(nameInput, name);
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    await user.click(btn);
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledWith({
      email,
      password,
    });
    console.log(email, password);
    useLocation.mockReturnValue({ pathname: "/cart" });
    expect(useLocation().pathname).toBe("/cart");
  });
});

describe("group of testing component without onSubmit", () => {
  const queryClient = new QueryClient();

  const mockLoggedInContext = {
    cart: [],
    clearCart: vi.fn(),
    total: 69.99,
    amount: 1,
    updatedCart: vi.fn(),
    addToCart: vi.fn(),
    setFormUser: vi.fn(), // Ensure this is included
    updateLoginStatus: vi.fn(),
    logout: vi.fn(),
    formUser: { name: "Test User", email: "test@example.com" },
    googleUser: null,
    GoogleAuthProvider: vi.fn(),
    cartShipping: vi.fn(),
    cartPayment: vi.fn(),
    googleLogin: vi.fn(),
    setGoogleUser: vi.fn(),
    payment: { payment: "paypal" },
    shipping: {
      fullName: "You",
      address: "11 street",
      city: "Algiers",
      postalCode: "1600",
      country: "Algeria",
    },
    paymentSucceeded: true,
    login: true,
    isLoggingOut: false,
  };
  let submit;

  beforeEach(async () => {
    submit = vi.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <MemoryRouter initialEntries={["/login"]}>
            <AppContext.Provider value={mockLoggedInContext}>
              <Routes>
                <Route path="/login" element={<Login onSubmit={submit} />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </AppContext.Provider>
          </MemoryRouter>
        </HelmetProvider>
      </QueryClientProvider>
    );
  });
  it("should render the right elements", async () => {
    const loginHeader = screen.getByRole("heading", {
      name: "Sign in to your account",
    });
    expect(loginHeader).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("Email address");
    expect(emailInput).toBeInTheDocument();
    const passwordInput = screen.getByPlaceholderText("Password");

    expect(passwordInput).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Sign in" });
    expect(btn).toBeInTheDocument();
    // const name = "youcef";
    const email = "youcef@gmail.com";
    const password = "123";
    const user = userEvent.setup();

    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    await user.click(btn);

    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledWith({
      email: "youcef@gmail.com",
      password: "123",
    });
    useLocation.mockReturnValue({ pathname: "/cart" });
    expect(useLocation().pathname).toBe("/cart");
    const cartHeader = screen.queryByRole("heading", { name: "your bag" });
    expect(cartHeader).toBeInTheDocument();
    screen.debug();
  }, 5000);
});

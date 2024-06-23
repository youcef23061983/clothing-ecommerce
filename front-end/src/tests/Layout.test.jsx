import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AppProvider from "../data managment/AppProvider";
import { userEvent } from "@testing-library/user-event";
import Login from "../info & contact/Login";
import NewArrival from "../pages/NewArrival";
import Layout from "../front page/Layout";
import Story from "../info & contact/Story";
import Policy from "../info & contact/Policy";
import Terms from "../info & contact/Terms";
import SignUp from "../info & contact/SignUp";
import Contact from "../info & contact/Contact";
import { AppContext } from "./SetupTest";
import { mockContextValue } from "./SetupTest";

describe("group of Navbar testing", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/"]}>
          <AppContext.Provider value={mockContextValue}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/new" element={<NewArrival />} />
                <Route path="/story" element={<Story />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
              </Route>
            </Routes>
          </AppContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText("...is loading")).toBeNull();
    });
  });

  it("should render the Login CComponent ", async () => {
    const login = screen.getByRole("link", { name: "Login" });
    expect(login).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(login);
    const header = screen.getByRole("heading", {
      name: "Sign in to your account",
    });
    expect(header).toBeInTheDocument();
    screen.debug();
  });
  it("should render NewArrival component", async () => {
    const newLink = screen.getByRole("link", { name: "New Arrivals" });
    expect(newLink).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(newLink);
    const newHeader = screen.getByRole("heading", {
      name: "Your New Arrivals",
    });
    expect(newHeader).toBeInTheDocument();
  });
  it("should render NewArrival component", async () => {
    const contactLink = screen.getAllByRole("link", { name: "Contact Us" })[0];
    expect(contactLink).toBeInTheDocument();
    const user2 = userEvent.setup();
    await user2.click(contactLink);
    const contactHeader = screen.getByRole("heading", {
      name: "GET IN TOUCH",
    });
    expect(contactHeader).toBeInTheDocument();
  });
  it("should render Sign up component", async () => {
    const signupLink = screen.getByRole("link", { name: "Sign Up" });
    expect(signupLink).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(signupLink);
    const signupHeader = screen.getByRole("heading", { name: "Sign Up" });
    expect(signupHeader).toBeInTheDocument();
  });
  it("should render Story component", async () => {
    const storyLink = screen.getAllByRole("link", { name: "Our Story" })[1];
    expect(storyLink).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(storyLink);
    const storyHeader = screen.getByRole("heading", { name: "Our Story" });
    expect(storyHeader).toBeInTheDocument();
  });
  it("should render policy component correctky", async () => {
    const privacyPolicyLink = screen.getByRole("link", {
      name: /privacy policy/i,
    });
    const termsLink = screen.getByRole("link", {
      name: /terms & conditions/i,
    });
    const cookiesPolicyLink = screen.getByRole("link", {
      name: /cookies policy/i,
    });

    expect(privacyPolicyLink).toBeInTheDocument();
    expect(termsLink).toBeInTheDocument();
    expect(cookiesPolicyLink).toBeInTheDocument();
  });
});

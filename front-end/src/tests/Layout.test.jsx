import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AppProvider from "../data managment/AppProvider";
import { userEvent } from "@testing-library/user-event";
import Login from "../info & contact/Login";
import NewArrival from "../pages/NewArrival";
import Layout from "../front page/Layout";
import Story from "../info & contact/Story";
describe("group of Navbar testing", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/"]}>
          <AppProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/new" element={<NewArrival />} />
                <Route path="/story" element={<Story />} />
              </Route>
            </Routes>
          </AppProvider>
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
  it("should render Story component", async () => {
    const storyLink = screen.getAllByRole("link", { name: "Our Story" })[1];
    expect(storyLink).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(storyLink);
    const storyHeader = screen.getByRole("heading", { name: "Our Story" });
    expect(storyHeader).toBeInTheDocument();
  });
});

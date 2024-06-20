import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, vi } from "vitest";
import Contact from "../info & contact/Contact";
import userEvent from "@testing-library/user-event";

describe("group of testing Contact compoennt", () => {
  const queryClient = new QueryClient();
  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Contact />
      </QueryClientProvider>
    );
  });
  it("should render the right elements", async () => {
    const contactHeader = screen.getByRole("heading", { name: "GET IN TOUCH" });
    expect(contactHeader).toBeInTheDocument();
    const p = screen.getByText(/----@---.com/i);
    expect(p).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Submit:" });
    expect(btn).toBeInTheDocument();
    const firstNameIput = screen.getByLabelText(/First Name:/i);
    const emailput = screen.getByLabelText(/Email:/i);
    const textIput = screen.getByLabelText(/Comment:/i);
    const name = "you";
    const email = "you@g.com";
    const comment = "everything is gonna be alright";
    const user = userEvent.setup();
    const submit = vi.fn().mockImplementation((e) => e.preventDefault());
    await user.type(firstNameIput, name);
    await user.type(emailput, email);
    await user.type(textIput, comment);
    user.click(btn);
    submit.mockReturnValueOnce({ name, email, comment });
    console.log(name, email, comment);

    screen.debug(btn);
  });
});

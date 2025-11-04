// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { render, screen } from "@testing-library/react";
// import { beforeEach, expect } from "vitest";
// import { AppContext } from "./SetupTest";
// import Shipping from "../cart & payment/Shipping";
// import Payment from "../cart & payment/Payment";
// import { MemoryRouter, Route, Routes } from "react-router-dom";
// import userEvent from "@testing-library/user-event";

// describe("group of testing Shipping component", () => {
//   const queryClient = new QueryClient();
//   beforeEach(async () => {
//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter initialEntries={["/shipping"]}>
//           <AppContext.Provider>
//             <Routes>
//               <Route path="/shipping" element={<Shipping />} />
//               <Route path="/payment" element={<Payment />} />
//             </Routes>
//           </AppContext.Provider>
//         </MemoryRouter>
//       </QueryClientProvider>
//     );
//   });
//   it("should render the right elements", async () => {
//     const header = screen.getByRole("heading", { name: "Shipping Address" });
//     expect(header).toBeInTheDocument();
//     const fullName = screen.getByLabelText("Full Name:");
//     expect(fullName).toBeInTheDocument();
//     const Address = screen.getByLabelText("Address:");
//     expect(Address).toBeInTheDocument();
//     const City = screen.getByLabelText("City:");
//     expect(City).toBeInTheDocument();
//     const PostalCode = screen.getByLabelText("Postal Code:");
//     expect(PostalCode).toBeInTheDocument();
//     const Country = screen.getByLabelText("Country:");
//     expect(Country).toBeInTheDocument();
//     const btn = screen.getByRole("button", { name: "Continue" });
//     expect(btn).toBeInTheDocument();
//     const name = "you";
//     const adress = "25 you , algiers";
//     const city = "algiers";
//     const code = "11";
//     const country = "algeria";
//     const user = userEvent.setup();
//     await user.type(fullName, name);
//     await user.type(Address, adress);
//     await user.type(City, city);
//     await user.type(PostalCode, code);
//     await user.type(Country, country);
//     // await user.click(btn);
//     // console.log(name, adress, city, code, country);

//     // const paymentHeader = screen.getByRole("heading", {
//     //   name: "Payment Method",
//     // });
//     // expect(paymentHeader).toBeInTheDocument();
//     // screen.debug();
//   });
// });

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, vi } from "vitest";
import { AppContext } from "./SetupTest";
import Shipping from "../cart & payment/Shipping";
import Payment from "../cart & payment/Payment";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
vi.mock("../utils/phoneUtils", () => ({
  isValidPhone: vi.fn(() => true),
  formatPhone: vi.fn((phoneCode, phone) => `+${phoneCode}${phone}`),
}));

describe("group of testing Shipping component", () => {
  const queryClient = new QueryClient();

  // Create mock context value to fix the warning
  const mockContextValue = {
    cartShipping: vi.fn(),
    shipping: {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      phoneCode: "",
      phone: "",
      country: "",
    },
  };

  beforeEach(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/shipping"]}>
          <AppContext.Provider value={mockContextValue}>
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

    const PhoneCode = screen.getByLabelText("Phone Code:");
    expect(PhoneCode).toBeInTheDocument();

    const Phone = screen.getByLabelText("Phone:");
    expect(Phone).toBeInTheDocument();

    const btn = screen.getByRole("button", { name: "Continue" });
    expect(btn).toBeInTheDocument();

    const name = "you";
    const adress = "25 you , algiers";
    const city = "algiers";
    const code = "16000";
    const country = "algeria";
    const phoneCode = "213";
    const phone = "540016247";

    const user = userEvent.setup();

    // Fill text fields
    await user.type(fullName, name);
    await user.type(Address, adress);
    await user.type(City, city);
    await user.type(PostalCode, code);
    await user.type(Country, country);
    await user.type(Phone, phone);

    // SELECT the phone code (not type!)
    await user.selectOptions(PhoneCode, phoneCode);

    await user.click(btn);
    console.log(name, adress, city, code, country);

    // Use findByRole instead of getByRole to wait for navigation
    // const paymentHeader = await screen.findByRole("heading", {
    //   name: "Payment Method",
    // });
    // expect(paymentHeader).toBeInTheDocument();
    screen.debug();
  });

  // Add more focused tests that don't depend on navigation
  it("should have phone fields", () => {
    const PhoneCode = screen.getByLabelText("Phone Code:");
    expect(PhoneCode).toBeInTheDocument();

    const Phone = screen.getByLabelText("Phone:");
    expect(Phone).toBeInTheDocument();
  });

  it("should show alert when submitting incomplete form", async () => {
    const user = userEvent.setup();
    const btn = screen.getByRole("button", { name: "Continue" });

    await user.click(btn);

    expect(global.alert).toHaveBeenCalledWith("Please enter your information");
  });
});

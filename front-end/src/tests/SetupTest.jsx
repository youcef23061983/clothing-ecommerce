import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { createContext, useState } from "react";
// import { useParams } from "react-router-dom";

// Extend expect with vi-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
global.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
const mockMatchMedia = (matches) => ({
  matches,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
});

if (typeof window !== "undefined") {
  window.matchMedia = vi.fn().mockImplementation((query) => {
    return mockMatchMedia(false);
  });
}
export const mockData = [
  {
    id: 1,
    productName: "jacket1",
    slug: "2023 Woolen Coat High Quality Men's wool coat",
    type: "jacket",
    price: 69.99,
    size: ["s", "m", "l", "xl"],
    newPrice: "",
    images: [
      "src/images/men/jacket1/image1.jpg",
      "src/images/men/jacket1/image2.jpg",
    ],
    newArrival: true,
    onSale: false,
    bestSeller: true,
    rating: 4,
    preview: 11,
    amount: 1,
  },
  {
    id: 2,
    productName: "jeans1",
    slug: "Latest 2023 jeans",
    type: "jeans",
    price: 29.99,
    size: ["s", "m", "l", "xl"],
    newPrice: "",
    images: [
      "src/images/men/jaet1/image1.jpg",
      "src/images/men/jaet1/image2.jpg",
    ],
    newArrival: false,
    onSale: true,
    bestSeller: false,
    rating: 4,
    preview: 10,
    amount: 1,
  },
  {
    id: 3,
    productName: "shirt1",
    slug: "shirt 2023",
    type: "shirt",
    price: 19.99,
    size: ["s", "m", "l", "xl"],
    newPrice: "",
    images: [
      "src/images/men/jacket1/image1.jpg",
      "src/images/men/jacket1/image2.jpg",
    ],
    newArrival: true,
    onSale: false,
    bestSeller: true,
    rating: 4,
    preview: 9,
    amount: 1,
  },
  {
    id: 4,
    productName: "trousers2",
    slug: "Latest 2023 trousers2",
    type: "trousers",
    price: 19.99,
    size: ["s", "m", "l", "xl"],
    newPrice: "",
    images: [
      "src/images/men/jack1/image1.jpg",
      "src/images/men/jack1/image2.jpg",
    ],
    newArrival: false,
    onSale: true,
    bestSeller: false,
    rating: 4,
    preview: 8,
    amount: 1,
  },
  {
    id: 5,
    productName: "tshirt2",
    slug: "2023 tshirt2",
    type: "tshirt",
    price: 19.99,
    size: ["s", "m", "l", "xl"],
    newPrice: "",
    images: [
      "src/images/men/cket2/image1.jpg",
      "src/images/men/cket2/image2.jpg",
    ],
    newArrival: true,
    onSale: false,
    bestSeller: true,
    rating: 4,
    preview: 7,
    amount: 1,
  },
  {
    id: 6,
    productName: "shoes1",
    slug: "Latest 2023 shoes",
    type: "shoes",
    price: 39.99,
    size: ["s", "m", "l", "xl"],
    newPrice: "",
    images: [
      "src/images/men/jacke1/image1.jpg",
      "src/images/men/jacke1/image2.jpg",
    ],
    newArrival: false,
    onSale: true,
    bestSeller: false,
    rating: 4,
    preview: 8,
    amount: 1,
  },
  {
    id: 7,
    productName: "sneakers",
    slug: "Latest 2023 sneakers",
    type: "sneakers",
    price: 49.99,
    size: ["s", "m", "l", "xl"],
    newPrice: "",
    images: [
      "src/images/men/jacet1/image1.jpg",
      "src/images/men/jacet1/image2.jpg",
    ],
    newArrival: true,
    onSale: false,
    bestSeller: true,
    rating: 4,
    preview: 6,
    amount: 1,
  },
  {
    id: 8,
    productName: "sweatshirt",
    slug: "Latest 2023 sweatshirt",
    type: "sweatshirt",
    price: 59.99,
    size: ["s", "m", "l", "xl"],
    newPrice: "",
    images: [
      "src/images/men/jcket1/image1.jpg",
      "src/images/men/jcket1/image2.jpg",
    ],
    newArrival: false,
    onSale: true,
    bestSeller: false,
    rating: 4,
    preview: 5,
    amount: 1,
  },
  {
    id: 9,
    productName: "trousers",
    slug: "2023 Wooleneen Coat ",
    type: "trousers",
    price: 39.99,
    size: ["s", "m", "l", "xl"],
    newPrice: "",
    images: [
      "src/images/men/jet1/image1.jpg",
      "src/images/men/jet1/image2.jpg",
    ],
    newArrival: true,
    onSale: false,
    bestSeller: true,
    rating: 4,
    preview: 4,
    amount: 1,
  },
  {
    id: 10,
    productName: "tshirt",
    slug: "2023 tshirt",
    type: "tshirt",
    price: 9.99,
    size: ["s", "m", "l", "xl"],
    newPrice: "",
    images: [
      "src/images/men/jact1/image1.jpg",
      "src/images/men/jact1/image2.jpg",
    ],
    newArrival: false,
    onSale: true,
    bestSeller: true,
    rating: 4,
    preview: 7,
    amount: 1,
  },
];
export const mockData2 = {
  id: 1,
  productName: "jacket1",
  slug: "2023 Woolen Coat High Quality Men's wool coat",
  type: "jacket",
  price: 69.99,
  size: ["s", "m", "l", "xl"],
  newPrice: "",
  images: [
    "src/images/men/jacket1/image1.jpg",
    "src/images/men/jacket1/image2.jpg",
  ],
  newArrival: true,
  onSale: false,
  bestSeller: true,
  rating: 4,
  preview: 9,
  amount: 1,
};

// Mock useParams
// vi.mock("react-router-dom", async (importOriginal) => {
//   const actual = await importOriginal(); // Preserve the original module
//   return {
//     ...actual, // Spread the original exports
//     // useParams: vi.fn(() => ({ id: 1 })), // Mock useParams
//   };
// });
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});
export const mockCartContext = {
  cart: [],
  clearCart: vi.fn(),
  total: 69.99,
  amount: 1,
  updatedCart: vi.fn(),
  addToCart: vi.fn((id) => {
    const newItem = {
      id: 1,
      productName: "jacket1",
      slug: "2023 Woolen Coat High Quality Men's wool coat",
      type: "jacket",
      price: 69.99,
      size: ["s", "m", "l", "xl"],
      newPrice: "",
      images: [
        "src/images/men/jacket1/image1.jpg",
        "src/images/men/jacket1/image2.jpg",
      ],
      newArrival: true,
      onSale: false,
      bestSeller: true,
      rating: 4,
      preview: 11,
      amount: 1,
    };
    mockCartContext.cart.push(newItem);
  }),
  setFormUser: vi.fn(),
  updateLoginStatus: vi.fn(false),
  logout: vi.fn(),
  setFormUser: vi.fn(),
  formUser: null,
  googleUser: null,
  GoogleAuthProvider: vi.fn(),
  cartShipping: vi.fn(),
  cartPayment: vi.fn(),
  payment: { payment: "paypal" },
  shipping: {
    fullName: "youcef",
    address: "11 street",
    city: "algiers",
    postalCode: "1600",
    country: "algeria",
  },
  paymentSucceeded: true,
};
export const AppContext = createContext(mockCartContext);
vi.mock("../data managment/AppProvider.jsx", () => ({
  __esModule: true,
  AppContext: createContext(mockCartContext),
  default: ({ children }) => (
    <AppContext.Provider value={mockCartContext}>
      {children}
    </AppContext.Provider>
  ),
}));
export const auth = {
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  currentUser: { displayName: "Test User", photoURL: "test-url" },
};
vi.mock("../data managment/UseFetch.jsx", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    data: mockData,
    isPending: false,
    error: null,
  })),
}));
vi.mock("../data managment/DetailUseFetch.jsx", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    data: mockData2,
    isPending: false,
    error: null,
  })),
}));

import React, { useReducer, useEffect, createContext } from "react";
import { useQuery } from "@tanstack/react-query";

export const AppContext = createContext();
const initialState = {
  cart: [],
  total: 0,
  amount: 0,
  shipping: {},
  payment: {},
};

const AppProvider = ({ children }) => {
  const productsFun = async () => {
    const res = await fetch("http://localhost:3000/products");
    if (!res.ok) {
      throw Error("there is no products data");
    }
    return res.json();
  };

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: productsFun,
  });

  const Reducer = (state, action) => {
    switch (action.type) {
      case "CLEAR_CART":
        return { ...state, cart: [] };
      case "REMOVE":
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== action.payload),
        };
      case "INCREASE": {
        let newItem = state.cart.map((item) => {
          if (item.id === action.payload) {
            return { ...item, amount: item.amount + 1 };
          }
          return item;
        });
        return { ...state, cart: newItem };
      }
      case "DECREASE": {
        let newItem = state.cart
          .map((item) => {
            if (item.id === action.payload) {
              return { ...item, amount: item.amount - 1 };
            }
            return item;
          })
          .filter((item) => item.amount !== 0);
        return { ...state, cart: newItem };
      }
      case "GET_TOTAL": {
        let { amount, total } = state.cart.reduce(
          (cartTotal, cartItem) => {
            const { price, amount, newPrice } = cartItem;
            cartTotal.amount += amount;
            cartTotal.total += amount * (newPrice || price);
            return cartTotal;
          },
          {
            total: 0,
            amount: 0,
          }
        );
        total = parseFloat(total.toFixed(2));
        return { ...state, amount, total };
      }

      case "ADD_TO_CART": {
        const newProduct = data?.find(
          (product) => product.id === action.payload
        );
        const alreadyProduct = state.cart.find(
          (product) => product.id === action.payload
        );
        if (alreadyProduct) return state;
        const updatedCart = [...state.cart, newProduct];
        return { ...state, cart: updatedCart };
      }
      case "SHIPPING": {
        return {
          ...state,
          shipping: action.payload,
        };
      }
      case "PAYMENT": {
        return {
          ...state,
          payment: action.payload,
        };
      }

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(Reducer, initialState);

  const addToCart = (id) => {
    dispatch({ type: "ADD_TO_CART", payload: id });
  };
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };
  const remove = (id) => {
    dispatch({ type: "REMOVE", payload: id });
  };
  const increase = (id) => {
    dispatch({ type: "INCREASE", payload: id });
  };
  const decrease = (id) => {
    dispatch({ type: "DECREASE", payload: id });
  };
  const cartShipping = (shipping) => {
    dispatch({
      type: "SHIPPING",
      payload: shipping,
    });
  };
  const cartPayment = (payment) => {
    dispatch({ type: "PAYMENT", payload: payment });
  };
  useEffect(() => {
    dispatch({ type: "GET_TOTAL" });
  }, [state.cart]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        clearCart,
        remove,
        increase,
        decrease,
        addToCart,
        cartPayment,
        cartShipping,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

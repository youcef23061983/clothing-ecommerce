import React, { useReducer, useEffect, createContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const AppContext = createContext();

const initialState = {
  cart: [],
  total: 0,
  amount: 0,
  shipping: {},
  payment: {},
  googleUser: null,
  formUser: null,
  login: false,
};

const AppProvider = ({ children }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
        return { ...state, cart: [], total: 0, amount: 0 };
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
      case "SET_GOOGLE_USER": {
        return {
          ...state,
          googleUser: action.payload,
          login: !!action.payload, // Update login state based on user presence
        };
      }
      case "SET_FORM_USER": {
        return {
          ...state,
          formUser: action.payload,
          login: !!action.payload, // Update login state based on user presence
        };
      }
      case "SET_LOGIN":
        return { ...state, login: action.payload };
      case "LOGOUT": {
        return {
          ...state,
          googleUser: null,
          formUser: null,
          login: false,
        };
      }
      case "LOAD_CART": {
        return { ...state, cart: action.payload };
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
    localStorage.setItem("shipping", JSON.stringify(shipping));
    dispatch({
      type: "SHIPPING",
      payload: shipping,
    });
  };
  const cartPayment = (payment) => {
    localStorage.setItem("payment", JSON.stringify(payment));
    dispatch({ type: "PAYMENT", payload: payment });
  };
  const setGoogleUser = (user) => {
    localStorage.setItem("googleUser", JSON.stringify(user));
    dispatch({ type: "SET_GOOGLE_USER", payload: user });
  };
  const setFormUser = (user) => {
    localStorage.setItem("formUser", JSON.stringify(user));
    dispatch({ type: "SET_FORM_USER", payload: user });
  };

  const logout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("googleUser");
    localStorage.removeItem("formUser");
    localStorage.setItem("login", JSON.stringify(false));
    dispatch({ type: "LOGOUT" });

    setTimeout(() => {
      setIsLoggingOut(false);
    }, 2000);
  };
  const updateLoginStatus = (isLoggedIn) => {
    localStorage.setItem("login", JSON.stringify(isLoggedIn));
    dispatch({ type: "SET_LOGIN", payload: isLoggedIn });
  };
  const updatedCart = () => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
    dispatch({ type: "LOAD_CART", payload: state.cart });
  };
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(storedCart) });
    }
  }, []);

  useEffect(() => {
    const savedGoogleUser = localStorage.getItem("googleUser");
    if (savedGoogleUser) {
      dispatch({
        type: "SET_GOOGLE_USER",
        payload: JSON.parse(savedGoogleUser),
      });
    }

    const savedFormUser = localStorage.getItem("formUser");
    if (savedFormUser) {
      dispatch({ type: "SET_FORM_USER", payload: JSON.parse(savedFormUser) });
    }
  }, []);

  useEffect(() => {
    const storedLogin = localStorage.getItem("login");
    if (storedLogin) {
      dispatch({ type: "SET_LOGIN", payload: JSON.parse(storedLogin) });
    }
  }, []);

  useEffect(() => {
    const storedPayment = localStorage.getItem("payment");
    if (storedPayment) {
      dispatch({ type: "PAYMENT", payload: JSON.parse(storedPayment) });
    }
  }, []);

  // i change that useEffect by updatedCart i left it below in case of issues
  // useEffect(() => {
  //   localStorage.setItem("cart", JSON.stringify(state.cart));
  // }, [state.cart]);

  // Update totals whenever cart changes
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
        setGoogleUser,
        setFormUser,
        logout,
        updateLoginStatus,
        updatedCart,
        isLoggingOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

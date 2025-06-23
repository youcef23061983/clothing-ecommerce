import { useReducer, useEffect, createContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../info & contact/Firebase";

export const AppContext = createContext();

const initialState = {
  cart: [],
  total: 0,
  amount: 0,
  shipping: {},
  payment: {},
  user: null,
  formUser: null,
  firebaseUser: null,
  login: false,
};

const AppProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const url = `${import.meta.env.VITE_PUBLIC_PRODUCTS_URL}/products`;
  const verifyUrl = import.meta.env.VITE_PUBLIC_PRODUCTS_URL;

  const productsFun = async () => {
    const res = await fetch(url);
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
      case "SET_FORM_USER": {
        return {
          ...state,
          formUser: action.payload,
          // login: !!action.payload,
        };
      }

      case "SET_FIREBASE_USER": {
        return {
          ...state,
          firebaseUser: action.payload,
          // login: !!action.payload,
        };
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

      case "LOGOUT": {
        return {
          ...state,
          firebaseUser: null,
          formUser: null,
          // login: false,
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

  // Initialize Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          provider: firebaseUser.providerData[0]?.providerId,
        };
        setFirebaseUser(userData);
      } else {
        setFirebaseUser(null);
      }
    });
    return () => unsubscribe();
  }, []);
  // Action creators
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
    dispatch({ type: "SHIPPING", payload: shipping });
  };

  const cartPayment = (payment) => {
    localStorage.setItem("payment", JSON.stringify(payment));
    dispatch({ type: "PAYMENT", payload: payment });
  };

  const setFormUser = (user) => {
    sessionStorage.setItem("formUser", JSON.stringify(user));
    dispatch({ type: "SET_FORM_USER", payload: user });
  };

  const setFirebaseUser = (user) => {
    localStorage.setItem("fireUser", JSON.stringify(user));

    dispatch({ type: "SET_FIREBASE_USER", payload: user });
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem("formUser");
      sessionStorage.removeItem("fireUser");
      sessionStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      throw error; // Re-throw to handle in components
    }
  };

  // Initialize app state

  useEffect(() => {
    if (isInitialized) return;

    const initializeState = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(storedCart) });
      }
      try {
        const savedFirebaseUser = localStorage.getItem("fireUser");
        if (savedFirebaseUser) {
          const user = JSON.parse(savedFirebaseUser);
          // Verify the user object has required fields
          if (user && user.uid) {
            dispatch({ type: "SET_FIREBASE_USER", payload: user });
          }
        }
      } catch (e) {
        console.warn("Failed to load Firebase user", e);
      }

      try {
        const savedFormUser = localStorage.getItem("formUser");
        if (savedFormUser) {
          const user = JSON.parse(savedFormUser);
          // Verify the user object has required fields
          if (user && user.email) {
            dispatch({ type: "SET_FORM_USER", payload: user });
          }
        }
      } catch (e) {
        console.warn("Failed to load form user", e);
      }

      // Load payment
      const storedPayment = localStorage.getItem("payment");
      if (storedPayment) {
        dispatch({ type: "PAYMENT", payload: JSON.parse(storedPayment) });
      }

      // Load shipping
      const storedShipping = localStorage.getItem("shipping");
      if (storedShipping) {
        dispatch({ type: "SHIPPING", payload: JSON.parse(storedShipping) });
      }

      setIsInitialized(true);
    };

    initializeState();
  }, [isInitialized]);
  //   // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("cart", JSON.stringify(state.cart));
    dispatch({ type: "GET_TOTAL" });
  }, [state.cart, isInitialized]);
  // Add this to your AppProvider or auth context
  const checkAuthStatus = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return null;

      const response = await fetch(`${verifyUrl}/auth/verify`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        sessionStorage.removeItem("token");
        return null;
      }

      const data = await response.json();
      sessionStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      console.error("Auth check error:", error);
      return null;
    }
  };
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
        logout,
        setFirebaseUser,
        setFormUser,
        checkAuthStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Layout from "./pages/Layout";
import Detail from "./pages/Detail";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import AppProvider from "./pages/AppProvider";
import Login from "./pages/Login";
import RequireAuth from "./pages/RequireAuth";
import SignUp from "./pages/SignUp";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import Order from "./pages/Order";
import { app } from "./pages/Firebase";
import NewArrival from "./pages/NewArrival";
import Story from "./pages/Story";
import Cookies from "./pages/Cookies";
import Toprated from "./pages/Toprated";
import Best from "./pages/Best";
import Sale from "./pages/Sale";
import Terms from "./pages/Terms";
import { AnimatePresence } from "framer-motion";
import Policy from "./pages/Policy";

function App() {
  const location = useLocation();

  const [login, setLogin] = useState(false);

  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.key}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route
              path="/:id"
              element={<Detail key1="product" key2="products" />}
            />
            <Route path="contact" element={<Contact />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="payment" element={<Payment />} />
            <Route path="order" element={<Order />} />
            <Route path="new" element={<NewArrival />} />
            <Route path="story" element={<Story />} />
            <Route path="cookies" element={<Cookies />} />
            <Route path="rating" element={<Toprated />} />
            <Route path="best" element={<Best key1="products" />} />
            <Route path="sale" element={<Sale />} />
            <Route path="terms" element={<Terms />} />
            <Route path="policy" element={<Policy />} />

            <Route
              path="cart"
              element={
                <RequireAuth login={login}>
                  <Cart />
                </RequireAuth>
              }
            />
            <Route path="login" element={<Login setLogin={setLogin} />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </AppProvider>
  );
}

export default App;

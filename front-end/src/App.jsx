import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Homepage from "./front page/Homepage";
import Layout from "./front page/Layout";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import AppProvider from "./data managment/AppProvider";
import Login from "./info & contact/Login";
import { app } from "./info & contact/Firebase";

import RequireAuth from "./cart & payment/RequireAuth";
import SignUp from "./info & contact/SignUp";
import Shipping from "./cart & payment/Shipping";
import Payment from "./cart & payment/Payment";
import Order from "./cart & payment/Order";
import NewArrival from "./pages/NewArrival";
import Story from "./info & contact/Story";
import Cookies from "./info & contact/Cookies";
import Toprated from "./pages/Toprated";
import Best from "./pages/Best";
import Sale from "./pages/Sale";
import Terms from "./info & contact/Terms";
import Policy from "./info & contact/Policy";
import Contact from "./info & contact/Contact";
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();

  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.key}>
          <Route path="" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path=":productID" element={<Detail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="payment" element={<Payment />} />
            <Route path="order" element={<Order />} />
            <Route path="new" element={<NewArrival />} />
            <Route path="story" element={<Story />} />
            <Route path="cookies" element={<Cookies />} />
            <Route path="rating" element={<Toprated />} />
            <Route path="best" element={<Best />} />
            <Route path="sale" element={<Sale />} />
            <Route path="terms" element={<Terms />} />
            <Route path="policy" element={<Policy />} />

            <Route
              path="cart"
              element={
                <RequireAuth>
                  <Cart />
                </RequireAuth>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </AppProvider>
  );
}

export default App;

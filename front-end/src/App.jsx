import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Homepage from "./front page/Homepage";
import Layout from "./front page/Layout";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import { AppContext } from "./data managment/AppProvider";
import Login from "./info & contact/Login";
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
import Dashboard from "./dashboard/Dashboard";
import Dashboardlayout from "./dashboard/Dashboardlayout";
import Team from "./dashboard/Team";
import Form from "./dashboard/Form";
import Calendar from "./dashboard/Calendar";
import BarChart from "./dashboard/BarChart";
import PieChart from "./dashboard/PieChart";
import GeographyChart from "./dashboard/GeographyChart";
import LineChart from "./dashboard/LineChart";
import ProductsDashboard from "./dashboard/ProductsDashboard";
import AddProduct from "./dashboard/AddProduct";
import { useContext } from "react";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userRole: null,
    checked: false,
  });
  const { setFirebaseUser, setFormUser, checkAuthStatus, firebaseUser } =
    useContext(AppContext);

  const setAuth = (userData) => {
    setAuthState({
      isAuthenticated: true,
      userRole: userData?.user_role || "customer",
      checked: true,
    });
  };
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const user = await checkAuthStatus();

        if (user) {
          setAuthState({
            isAuthenticated: true,
            userRole: user.user?.user_role || "customer",
            checked: true,
          });
          setFormUser(user);

          sessionStorage.setItem("token", user.token);
        } else if (firebaseUser) {
          setAuthState({
            isAuthenticated: true,
            userRole: user.user?.user_role || "customer",
            checked: true,
          });
          setFirebaseUser(user);
          sessionStorage.setItem("token", user.token);
        } else {
          setAuthState({
            isAuthenticated: false,
            userRole: null,
            checked: true,
          });
          sessionStorage.removeItem("token");
        }
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          userRole: null,
          checked: true,
        });
      }
    };

    verifyAuth();
  }, [firebaseUser]);

  if (!authState.checked) {
    return <div>Loading...</div>; // Or your custom loader
  }

  return (
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
          <Route path="signup" element={<SignUp />} />
          <Route
            path="/login"
            element={
              !authState.isAuthenticated ? (
                <Login setAuth={setAuth} />
              ) : authState.userRole === "admin" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/cart" replace />
              )
            }
          />

          <Route
            path="/cart"
            element={
              authState.isAuthenticated ? (
                <Cart />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              authState.isAuthenticated && authState.userRole === "admin" ? (
                <Dashboardlayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Team />} />
            <Route path="productsdashboard" element={<ProductsDashboard />} />
            <Route path="addProduct" element={<AddProduct />} />
            <Route path="form" element={<Form />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="pie" element={<PieChart />} />
            <Route path="line" element={<LineChart />} />
            <Route path="geo" element={<GeographyChart />} />
            <Route path="bar" element={<BarChart />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;

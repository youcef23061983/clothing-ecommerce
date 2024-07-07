import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../data managment/AppProvider";

const RequireAuth = ({ children }) => {
  const { login, isLoggingOut } = useContext(AppContext);

  if (!login && !isLoggingOut) {
    alert("You must log in first");
    return <Navigate to="/login" replace={true} />;
  }

  return children;
};

export default RequireAuth;

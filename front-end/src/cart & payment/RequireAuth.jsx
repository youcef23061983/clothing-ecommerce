import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../data managment/AppProvider";

const RequireAuth = ({ children }) => {
  const { login } = useContext(AppContext);
  if (!login) {
    alert("you must login first");
    return <Navigate to="/login" />;
  }
  return children;
};

export default RequireAuth;

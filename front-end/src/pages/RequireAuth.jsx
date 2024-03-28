import { Navigate } from "react-router-dom";

const RequireAuth = ({ login, children }) => {
  if (!login) {
    alert("you must login first");
    return <Navigate to="/login" />;
  }
  return children;
};

export default RequireAuth;

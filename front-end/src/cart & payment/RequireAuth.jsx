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

// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from './AuthContext';

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useContext(AuthContext);

//   if (loading) {
//     return <div>Loading...</div>; // Or a spinner/loading component
//   }

//   return user ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;

// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { Context } from "../Context/AuthContext";

// export function Protected({children}){
//     const {user} = useContext(Context);

//     if(!user){
//         return <Navigate to="/signin" replace/>
//     }else{
//         return children;
//     }
// }

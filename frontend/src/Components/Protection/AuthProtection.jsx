import React, { useContext } from "react";
import { AuthCont } from "../Services/AuthContext";
import { Navigate } from "react-router-dom";

const AuthProtection = (props) => {
  const authC = useContext(AuthCont);

  if (!authC.isLoggedIn) return <Navigate to={"/autoKolcsonzes/Főoldal"} />;

  return <>{props.children}</>;
};

export default AuthProtection;

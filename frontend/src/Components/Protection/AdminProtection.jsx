import React, { useContext } from "react";
import { AuthCont } from "../Services/AuthContext";
import { Navigate } from "react-router-dom";

const AdminProtection = (props) => {
  const authC = useContext(AuthCont);

  if (!authC.isAdmin()) return <Navigate to={"/autoKolcsonzes/Főoldal"} />;

  return <>{props.children}</>;
};

export default AdminProtection;

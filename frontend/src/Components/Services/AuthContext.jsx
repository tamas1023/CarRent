import { createContext, useState, useEffect, useContext } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export const AuthCont = createContext();

const AuthContext = (props) => {
  /*{props.children;}*/
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(null);
  const [navId, setNavId] = useState(0);

  const registration = () => {
    //itt nincs regisztráció de ha lenne ide jönne
  };
  //TODO
  const authCheck = async () => {
    //itt nincs auth ellenőrzés de ha lenne ide jönne
    await fetch(import.meta.env.VITE_API_URL + `/auth/authCheck`, {
      method: "POST",
      headers: { authtoken: cookies.get("authtoken") || null },
    })
      .then((res) => {
        //console.log(res.ok);
        if (!res.ok) {
          return null;
        }
        //itt a res.json az a következőben a data?? ha jól tudom
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          /*
          
          setUser(res.data.user);
          setIsAuth(true);
          */
          console.log("bejönide");
          cookies.set("authtoken", res.headers.authtoken, { path: "/" });
          login(data.user.UserName);
          navitage("/autoKolcsonzes/Főoldal");
        } else {
          logout();
        }
      })
      .catch((error) => {
        //ha nem jön vissza semmi
        console.log("Context " + error);
        logout();
        /*
        notificationHandler({
          type: "error",
          message: "Hiba történt:" + error,
        });
        */
      });
  };
  const login = async (username) => {
    setIsLoggedIn(true);
    setUser(username);
    /*
    cookies.set("isLoggedIn", "true", { path: "/" });
    cookies.set("userName", username, { path: "/" });
    */
  };
  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    /*
    cookies.remove("userName", { path: "/" });
    cookies.remove("isLoggedIn", { path: "/" });
    */
    cookies.remove("authtoken", { path: "/" });
  };
  //TODO:EZT MÉG MEG KELL CSINÁLNI,
  const isAdmin = () => {
    if (user === "admin") {
      return true;
    }
    return false;
  };
  useEffect(() => {
    /*
    const storedLoggedInStatus = cookies.get("isLoggedIn");
    const storeduserNameStatus = cookies.get("userName");
    if (storedLoggedInStatus === "true" && storeduserNameStatus !== null) {
      setIsLoggedIn(true);
      setUser(storeduserNameStatus);
    }*/
    //
    if (window.matchMedia("(prefers-color-scheme: dark").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
    authCheck();
  }, []);
  return (
    <AuthCont.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        user,
        setUser,
        isAdmin,
        theme,
        setTheme,
        navId,
        setNavId,
      }}
    >
      {props.children}
    </AuthCont.Provider>
  );
};

export default AuthContext;

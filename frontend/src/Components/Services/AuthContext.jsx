import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();
export const AuthCont = createContext();

const AuthContext = (props) => {
  /*{props.children;}*/
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userRights, setUserRights] = useState(null);
  const [theme, setTheme] = useState(null);
  const [navId, setNavId] = useState(0);
  const navigate = useNavigate();
  const registration = () => {
    //itt nincs regisztráció de ha lenne ide jönne
  };
  //TODO
  const authCheck = async () => {
    //itt nincs auth ellenőrzés de ha lenne ide jönne
    //console.log("Cookie token");
    //console.log(cookies.get("authtoken"));
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
        //console.log("Header token");
        //console.log(res.headers.get("authtoken"));
        cookies.set("authtoken", res.headers.get("authtoken"), { path: "/" });
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          /*
          
          setUser(res.data.user);
          setIsAuth(true);
          */

          login(data.user.UserName, data.user.RightsId);
          navigate("/autoKolcsonzes/Főoldal");
        } else {
          logout();
        }
      })
      .catch((error) => {
        //ha nem jön vissza semmi
        console.log(error);
        logout();
        /*
        notificationHandler({
          type: "error",
          message: "Hiba történt:" + error,
        });
        */
      });
  };
  const login = async (username, userrights) => {
    setIsLoggedIn(true);
    setUser(username);
    setUserRights(userrights);
    /*
    cookies.set("isLoggedIn", "true", { path: "/" });
    cookies.set("userName", username, { path: "/" });
    */
  };
  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserRights(null);
    /*
    cookies.remove("userName", { path: "/" });
    cookies.remove("isLoggedIn", { path: "/" });
    */
    cookies.remove("authtoken", { path: "/" });
    navigate("/autoKolcsonzes/Főoldal");
  };
  const isAdmin = () => {
    if (userRights === 2) {
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
        userRights,
      }}
    >
      {props.children}
    </AuthCont.Provider>
  );
};

export default AuthContext;

import React, { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCont } from "../Services/AuthContext";
import { NotificationCont } from "../Services/NotificationContext";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Login = (props) => {
  const navigate = useNavigate();
  const email = useRef();
  const pass = useRef();

  const authC = useContext(AuthCont);
  const { notificationHandler } = useContext(NotificationCont);
  const ToRegistration = () => {
    navigate("/autoKolcsonzes/Regisztráció");
  };
  const CheckUser = async () => {
    await fetch(import.meta.env.VITE_API_URL + "/auth/userLogin", {
      method: "POST",

      body: JSON.stringify({
        Email: email.current.value,
        Password: pass.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          notificationHandler({
            type: "error",
            message: "HTTP error!",
          });
          return null;
        }
        cookies.set("authtoken", res.headers.get("authtoken"), { path: "/" });
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          notificationHandler({
            type: "success",
            message: data.msg,
          });
          authC.login(data.username, data.userrights);
          navigate("/autoKolcsonzes/Főoldal");
        } else {
          notificationHandler({
            type: "error",
            message: data.msg,
          });
        }
      })

      .catch((error) => {
        // Ha bármilyen hiba történt a kérés során
        //console.error("Hiba történt:", error);
        notificationHandler({
          type: "error",
          message: "Error:  " + error,
        });
      });
  };
  return (
    <div>
      <div className="w-5/6 m-auto">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="">
              <label className="block text-sm font-medium leading-6 ">
                E-mail
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  ref={email}
                  className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 text-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="E-mail"
                />
              </div>
              <label className="block text-sm font-medium leading-6 ">
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  ref={pass}
                  className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 text-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 rounded-md p-2 text-white"
              onClick={() => {
                CheckUser();
              }}
            >
              Login
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 rounded-md p-2 text-white"
              onClick={() => {
                ToRegistration();
              }}
            >
              Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

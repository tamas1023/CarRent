import React, { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCont } from "../Services/AuthContext";
import { NotificationCont } from "../Services/NotificationContext";
import axios from "axios";
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
    /*
    const payments = JSON.parse(localStorage.getItem("payments"));
    const payment = [
      {
        username: username.current.value,
        money: 0,
      },
    ];
    if (!payments) {
      localStorage.setItem("payments", JSON.stringify(payment));
    } else {
      const existingPayment = payments.find(
        (payment) => payment.username === username.current.value
      );

      if (!existingPayment) {
        const updatedPayments = [...payments, ...payment];
        localStorage.setItem("payments", JSON.stringify(updatedPayments));
      }
    }
    */
    //authC.login(username.current.value);

    axios({
      method: "POST",
      url: import.meta.env.VITE_API_URL + "/auth/userLogin",
      data: {
        Email: email.current.value,
        Password: pass.current.value,
      },
    })
      .then((res) => {
        if (res.data.success) {
          notificationHandler({
            type: "success",
            message: res.data.msg,
          });
          console.log(res.headers.get("authtoken"));
          authC.login(res.data.username);
          cookies.set("authtoken", res.headers.get("authtoken"), { path: "/" });
          navigate("/autoKolcsonzes/Főoldal");
        } else {
          notificationHandler({
            type: "error",
            message: res.data.msg,
          });
        }
        //console.log(res.headers.get("authtoken"));

        //cookies.set("authtoken", res.headers.get("authtoken"), { path: "/" });
        //return res.json();
        //return res.json(); // Válasz JSON formátumban
      })

      .catch((error) => {
        // Ha bármilyen hiba történt a kérés során
        console.error("Hiba történt:", error);
        notificationHandler({
          type: "error",
          message: "Hiba történt:Login  " + error,
        });
      });
    /*
    navigate("/autoKolcsonzes/Főoldal");
    notificationHandler({ type: "success", message: "Sikeres bejelentkezés" });
    */
  };
  return (
    <div>
      <div className="w-5/6 m-auto">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="">
              <label className="block text-sm font-medium leading-6 ">
                Felhasználónév
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
                Jelszó
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  ref={pass}
                  className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 text-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Jelszó"
                />
              </div>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 rounded-md p-2 text-white"
              onClick={() => {
                CheckUser();
              }}
            >
              Bejelentkezés
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 rounded-md p-2 text-white"
              onClick={() => {
                ToRegistration();
              }}
            >
              Regisztráció
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

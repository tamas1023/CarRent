import React, { useRef, useContext } from "react";
import { AuthCont } from "../Services/AuthContext";
import { NotificationCont } from "../Services/NotificationContext";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();
  const username = useRef();
  const email = useRef();
  const pass = useRef();
  const pass2 = useRef();
  const authC = useContext(AuthCont);
  const { notificationHandler } = useContext(NotificationCont);

  //navigate("/autoKolcsonzes/Főoldal");
  const Reg = async () => {
    /*
    console.log(username.current.value);
    console.log(email.current.value);
    console.log(pass.current.value);
    console.log(pass2.current.value);
    */
    await fetch(import.meta.env.VITE_API_URL + "/auth/userReg", {
      method: "POST",
      body: JSON.stringify({
        UserName: username.current.value,
        Password: pass.current.value,
        Password2: pass2.current.value,
        Email: email.current.value,
      }),
      headers: {
        "Content-Type": "application/json", // Megmondjuk a szervernek, hogy JSON adatot küldünk
      },
    })
      .then((res) => {
        //console.log(res.ok);
        if (!res.ok) {
          notificationHandler({
            type: "error",
            message: "HTTP Hiba!",
          });
          return null;
        }

        return res.json();
        //return res.json(); // Válasz JSON formátumban
      })
      .then((data) => {
        if (data.success) {
          notificationHandler({
            type: "success",
            message: data.msg,
          });
          authC.login(username.current.value);
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
          message: "Hiba történt:" + error,
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
                Felhasználónév
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  ref={username}
                  className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 text-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Felhasználónév"
                />
              </div>
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
              <label className="block text-sm font-medium leading-6 ">
                Jelszó újra
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="password2"
                  ref={pass2}
                  className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 text-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Jelszó újra"
                />
              </div>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 rounded-md p-2 text-white"
              onClick={() => {
                Reg();
              }}
            >
              Regisztráció!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;

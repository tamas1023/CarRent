import React, { useContext, useEffect, useRef, useState } from "react";
import { NotificationCont } from "../Services/NotificationContext";
import { AuthCont } from "../Services/AuthContext";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
const cookies = new Cookies();

const Profil = () => {
  const { notificationHandler } = useContext(NotificationCont);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const pass = useRef(null);
  const pass2 = useRef(null);
  const authC = useContext(AuthCont);
  const navigate = useNavigate();

  async function getProfil() {
    await fetch(
      import.meta.env.VITE_API_URL + `/home/getProfil/${authC.user}`,
      {
        method: "GET",
        headers: { authtoken: cookies.get("authtoken") || null },
      }
    )
      .then((response) => {
        if (!response.ok) {
          notificationHandler({
            type: "error",
            message: "HTTP error!",
          });
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data.logout) {
          notificationHandler({
            type: "warning",
            message: "Please login again!",
          });
          authC.logout();
          return;
        }
        if (data.success) {
          setUserData(data.userData);
        } else {
          notificationHandler({
            type: "error",
            message: data.msg,
          });
        }
      })
      .catch((error) => {
        // Kezelni a hibát itt, például naplózás vagy felhasználó értesítése
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    getProfil();
  }, []);
  const inputs = [
    {
      név: "Username",
      name: "UserName",
      placeholder: "Username",
      type: "text",
      defaultValue: userData.UserName,
    },
    {
      név: "E-mail",
      name: "Email",
      placeholder: "E-mail",
      type: "email",
      defaultValue: userData.Email,
    },
  ];
  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const Change = async () => {
    await fetch(import.meta.env.VITE_API_URL + "/home/userUpdate", {
      method: "POST",

      body: JSON.stringify({
        UserName: userData.UserName,
        OldUserName: authC.user,
        Password: pass.current.value,
        Password2: pass2.current.value,
        Email: userData.Email,
        UserID: userData.ID,
      }),
      headers: {
        "Content-Type": "application/json", // Megmondjuk a szervernek, hogy JSON adatot küldünk
        authtoken: cookies.get("authtoken") || null,
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
        //azért mert ha az adatainkat frissítjük akkor az auth tokent is kell
        cookies.set("authtoken", res.headers.get("authtoken"), { path: "/" });
        return res.json();
      })
      .then((data) => {
        if (data.logout) {
          notificationHandler({
            type: "warning",
            message: "Please log in again!",
          });

          return;
        }
        if (data.success) {
          notificationHandler({
            type: "success",
            message: data.msg,
          });
          //Új tokent kell generálni?? Igen
          authC.login(data.user, authC.userRights);
          navigate("/autoKolcsonzes/Profil");
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
  const Modal = ({ onCancel, onConfirm }) => {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-md text-black">
          <p>Are you sure you want to change your data?</p>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 mr-2 bg-red-500 text-white rounded-md transition-colors duration-300 ease-in-out hover:bg-red-700"
              onClick={onCancel}
            >
              No
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md transition-colors duration-300 ease-in-out hover:bg-blue-700"
              onClick={onConfirm}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="bg-white rounded-md shadow-md p-6 w-96 mt-2 m-auto">
        <h1 className="text-2xl font-semibold mb-6 text-black">Profile</h1>
        <p className="text-black">
          If you don't want to change something, don't change it.
        </p>
        <br />
        <div className="grid gap-4">
          {inputs.map((input) => (
            <div className="" key={input.name}>
              {
                <div>
                  <p className="text-black">{input.név}</p>
                  <input
                    type={input.type}
                    name={input.name}
                    className=" text-black"
                    onChange={handleChange}
                    placeholder={input.placeholder}
                    defaultValue={input.defaultValue}
                  />
                </div>
              }
            </div>
          ))}
          <div>
            <p className="text-black">New password</p>
            <input
              type="password"
              name="pass"
              ref={pass}
              className=" text-black"
              placeholder="Password"
            />
          </div>
          <div>
            <p className="text-black">Password again</p>
            <input
              type="password"
              name="pass2"
              ref={pass2}
              className=" text-black"
              placeholder="Password"
            />
          </div>
          {true && (
            <button
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 rounded-md p-2 mt-4 w-full text-white"
              onClick={() => {
                setShowModal(true);
              }}
            >
              Modify
            </button>
          )}
        </div>
      </div>
      {showModal && (
        <Modal
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);

            Change();
          }}
        />
      )}
    </div>
  );
};

export default Profil;

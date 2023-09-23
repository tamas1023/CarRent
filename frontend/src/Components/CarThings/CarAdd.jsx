import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCont } from "../Services/AuthContext";
import { NotificationCont } from "../Services/NotificationContext";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function CarAdd(props) {
  const navitage = useNavigate();
  const authC = useContext(AuthCont);
  const { notificationHandler } = useContext(NotificationCont);

  const [cars, setCars] = useState();
  //JSON.parse(localStorage.getItem("cars")) || []
  const [car, SetCar] = useState({
    Name: "",
    Value: -1,
    Description: "",
    Image: "",
    Rented: false,
  });

  const generateUniqueId = () => {
    const maxId = Math.max(...cars.map((car) => car.id));
    return maxId + 1;
  };

  const inputs = [
    { név: "Car name", name: "Name", placeholder: "Car name", type: "text" },
    {
      név: "Price / hour (only number)",
      name: "Value",
      placeholder: "The price of the car is in HUF",
      type: "number",
    },
    {
      név: "Description",
      name: "Description",
      placeholder: "Car description",
      type: "text",
    },
    {
      név: "Image (URL), will be static for now",
      name: "Image",
      placeholder: "Car image",
      type: "text",
    },
  ];

  const addNewCar = async () => {
    if (!authC.isAdmin()) return;

    // ide egy beszúrás fell hogy következzen
    const updatedCar = {
      ...car,
      Image:
        "https://upload.wikimedia.org/wikipedia/commons/c/cf/Volkswagen_Beetle_.jpg",
    };
    await fetch(import.meta.env.VITE_API_URL + "/auth/carAdd", {
      method: "POST",
      body: JSON.stringify(updatedCar),
      headers: {
        "Content-Type": "application/json", // Megmondjuk a szervernek, hogy JSON adatot küldünk
        authtoken: cookies.get("authtoken") || null,
      },
    })
      .then((res) => {
        //console.log(res.ok);
        if (!res.ok) {
          notificationHandler({
            type: "error",
            message: "HTTP error!",
          });
          return null;
        }
        return res.json();
        //return res.json(); // Válasz JSON formátumban
      })
      .then((data) => {
        if (data.logout) {
          notificationHandler({
            type: "warning",
            message: "Please login again!",
          });
          authC.logout();
        }
        if (data.success) {
          notificationHandler({
            type: "success",
            message: data.msg,
          });
        } else {
          notificationHandler({
            type: "error",
            message: data.msg,
          });
        }
      })
      .catch((error) => {
        // Ha bármilyen hiba történt a kérés során
        notificationHandler({
          type: "error",
          message: "Error: " + error,
        });
      });
    authC.setNavId(0);
    navitage("/autoKolcsonzes/Főoldal");
  };

  const handleChange = (e) => {
    SetCar((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <div className="bg-white rounded-md shadow-md p-6 w-96 mt-2 m-auto">
        <h1 className="text-2xl font-semibold mb-6 text-black">Add a car</h1>
        <div className="grid gap-4">
          {inputs.map((input) => (
            <div className="" key={input.name}>
              {input.name === "Description" ? (
                <div>
                  <p className="text-black">{input.név}</p>
                  <textarea
                    name={input.name}
                    className="resize-y leading-6 text-black"
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  ></textarea>
                </div>
              ) : (
                <div>
                  <p className="text-black">{input.név}</p>
                  <input
                    type={input.type}
                    name={input.name}
                    className=" text-black"
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          ))}
          {authC.isAdmin() && (
            <button
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 rounded-md p-2 mt-4 w-full text-white"
              onClick={() => {
                addNewCar();
              }}
            >
              Add a new car
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarAdd;

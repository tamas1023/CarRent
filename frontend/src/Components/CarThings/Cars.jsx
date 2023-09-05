import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthCont } from "../Services/AuthContext";

const Cars = ({ searchText }) => {
  //throw Promise.resolve("test");

  const [cars, setCars] = useState([]);
  const authC = useContext(AuthCont);
  async function getCars() {
    const random = Math.floor(Math.random() * 5 + 1) * 1000;
    //await new Promise((resolve) => setTimeout(resolve, random));

    await fetch(import.meta.env.VITE_API_URL + "/home/getCars", {
      method: "GET",
    })
      .then((response) => {
        // Ellenőrizd a választ, hogy biztosítsd, hogy a kérés sikeres volt
        if (!response.ok) {
          throw new Error("A kérés sikertelen volt");
        }
        return response.json(); // Válasz JSON formátumban
      })
      .then((data) => {
        // Feldolgozni és menteni a kapott adatot a state-be

        setCars(data);
      })
      .catch((error) => {
        // Kezelni a hibát itt, például naplózás vagy felhasználó értesítése
        console.error("Hiba történt:", error);
      });
  }

  useEffect(() => {
    getCars();
  }, []);
  const rentableCars = cars.filter((car) => !car.Rented);
  const filteredCars = rentableCars.filter(
    (car) =>
      car.Name.toLowerCase().includes(searchText.toLowerCase()) ||
      car.Description.toLowerCase().includes(searchText.toLowerCase())
  );
  const menuHandle = () => {
    authC.setNavId(-1);
  };
  return (
    <>
      {filteredCars.map((car) => (
        <Link
          to={`/autoKolcsonzes/Auto/${car.ID}`}
          key={car.ID}
          className="border-solid border-2 border-sky-700 flex flex-col rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 p-4"
          style={{ margin: "8px" }}
          onClick={menuHandle}
        >
          <div className="flex-shrink-0">
            <img
              src={car.Image}
              alt={car.Name}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-semibold mb-2">{car.Name}</h2>
            <p className="text-slate-800 dark:text-slate-200 ">
              {car.Description}
            </p>
            <p className="text-slate-700 dark:text-slate-300  mt-2">
              Ár: {car.Value}/óra
            </p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Cars;
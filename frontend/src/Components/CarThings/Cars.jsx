import React, { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthCont } from "../Services/AuthContext";
import PaginationControls from "../Utilities/PaginationControls";

const Cars = ({ searchText }) => {
  const [cars, setCars] = useState([]);
  const authC = useContext(AuthCont);

  const [searchParams, SetSearchParams] = useSearchParams({
    page: 1,
    per_page: 9,
  });

  async function getCars() {
    await fetch(import.meta.env.VITE_API_URL + "/home/getCars", {
      method: "GET",
    })
      .then((response) => {
        // Ellenőrizd a választ, hogy biztosítsd, hogy a kérés sikeres volt
        if (!response.ok) {
          throw new Error("Error");
        }
        return response.json(); // Válasz JSON formátumban
      })
      .then((data) => {
        // Feldolgozni és menteni a kapott adatot a state-be
        setCars(data);
      })
      .catch((error) => {
        // Kezelni a hibát itt, például naplózás vagy felhasználó értesítése
        console.error("Error: ", error);
      });
  }

  useEffect(() => {
    getCars();
  }, []);
  const page = searchParams.get("page") || "1";
  const per_page = searchParams.get("per_page") || "9";

  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...

  const rentableCars = cars.filter((car) => !car.Rented);
  //azért hogy nelegyen olyan megjelenítve ami nem bérelhető
  //const entries = rentableCars.slice(start, end);

  const filteredCars = rentableCars.filter(
    (car) =>
      car.Name.toLowerCase().includes(searchText.toLowerCase()) ||
      car.Description.toLowerCase().includes(searchText.toLowerCase())
  );
  const entries = filteredCars.slice(start, end);
  const menuHandle = () => {
    authC.setNavId(-1);
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {entries.map((car) => (
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
                Price: {car.Value}/hour(HUF)
              </p>
            </div>
          </Link>
        ))}
      </div>
      <PaginationControls
        hasNextPage={end < filteredCars.length}
        hasPrevPage={start > 0}
        totalItems={filteredCars.length}
      />
    </div>
  );
};

export default Cars;

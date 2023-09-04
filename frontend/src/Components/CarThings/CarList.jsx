import React, { Suspense, lazy, useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthCont } from "../Services/AuthContext";
import { useContext } from "react";
import Loading from "../Loading/Loading";
//import Cars from "./Cars";
const Cars = lazy(() => import("./Cars"));

function CarList(props) {
  const authC = useContext(AuthCont);
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);
  //JSON.parse(localStorage.getItem("cars")) || []

  const [searchText, setSearchText] = useState("");
  /*
  async function getCars() {
    const random = Math.floor(Math.random() * 5 + 1) * 1000;
    //await new Promise((resolve) => setTimeout(resolve, random));
    await fetch(
      "http://localhost:" + import.meta.env.VITE_PORT + "/auth/teszt",
      {
        method: "GET",
      }
    )
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
        setLoading(false);
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
  */
  // Most már rendelkezésre állnak a szűrt autók

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  const menuHandle = () => {
    authC.setNavId(-1);
  };
  /*
  if (loading) {
    return <Loading />;
  }*/
  return (
    <div>
      <div className="m-auto w-10/12">
        <div className="pt-2 relative mx-auto text-gray-600">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            type="search"
            name="search"
            value={searchText}
            onChange={handleSearch}
            placeholder="Keresés..."
          />
          <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
            <svg
              className="text-gray-600 h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              viewBox="0 0 56.966 56.966"
              style={{ enableBackground: "new 0 0 56.966 56.966" }}
              xmlSpace="preserve"
              width="512px"
              height="512px"
            >
              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {/* Az autókhoz tartozó kártyák 
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
      */}
        {
          <Suspense fallback={<Loading />}>
            <Cars searchText={searchText} />
          </Suspense>
        }
      </div>
    </div>
  );
}

export default CarList;

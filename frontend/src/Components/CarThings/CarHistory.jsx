import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { AuthCont } from "../Services/AuthContext";
import { NotificationCont } from "../Services/NotificationContext";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const CarHistory = () => {
  const [history, setHistory] = useState([]);
  const authC = useContext(AuthCont);
  const { notificationHandler } = useContext(NotificationCont);
  //JSON.parse(localStorage.getItem("history")) || []
  //console.log(history);
  const formattedHistory = history.map((item) => {
    const formattedStartDate = new Date(item.StartDate).toLocaleString();
    const formattedEndDate = new Date(item.EndDate).toLocaleString();

    return {
      ...item,
      StartDate: formattedStartDate,
      EndDate: formattedEndDate,
    };
  });

  const reversedDates = [...formattedHistory].reverse();

  const [searchText, setSearchText] = useState("");
  // Szűrjük a bérelhető autókat, vagyis azokat, amelyek kiBereltE értéke false

  async function getHistory() {
    await fetch(import.meta.env.VITE_API_URL + "/auth/getHistory", {
      method: "GET",
      headers: { authtoken: cookies.get("authtoken") || null },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("A kérés sikertelen volt");
        }
        return response.json();
      })
      .then((data) => {
        //console.log(data);
        if (data.logout) {
          notificationHandler({
            type: "warning",
            message: "Jelentkezz be újra!",
          });
          authC.logout();
          return;
        }
        setHistory(data);
      })
      .catch((error) => {
        console.error("Hiba történt:", error);
      });
  }

  useEffect(() => {
    getHistory();
  }, []);
  const filteredCars = reversedDates.filter(
    (car) =>
      car.UserName.toLowerCase().includes(searchText.toLowerCase()) ||
      car.StartDate.toLowerCase().includes(searchText.toLowerCase()) ||
      car.EndDate.toLowerCase().includes(searchText.toLowerCase())
  );
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  //const updatedHistory = [...history, { ...hist, id: generateUniqueId() }];
  //localStorage.setItem("history", JSON.stringify(updatedHistory));
  /*
    Autó név,
    Autó kép,
    Autó ára,
    Esetleg leírás??,
    kezdeti dátum,
    végző dátum,
    id   a törléshez,

  
  */
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
      <div
        className="grid p-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {filteredCars.map((car) => (
          <div
            key={car.ID}
            className={`border-solid border-2 border-sky-700 flex flex-col rounded-lg overflow-hidden shadow-md ${
              history.length === 1 ? "p-4 w-80 m-auto" : "p-4 m-5"
            }`}
          >
            <p className="text-xl font-semibold mb-2 text-center">
              {car.UserName}
            </p>
            <div className="flex-shrink-0">
              <img
                src={car.Image}
                alt={car.CarName}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-semibold mb-2">{car.CarName}</h2>
              <p className="">{car.Description}</p>
              <p className=" mt-2">Ár: {car.Value}/óra</p>
              <p className="">Kezdeti dátum: {car.StartDate}</p>
              <p className=" mt-2">Vége dátum: {car.EndDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarHistory;

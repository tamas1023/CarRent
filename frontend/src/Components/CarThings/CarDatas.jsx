import React, { createContext } from "react";
import CarList from "./CarList";

const cars = [
  {
    id: 0,
    név: "VW Bogár",
    ára: 1000,
    leírás: "Ez egy csodálatos autó.",
    kép: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Volkswagen_Beetle_.jpg",
    kiBereltE: false,
  },
  {
    id: 1,
    név: "VW Bogár",
    ára: 2500,
    leírás: "Ez egy csodálatos autó, és még nagyon gyors is!",
    kép: "https://upload.wikimedia.org/wikipedia/commons/4/47/VW_Käfer_blue_1956_vr_TCE.jpg",
    kiBereltE: false,
  },
  {
    id: 2,
    név: "VW Bogár",
    ára: 1000,
    leírás: "Ez egy csodálatos autó.",
    kép: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Volkswagen_Beetle_.jpg",
    kiBereltE: false,
  },
  {
    id: 3,
    név: "VW Bogár",
    ára: 2500,
    leírás: "Ez egy csodálatos autó, és még nagyon gyors is!",
    kép: "https://upload.wikimedia.org/wikipedia/commons/4/47/VW_Käfer_blue_1956_vr_TCE.jpg",
    kiBereltE: false,
  },
];
//localStorage.removeItem("cars");
const storedCars = JSON.parse(localStorage.getItem("cars"));
//storedCars ? console.log("Elvileg van localstorage") : console.log("Nincs");
storedCars ? "" : localStorage.setItem("cars", JSON.stringify(cars));
function CarDatas(props) {
  return (
    <div>
      <CarList></CarList>
    </div>
  );
}
export default CarDatas;

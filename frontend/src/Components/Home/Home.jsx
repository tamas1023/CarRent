import React, { useContext } from "react";
import CarList from "../CarThings/CarList";
import CarDatas from "../CarThings/CarDatas";
import { Routes, Route } from "react-router-dom";
import Nope from "../404/Nope";
import SingleCar from "../CarThings/SingeCar";
import { AuthCont } from "../Services/AuthContext";
const Home = () => {
  const authC = useContext(AuthCont);

  return (
    <div className="_container content ">
      <CarDatas></CarDatas>
    </div>
  );
};

export default Home;

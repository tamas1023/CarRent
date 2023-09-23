//ide jön az összes path elhelyezés
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Nope from "../404/Nope";
import Home from "../Home/Home";
import LoggedPageHolder from "../PageItems/LoggedPageHolder";
import CarAdd from "../CarThings/CarAdd";
import SingleCar from "../CarThings/SingeCar";
import CarRent from "../CarThings/CarRent";
import Login from "../Auth/Login";
import AuthProtection from "../Protection/AuthProtection";
import AuthContext from "../Services/AuthContext";
import OutProtection from "../Protection/OutProtection";
import AdminProtection from "../Protection/AdminProtection";
import NotificationContext from "../Services/NotificationContext";
import Notification from "../Utilities/Notification";
import ToHome from "../404/ToHome";
import CarHistory from "../CarThings/CarHistory";
import Registration from "../Auth/Registration";
import Profil from "../Auth/Profil";

const MainContent = () => {
  return (
    <AuthContext>
      <NotificationContext>
        <Notification />
        <Routes>
          {/*Ezekre menne az out protection*/}

          <Route path="/auth/*" />

          {/*Ezekre menne a login protection*/}
          <Route
            path="/autoKolcsonzes/Főoldal/*"
            element={
              <LoggedPageHolder title={"Home Page"}>
                <Home />
              </LoggedPageHolder>
            }
          />
          <Route
            path="/autoKolcsonzes/Bérlés/*"
            element={
              <AuthProtection>
                <LoggedPageHolder title={"Rent"}>
                  <CarRent />
                </LoggedPageHolder>
              </AuthProtection>
            }
          />
          <Route
            path="/autoKolcsonzes/Profil/*"
            element={
              <AuthProtection>
                <LoggedPageHolder title={"Profile"}>
                  <Profil />
                </LoggedPageHolder>
              </AuthProtection>
            }
          />

          <Route
            path="/autoKolcsonzes/Auto/:autoId"
            element={
              <>
                <LoggedPageHolder title={"Single Car"}>
                  <SingleCar />
                </LoggedPageHolder>
              </>
            }
          />
          <Route
            path="/autoKolcsonzes/Hozzáadás"
            element={
              <AdminProtection>
                <LoggedPageHolder title={"Car add"}>
                  <CarAdd />
                </LoggedPageHolder>
              </AdminProtection>
            }
          />
          <Route
            path="/autoKolcsonzes/History/"
            element={
              <AdminProtection>
                <LoggedPageHolder title={"History"}>
                  <CarHistory />
                </LoggedPageHolder>
              </AdminProtection>
            }
          />
          <Route
            path="/autoKolcsonzes/Bejelentkezés"
            element={
              <OutProtection>
                <LoggedPageHolder title={"Bejelentkezés"}>
                  <Login />
                </LoggedPageHolder>
              </OutProtection>
            }
          />
          <Route
            path="/autoKolcsonzes/Regisztráció"
            element={
              <OutProtection>
                <LoggedPageHolder title={"Registration"}>
                  <Registration />
                </LoggedPageHolder>
              </OutProtection>
            }
          />
          <Route path="/autoKolcsonzes/" element={<ToHome />} />
          <Route path="/autoKolcsonzes/*" element={<Nope />} />
        </Routes>
      </NotificationContext>
    </AuthContext>
  );
};

export default MainContent;

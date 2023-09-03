import React from "react";
import { Link } from "react-router-dom";

const Nope = () => {
  return (
    <div className=" text-center p-5">
      <h1>404, az oldal nem található!</h1>
      <Link to={"/autoKolcsonzes/Főoldal"}>
        <button className="btn w-[200px]">Vissza a főoldalra</button>
      </Link>
    </div>
  );
};

export default Nope;

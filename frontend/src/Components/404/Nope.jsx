import React from "react";
import { Link } from "react-router-dom";

const Nope = () => {
  return (
    <div className=" text-center p-5">
      <h1>404, Page not found!</h1>
      <Link to={"/autoKolcsonzes/Főoldal"}>
        <button className="btn w-[200px]">Back to the main page</button>
      </Link>
    </div>
  );
};

export default Nope;

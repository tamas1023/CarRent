import React, { Suspense, lazy, useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthCont } from "../Services/AuthContext";
import { useContext } from "react";
import Loading from "../Loading/Loading";
const Cars = lazy(() => import("./Cars"));

function CarList(props) {
  const authC = useContext(AuthCont);
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);

  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

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
            placeholder="Search..."
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

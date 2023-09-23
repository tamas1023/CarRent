import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Navigate, json } from "react-router-dom";
import { AuthCont } from "../Services/AuthContext";
import { NotificationCont } from "../Services/NotificationContext";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function SingleCar(props) {
  const param = useParams();
  const id = parseInt(param.autoId);
  const navitage = useNavigate();
  const authC = useContext(AuthCont);
  const { notificationHandler } = useContext(NotificationCont);

  const [isModalOpen, setModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [content, setContent] = useState("");
  const [wantToDeleteCar, setWantToDeleteCar] = useState(-1);

  const [car, SetCar] = useState([]);
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const getItemById = async (id) => {
    const storedCar = await fetch(
      import.meta.env.VITE_API_URL + `/home/getCar/${id}`,
      {
        method: "GET",
      }
    )
      .then((response) => {
        return response.json();
      })

      .catch((error) => {
        console.error("Error: ", error);
      });

    return storedCar;
  };

  useEffect(() => {
    const fetchCarData = async () => {
      const fetchedCar = await getItemById(id);

      if (fetchedCar.Rented) {
        navitage("/autoKolcsonzes/Főoldal");
      } else {
        //console.log(fetchedCar);
        SetCar(fetchedCar);
      }
    };

    fetchCarData();
  }, [id]);
  const inputs = [
    {
      név: "Car name",
      name: "Name",
      placeholder: "Car name",
      type: "text",
      defaultValue: car.Name,
    },
    {
      név: "Price /hour(only number, and currency HUF)",
      name: "Value",
      placeholder: "The price of the car is in HUF",
      type: "number",
      defaultValue: car.Value,
    },
    {
      név: "Description",
      name: "Description",
      placeholder: "Car description",
      type: "text",
      defaultValue: car.Description,
    },
    {
      név: "Image (URL)",
      name: "Image",
      placeholder: "Car image",
      type: "text",
      defaultValue: car.Image,
    },
  ];

  const deleteCarById = async (id) => {
    if (!authC.isAdmin()) navitage("/autoKolcsonzes/Főoldal");
    await fetch(import.meta.env.VITE_API_URL + `/auth/deleteCar/${id}`, {
      method: "POST",
      headers: { authtoken: cookies.get("authtoken") || null },
    })
      .then((res) => {
        //console.log(res.ok);
        if (!res.ok) {
          notificationHandler({
            type: "error",
            message: "HTTP error!",
          });
          return null;
        }
        //itt a res.json az a következőben a data?? ha jól tudom
        return res.json();
      })
      .then((data) => {
        if (data.logout) {
          notificationHandler({
            type: "warning",
            message: "Please login again!",
          });
          authC.logout();
          return;
        }
        if (data.success) {
          notificationHandler({
            type: "success",
            message: data.msg,
          });
          navitage("/autoKolcsonzes/Főoldal");
        } else {
          notificationHandler({
            type: "error",
            message: data.msg,
          });
        }
      })
      .catch((error) => {
        notificationHandler({
          type: "error",
          message: "Error: " + error,
        });
      });
  };

  const rent = async () => {
    const currentDate = new Date();
    if (!authC.isLoggedIn) return;
    if (car.Rented) {
      return navitage("/autoKolcsonzes/Főoldal");
    }
    await fetch(import.meta.env.VITE_API_URL + `/home/rentCar`, {
      method: "POST",
      body: JSON.stringify({
        CarID: car.ID,
        UserName: authC.user,
        CurDate: currentDate,
      }),
      headers: {
        "Content-Type": "application/json",
        authtoken: cookies.get("authtoken") || null,
      },
    })
      .then((res) => {
        //console.log(res.ok);
        if (!res.ok) {
          notificationHandler({
            type: "error",
            message: "HTTP error!",
          });
          return null;
        }
        //itt a res.json az a következőben a data?? ha jól tudom
        return res.json();
      })
      .then((data) => {
        if (data.logout) {
          notificationHandler({
            type: "warning",
            message: "Please login again!",
          });
          authC.logout();
          return;
        }
        if (data.success) {
          notificationHandler({
            type: "success",
            message: data.msg,
          });
          navitage("/autoKolcsonzes/Főoldal");
        } else {
          notificationHandler({
            type: "error",
            message: data.msg,
          });
        }
      })
      .catch((error) => {
        notificationHandler({
          type: "error",
          message: "Error: " + error,
        });
      });
  };

  const handleChange = (e) => {
    SetCar((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const changeCar = async () => {
    const updatedCar = {
      ...car,
      Image:
        "https://upload.wikimedia.org/wikipedia/commons/c/cf/Volkswagen_Beetle_.jpg",
    };
    if (!authC.isAdmin()) navitage("/autoKolcsonzes/Főoldal");
    await fetch(import.meta.env.VITE_API_URL + `/auth/changeCar/${id}`, {
      method: "POST",
      body: JSON.stringify(updatedCar),
      headers: {
        "Content-Type": "application/json",
        authtoken: cookies.get("authtoken") || null,
      },
    })
      .then((res) => {
        //console.log(res.ok);
        if (!res.ok) {
          notificationHandler({
            type: "error",
            message: "HTTP error!",
          });
          return null;
        }
        //itt a res.json az a következőben a data?? ha jól tudom
        return res.json();
      })
      .then((data) => {
        if (data.logout) {
          notificationHandler({
            type: "warning",
            message: "Please login again!",
          });
          authC.logout();
          return;
        }
        if (data.success) {
          notificationHandler({
            type: "success",
            message: data.msg,
          });
          navitage("/autoKolcsonzes/Főoldal");
        } else {
          notificationHandler({
            type: "error",
            message: data.msg,
          });
        }
      })
      .catch((error) => {
        notificationHandler({
          type: "error",
          message: "Error: " + error,
        });
      });
  };
  const ConfirmModal = ({ onCancel, onConfirm }) => {
    let message;

    if (content === "rent") {
      message = "Are you sure you want to rent it out?";
    } else if (content === "delete") {
      message = "Are you sure you want to delete the car?";
    } else if (content === "change") {
      message = "Are you sure you want to apply the changes?";
    }

    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-md text-black">
          <p>{message}</p>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 mr-2 bg-red-500 text-white rounded-md transition-colors duration-300 ease-in-out hover:bg-red-700"
              onClick={onCancel}
            >
              Canel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md transition-colors duration-300 ease-in-out hover:bg-blue-700"
              onClick={onConfirm}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div key={car.ID} className="w-5/6 m-auto">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 ">
            {inputs.map((input) => (
              <div className="" key={input.name}>
                <label className="block text-sm font-medium leading-6 ">
                  {input.név}
                </label>
                {input.name === "Description" ? (
                  <textarea
                    type={input.type}
                    name={input.name}
                    id="first-name"
                    className="block w-full disabled:opacity-100 dark:disabled:text-white rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 text-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder={input.placeholder}
                    onChange={handleChange}
                    defaultValue={input.defaultValue}
                    {...(authC.isAdmin() ? {} : { disabled: true })}
                  ></textarea>
                ) : (
                  <input
                    type={input.type}
                    name={input.name}
                    id="first-name"
                    className="block w-full disabled:opacity-100 dark:disabled:text-white rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 text-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder={input.placeholder}
                    onChange={handleChange}
                    defaultValue={input.defaultValue}
                    {...(authC.isAdmin() ? {} : { disabled: true })}
                  />
                )}
              </div>
            ))}
            <button onClick={handleOpenModal}>
              <img
                src={car.Image}
                alt={car.Name}
                className="w-96 m-auto cursor-pointer"
              />
            </button>

            <div>
              {authC.isLoggedIn ? (
                <button
                  className="block w-full mb-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 rounded-md p-2 text-white"
                  onClick={() => {
                    setContent("rent");
                    setShowConfirmModal(true);
                  }}
                >
                  Car rent
                </button>
              ) : (
                ""
              )}

              {authC.isAdmin() ? (
                <div>
                  <button
                    className="block w-full mb-2 bg-green-500 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 rounded-md p-2 text-white"
                    onClick={() => {
                      setContent("change");
                      setShowConfirmModal(true);
                    }}
                  >
                    Car modification
                  </button>
                  <button
                    onClick={() => {
                      setContent("delete");
                      setShowConfirmModal(true);
                      setWantToDeleteCar(id);
                    }}
                    className="block w-full bg-red-500 hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 rounded-md p-2 text-white"
                  >
                    Delete car
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
            <div className="relative max-w-screen-sm">
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 p-2 text-white bg-gray-700 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
              >
                Close
              </button>
              <img
                src={car.Image}
                alt={car.Name}
                className="w-full"
                onClick={handleCloseModal}
              />
            </div>
          </div>
        )}
      </div>
      {showConfirmModal && (
        <ConfirmModal
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            if (content === "rent") {
              rent();
            } else if (content === "delete") {
              deleteCarById(wantToDeleteCar);
            } else if (content === "change") {
              changeCar();
            }
          }}
        />
      )}
    </>
  );
}

export default SingleCar;

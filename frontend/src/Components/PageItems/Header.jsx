import React from "react";
import { FaBars } from "react-icons/fa";

const Header = (props) => {
  const openMenu = () => {
    const nav = props.nav.current;
    nav.classList.add("open");
  };

  const closeMenu = () => {
    const nav = props.nav.current;
    nav.classList.remove("open");
  };
  return "";
  return (
    <header className="flex justify-between">
      {/*props.title || ". . ."*/}
      <FaBars
        className="me-3 cursor-pointer navBar relative top-0 right-0 z-[99999]"
        size={30}
        onClick={() => {
          if (props.nav.current.classList.contains("open")) {
            closeMenu();
            return;
          }
          openMenu();
        }}
      />
    </header>
  );
};

export default Header;

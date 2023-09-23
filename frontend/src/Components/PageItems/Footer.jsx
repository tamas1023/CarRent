import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-center items-center text-black bg-white dark:text-white dark:bg-zinc-800 ">
      <div className="copyright mb-2">
        &copy; Copyright {new Date().getFullYear()}
        <strong>
          <span> BT </span>
        </strong>
        | All rights reserved | {import.meta.env.VITE_VERSION}v
      </div>
    </footer>
  );
};

export default Footer;

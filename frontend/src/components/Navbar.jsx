import React from "react";
import { Link } from "react-router-dom";
import logo from "../constants/logo.svg";

const Navbar = () => {
  return (
    <nav className="max-w-[1300px] mx-auto py-8">
      <div className="flex flex-row justify-between text-white items-center">
        <div className="flex flex-row">
          <img src={logo} className="w-[30px] mr-1" alt="Logo" />
          <div className="font-semibold text-[24px]">GridironInsight</div>
        </div>
        <ul className="flex flex-row space-x-8 cursor-pointer text-[16px]">
          <Link to="/" className="nav__hover">
            Home
          </Link>
          <Link to="/trade" className="nav__hover">
            Trade
          </Link>
          <Link to="/roster" className="nav__hover">
            Roster
          </Link>
        </ul>
        <div className="flex flex-row space-x-4 items-center font-medium">
          <div className="">Login</div>
          <div className="blue__btn">Get Started</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

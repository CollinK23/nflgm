import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../constants/logo.svg";

const testData = [
  {
    name: "12 man league",
    picture: "https://g.espncdn.com/lm-static/ffl/images/default_logos/2.svg",
    leagueId: 2108232970,
    teamId: 2,
  },
  {
    name: "10 man league",
    picture: "https://g.espncdn.com/lm-static/ffl/images/default_logos/8.svg",
    leagueId: 952852570,
    teamId: 3,
  },
  {
    name: "10 man league",
    picture: "https://g.espncdn.com/lm-static/ffl/images/default_logos/15.svg",
    leagueId: 452886691,
    teamId: 7,
  },
  {
    name: "10 man league",
    picture: "https://g.espncdn.com/lm-static/ffl/images/default_logos/15.svg",
    leagueId: 509450303,
    teamId: 3,
  },
];

const SideNav = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [selected, setSelected] = useState("trade");

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="sticky z-10">
      <div
        className={
          expanded ? `sm:hidden fixed bg-[#00000090] w-full h-[100%] top-0` : ``
        }
      ></div>
      <div className=" flex flex-row ">
        <div className={expanded ? `block` : `hidden sm:block`}>
          {/* <div
            className={
              expanded
                ? `bg-secondary h-full fixed`
                : `bg-secondary h-full fixed inline-block`
            }
          > */}
          <div className={`fixed sidebar  ${expanded ? "expanded" : ""}`}>
            <Link
              to="/"
              className=" font-semibold text-white text-[1.3em] flex flex-row p-4 items-center"
            >
              <div className="min-w-[40px] mr-4">
                <img src={logo} className="w-[100%]"></img>
              </div>
              GridironInsight
            </Link>

            <ul className="menu p-0 menu-dropdown menu-dropdown-toggle">
              {testData.map((item) => (
                <li key={item.leagueId}>
                  <details>
                    <summary
                      className={`flex flex-row items-center w-[100%] text-white text-[16px] cursor-pointer rounded-none ${
                        selected === item.leagueId
                          ? `nav__btn__no__hover`
                          : `nav__btn`
                      }`}
                      style={{ whiteSpace: "nowrap" }}
                      onClick={() => setSelected(item.leagueId)}
                    >
                      <div className="min-w-[40px] mr-2">
                        <img src={item.picture} alt="League Logo" />
                      </div>
                      {item.name.length > 20
                        ? `${item.name.slice(0, 20)}...`
                        : item.name}
                    </summary>

                    <ul>
                      <li>
                        <Link
                          to={`/${item.leagueId}/roster/${item.teamId}`}
                          className="nav__btn p-4 rounded-none"
                        >
                          Roster
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`/${item.leagueId}/trade`}
                          className="nav__btn p-4 rounded-none"
                        >
                          Trade
                        </Link>
                      </li>
                    </ul>
                  </details>
                </li>
              ))}
            </ul>

            <div className="hidden sm:flex justify-center items-end h-[60px] text-white">
              <div onClick={toggleExpanded} className="cursor-pointer">
                {expanded ? (
                  <i className="fa-solid fa-chevron-up fa-rotate-270"></i>
                ) : (
                  <i className="fa-solid fa-bars"></i>
                )}
              </div>
            </div>
            <div
              className="flex flex-row items-center space-x-2 rounded-md  w-[250px] bottom-0 p-4"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                className="w-[40px] h-[40px] object-cover rounded-full mr-3"
                src="https://g.espncdn.com/lm-static/ffl/images/default_logos/19.svg"
                alt="Placeholder"
              />
              <div className="text-white font-medium">Placeholder</div>
            </div>
          </div>
          <div className="sm:hidden absolute w-full h-[100px] ">
            {expanded ? (
              <i
                className=" fixed right-0 fa-solid fa-xmark text-white text-[32px] p-8"
                onClick={toggleExpanded}
              ></i>
            ) : (
              <i
                className="absolute left-0 fa-solid fa-bars text-darkGrey text-[32px] p-8"
                onClick={toggleExpanded}
              ></i>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
      <div className={` sidebar2  ${expanded ? "expanded" : ""}`}></div>
    </div>
  );
};

export default SideNav;

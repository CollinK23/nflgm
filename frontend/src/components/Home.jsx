import React from "react";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <div className="bg-primary max-h-screen min-h-screen max-w-[1300px] mx-auto text-white ">
      <div className="pt-24 pb-12 text-center max-w-[1000px] mx-auto text-white font-semibold leading-tight">
        <p className="sm:text-[84px] text-[32px]">
          Your Key To Football <span className="text-blue">Excellence</span>
        </p>
        <p className="px-8 max-w-[800px] text-[1.2em] text-grey mx-auto items-center font-medium">
          Gridiron Insight is your ultimate companion for all things fantasy
          football, promising a world of unprecedented knowledge and strategy.
        </p>
      </div>
      <div className="mx-auto max-w-[150px] blue__btn font-medium">
        Get Started
      </div>
    </div>
  );
};

export default Home;

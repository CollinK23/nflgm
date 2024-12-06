import React from "react";
import { Button } from "./ui/button";
import preview from "../../../screenshots/4.jpeg";
import { BackgroundCellCore } from "./BacgkroundCell";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className=" relative max-h-screen min-h-screen mx-auto bg-background">
      <BackgroundCellCore />
      <div className="z-50 relative pointer-events-none">
        <div className="pt-24 pb-12 text-center max-w-[700px] mx-auto font-semibold leading-tight">
          <h1 className="sm:text-[64px] text-[32px] text-primary-text">
            Your Key To Football{" "}
            <span className="text-primary ">Excellence</span>
          </h1>
          <p className="px-8 max-w-[600px] mx-auto items-center font-light text-muted-foreground font-normal">
            Gridiron Insight is your ultimate companion for all things fantasy
            football, promising a world of unprecedented knowledge and strategy.
          </p>
        </div>
      </div>
      <div className="relative flex flex-row justify-center z-50 font-medium space-x-2">
        <Button onClick={() => navigate("/dashboard")}>Get Started</Button>
        <a href="https://github.com/CollinK23/nflgm/">
          <Button variant="outline">GitHub</Button>
        </a>
      </div>
      <img
        src={preview}
        className="relative z-50 rounded-lg max-w-[1000px] mx-auto mt-24 border"
      />
    </div>
  );
};

export default Home;

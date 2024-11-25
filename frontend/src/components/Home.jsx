import React from "react";
import { Button } from "./ui/button";

const Home = () => {
  return (
    <div className=" max-h-screen min-h-screen max-w-[1300px] mx-auto">
      <div className="pt-24 pb-12 text-center max-w-[700px] mx-auto font-semibold leading-tight">
        <h1 className="sm:text-[64px] text-[32px] text-primary-text">
          Your Key To Football <span className="text-primary">Excellence</span>
        </h1>
        <p className="px-8 max-w-[600px] mx-auto items-center font-light text-muted-foreground font-normal">
          Gridiron Insight is your ultimate companion for all things fantasy
          football, promising a world of unprecedented knowledge and strategy.
        </p>
      </div>
      <div className="flex flex-row justify-center font-medium space-x-2">
        <Button>Get Started</Button>
        <Button variant="outline">GitHub</Button>
      </div>
    </div>
  );
};

export default Home;

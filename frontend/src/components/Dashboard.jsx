import React from "react";

const Dashboard = () => {
  return (
    <div className="mx-auto min-h-screen sm:p-24 py-24 px-12 max-w-[1300px] w-[100%]">
      <div className="grid grid-cols-2 gap-4 text-[32px] text-white font-semibold">
        <div className="h-[300px] cardContainer">
          <div className="cardContainer">
            <div className="card">Analyze Trade</div>
          </div>
        </div>
        <div className="h-[300px] cardContainer">
          <div className="cardContainer">
            <div className="card">Compare Players</div>
          </div>
        </div>
        <div className="h-[300px] cardContainer">
          <div className="cardContainer">
            <div className="card">Sync League</div>
          </div>
        </div>
        <div className="h-[300px] cardContainer">
          <div className="cardContainer">
            <div className="card"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

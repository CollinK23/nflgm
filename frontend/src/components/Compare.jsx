import React, { useState, useEffect } from "react";
import StackedBarChart from "./StackedBarChart";

const Compare = ({ team1, team2, handlePopUp, user1, user2 }) => {
  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const defaultVal = 200;

  useEffect(() => {
    document.getElementById("my_modal_4").showModal();
    const fetchPlayerData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/compare");
        const data = await response.json();

        const matchingPlayersData1 = [];
        const matchingPlayersData2 = [];

        for (const espnId of team1.keys()) {
          const entry = data.players[espnId];

          if (entry) {
            matchingPlayersData1.push({
              tradeData: entry,
              espnData: team1.get(espnId),
            });
          }
        }

        for (const espnId of team2.keys()) {
          const entry = data.players[espnId];

          if (entry) {
            matchingPlayersData2.push({
              tradeData: entry,
              espnData: team2.get(espnId),
            });
          }
        }

        setOutgoing(matchingPlayersData1);
        setIncoming(matchingPlayersData2);
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchPlayerData();
  }, [team1, team2]);

  const calculateTotalRedraftValue = (players) => {
    let totalVal = 0;

    for (let i = 0; i < players.length; i++) {
      if (
        players[i] !== undefined &&
        players[i].tradeData.redraftValue > defaultVal
      ) {
        totalVal += players[i].tradeData.redraftValue;
      } else {
        totalVal += defaultVal;
      }
    }

    return totalVal;
  };

  const outgoingTotal = (calculateTotalRedraftValue(outgoing) / 200).toFixed(2);
  const incomingTotal = (calculateTotalRedraftValue(incoming) / 200).toFixed(2);

  if (!outgoing || !incoming) {
    return <div className="min-h-screen py-24">Calculating...</div>;
  }
  return (
    <div className="">
      <dialog id="my_modal_4" className="modal">
        <div className="bg-secondary modal-box w-11/12 max-w-5xl">
          <div className="stats flex justify-center bg-secondary">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img src={user1.logo} className="absolute"></img>
                  </div>
                </div>
              </div>
              <div
                className={`stat-value ${
                  outgoingTotal >= incomingTotal ? "text-blue" : ""
                }`}
              >
                {outgoingTotal}
              </div>
              <div className="stat-title">Outgoing Value</div>
            </div>
            <div className="stat">
              <div className="stat-figure text-secondary">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img src={user2.logo} className="absolute"></img>
                  </div>
                </div>
              </div>
              <div
                className={`stat-value ${
                  incomingTotal >= outgoingTotal ? "text-blue" : ""
                }`}
              >
                {incomingTotal}
              </div>
              <div className="stat-title">Incoming Value</div>
            </div>
          </div>

          <StackedBarChart
            outgoing={outgoing}
            incoming={incoming}
            outgoingTotal={outgoingTotal}
            incomingTotal={incomingTotal}
          />
          <div className="modal-action">
            <button className="text-white blue__btn" onClick={handlePopUp}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Compare;

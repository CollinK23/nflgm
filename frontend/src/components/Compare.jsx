import React, { useState, useEffect } from "react";
import StackedBarChart from "./StackedBarChart";

const Compare = ({ team1, team2, handlePopUp }) => {
  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const defaultVal = 200;

  useEffect(() => {
    document.getElementById("my_modal_4").showModal();
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(
          "https://api.fantasycalc.com/values/current?isDynasty=true&numQbs=1&numTeams=12&ppr=1"
        );
        const data = await response.json();

        const matchingPlayersData1 = [];
        const matchingPlayersData2 = [];

        data.forEach((entry) => {
          if (team1.has(entry.player.espnId)) {
            matchingPlayersData1.push({
              tradeData: entry,
              espnData: team1.get(entry.player.espnId),
            });
          }
          if (team2.has(entry.player.espnId)) {
            matchingPlayersData2.push({
              tradeData: entry,
              espnData: team2.get(entry.player.espnId),
            });
          }
        });

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
      if (players[i] !== undefined) {
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
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Click the button below to close</p>

          <div>
            <p>
              Total RedraftValue Team 1:{" "}
              {(calculateTotalRedraftValue(outgoing) / 200).toFixed(2)}
            </p>
            <p>
              Total RedraftValue Team 2:{" "}
              {(calculateTotalRedraftValue(incoming) / 200).toFixed(2)}
            </p>
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

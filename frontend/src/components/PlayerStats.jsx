import React, { useState, useEffect } from "react";
import {
  mapPositions,
  injuries,
  teams,
  teamColors,
} from "../constants/conversions";

const PlayerStats = ({ player, handlePopUp }) => {
  const [playerData, setPlayerData] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/stats/${player.espnId}`
        );
        const data = await response.json();

        setPlayerData(data);
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchPlayerData();
  }, []);

  if (!playerData) {
    return (
      <div className="min-h-screen mx-auto">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <dialog id="my_modal_4" className="modal modal-open">
        <div className="bg-secondary modal-box w-11/12 max-w-5xl p-0">
          <div className="flex flex-row rounded-md">
            <div className="h-[203px] w-[280px]">
              {player.espnId >= 0 ? (
                <div className="relative">
                  <img
                    src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.espnId}.png&w=280&h=203`}
                    alt={player.name}
                    className="absolute top-0 z-10"
                  />
                  <div
                    className="h-[203px] w-[280px] absolute top-0 z-0 transform skew-x-[-30deg]"
                    style={{
                      backgroundImage: `linear-gradient(to top, ${
                        teamColors[player.teamId]
                      }b5,  ${teamColors[player.teamId]}30, #00000000)`,
                    }}
                  ></div>
                </div>
              ) : (
                <img
                  src={`https://a.espncdn.com/i/teamlogos/nfl/500/${player.maybeTeam}.png`}
                  alt={player.maybeTeam}
                />
              )}
            </div>
            <div className="flex flex-col p-8">
              <div className="font-semibold text-[20px]">{player.name}</div>
              <div>{player.maybeTeam}</div>
              <div>{player.defaultPosition}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead className="bg-darkGrey">
                <th></th>
                <th>Opp</th>
                <th>Score</th>
                {playerData.labels.map((stat, i) => (
                  <th key={i}>{stat}</th>
                ))}
                <th></th>
              </thead>
              <tbody>
                {playerData.games.map((game, i) => (
                  <tr
                    key={i}
                    className={`border-b border-darkGrey ${
                      game[1].atVs.length > 4 ? "bg-darkGrey" : "bg-secondary"
                    }`}
                  >
                    <th></th>
                    <th className="flex flex-row items-center">
                      {game[1].atVs}{" "}
                      {game[1].opponentId !== null && teams[game[1].opponentId]}
                    </th>
                    <th
                      className={`${
                        game[1].gameResult == "W" ? "text-green" : "text-red"
                      } whitespace-nowrap`}
                    >
                      {game[1].gameResult}{" "}
                      <span className="text-white">{game[1].score}</span>
                    </th>
                    {game[1].stats
                      ? game[1].stats.map((stat, j) => <th>{stat}</th>)
                      : null}
                    <th></th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="modal-action p-4">
            <button className="text-white blue__btn" onClick={handlePopUp}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PlayerStats;

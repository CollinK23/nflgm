import React, { useState, useEffect } from "react";
// import PlayerCard from "./PlayerCard";
import Players from "./Players";
import { useParams } from "react-router-dom";
import Compare from "./Compare";

const Trade = () => {
  const { id } = useParams();
  const [rosterData, setRosterData] = useState(null);
  const [selectedTeam1, setSelectedTeam1] = useState(null);
  const [selectedTeam2, setSelectedTeam2] = useState(null);
  const [week, setWeek] = useState(0);
  const [tradePlayers1, setTradePlayers1] = useState(new Map());
  const [tradePlayers2, setTradePlayers2] = useState(new Map());
  const [analyze, setAnalyze] = useState(false);

  const handlePlayerSelection = (espnId, team, player) => {
    if (team) {
      setTradePlayers1((prevTradePlayers1) => {
        const newMap = new Map(prevTradePlayers1);
        newMap.set(espnId, player);
        return newMap;
      });
    } else {
      setTradePlayers2((prevTradePlayers2) => {
        const newMap = new Map(prevTradePlayers2);
        newMap.set(espnId, player);
        return newMap;
      });
    }
  };
  const handlePopUp = () => {
    setAnalyze(!analyze);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://fantasy.espn.com/apis/v3/games/ffl/seasons/2023/segments/0/leagues/${id}?viewmMatchup`
        );
        const data = await response.json();
        console.log(data);
        setRosterData(data);
        setWeek(data.scoringPeriodId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  if (!rosterData) {
    return <div className="min-h-screen py-24">Loading...</div>;
  }
  return (
    <div className="min-h-screen mx-auto py-24">
      {analyze ? (
        <Compare
          team1={tradePlayers1}
          team2={tradePlayers2}
          handlePopUp={handlePopUp}
        ></Compare>
      ) : null}

      <button className="blue__btn text-white" onClick={handlePopUp}>
        Analyze Trade
      </button>

      <div className="grid grid-cols-2 gap-x-16">
        <select
          id="teams"
          onChange={(e) => setSelectedTeam1(e.target.value)}
          className="select w-full max-w-xs bg-secondary"
        >
          <option disabled selected>
            Select a Team
          </option>
          {rosterData.teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.abbrev}
            </option>
          ))}
        </select>
        <select
          id="teams"
          onChange={(e) => setSelectedTeam2(e.target.value)}
          className="select w-full max-w-xs bg-secondary"
        >
          <option disabled selected>
            Select a Team
          </option>
          {rosterData.teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.abbrev}
            </option>
          ))}
        </select>

        {selectedTeam1 ? (
          <Players
            teamId={selectedTeam1}
            week={week}
            compare={true}
            playerSelector={handlePlayerSelection}
            team={1}
          ></Players>
        ) : (
          <div className="flex items-center justify-center h-[500px]">
            Select a team to view roster
          </div>
        )}
        {selectedTeam2 ? (
          <Players
            teamId={selectedTeam2}
            week={week}
            compare={true}
            playerSelector={handlePlayerSelection}
            team={0}
          ></Players>
        ) : (
          <div className="flex items-center justify-center h-[500px]">
            Select a team to view roster
          </div>
        )}
      </div>
    </div>
  );
};

export default Trade;

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
  const [userSelected1, setUserSelected1] = useState(null);
  const [userSelected2, setUserSelected2] = useState(null);

  const handlePlayerSelection = (espnId, team, player) => {
    const setTradePlayers = team ? setTradePlayers1 : setTradePlayers2;

    setTradePlayers((prevTradePlayers) => {
      const newMap = new Map(prevTradePlayers);

      // Check if player is already selected, then remove
      if (newMap.has(espnId)) {
        newMap.delete(espnId);
      } else {
        // Add the player to the map
        newMap.set(espnId, player);
      }

      return newMap;
    });
  };

  const handlePlayerReset = (team) => {
    const setTradePlayers = team ? setTradePlayers1 : setTradePlayers2;

    setTradePlayers(new Map());
  };

  const handleUserSelection = (userSelected, team) => {
    if (team) {
      setUserSelected1(userSelected);
    } else {
      setUserSelected2(userSelected);
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
          user1={userSelected1}
          user2={userSelected2}
        ></Compare>
      ) : null}

      <button
        className="blue__btn text-white my-8"
        type="submit"
        onClick={handlePopUp}
      >
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
            userSelector={handleUserSelection}
            playerReset={handlePlayerReset}
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
            userSelector={handleUserSelection}
            team={0}
            playerReset={handlePlayerReset}
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

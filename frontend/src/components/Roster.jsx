import React, { useState, useEffect } from "react";
import Players from "./Players";
import { useParams, useLocation } from "react-router-dom";
import Loading from "./Loading/Loading";

const Roster = () => {
  const location = useLocation();
  const { id, teamId } = useParams();
  const [rosterData, setRosterData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(teamId);
  const [week, setWeek] = useState(0);

  useEffect(() => {
    setSelectedTeam(teamId);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/2023/segments/0/leagues/${id}?viewmMatchup`
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
  }, [location.pathname]);

  if (!rosterData) {
    return (
      <div className="min-h-screen mx-auto">
        <Loading />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen sm:p-24 py-24 px-12 max-w-[1300px] w-[100%]">
      <select
        id="teams"
        onChange={(e) => setSelectedTeam(e.target.value)}
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
      {selectedTeam ? (
        <Players teamId={selectedTeam} week={week} compare={false}></Players>
      ) : (
        <div className="flex items-center justify-center h-[500px]">
          Select a team to view roster
        </div>
      )}
    </div>
  );
};

export default Roster;

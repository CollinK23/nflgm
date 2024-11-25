import React, { useState, useEffect } from "react";
import Players from "./Players";
import { useLocation } from "react-router-dom";
import Loading from "./Loading/Loading";
import { Card } from "./ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import TeamOverview from "./Cards/TeamOverview";
import { useSelector } from "react-redux";

const Roster = ({ id, compare, team, teamSelected }) => {
  const location = useLocation();
  const [rosterData, setRosterData] = useState(null);
  const [teamId, setTeamId] = useState(team || 0);

  const espn_s2 = useSelector(
    (state) =>
      state.user.leagues.find((league) => league.groupId == parseInt(id))
        .espn_s2
  );
  const swid = useSelector((state) => state.user.swid);

  const handleChange = (value) => {
    setTeamId(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (swid && espn_s2) {
          response = await fetch(
            `http://127.0.0.1:8000/league/?swid=${swid}&espn_s2=${espn_s2}&url=https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/2024/segments/0/leagues/${id}?viewmMatchup`
          );
        } else {
          response = await fetch(
            `https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/2024/segments/0/leagues/${id}?viewmMatchup`
          );
        }

        const data = await response.json();
        setRosterData(data);
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
    <Card className="mx-auto min-h-screen sm:p-24 py-24 px-12 max-w-[1300px] w-[100%]">
      <Select
        id="teams"
        onValueChange={handleChange}
        className="select w-full max-w-xs bg-secondary"
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a Team"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          {rosterData?.teams?.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.abbrev}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="py-4">
        <TeamOverview id={id} teamId={teamId}></TeamOverview>
      </div>
      {teamId > 0 ? (
        <Players
          id={id}
          teamId={teamId}
          compare={compare}
          teamSelected={teamSelected}
        />
      ) : (
        <div className="flex items-center justify-center h-[500px]">
          Select a team to view roster
        </div>
      )}
    </Card>
  );
};

export default Roster;

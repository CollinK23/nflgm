import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { mapPositions } from "../constants/conversions";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { useSelector } from "react-redux";
import { fetchRosterData, RankingsTable } from "./helpers";
import { Checkbox } from "../components/ui/checkbox";
import { useLocation } from "react-router-dom";

export const WeeklyRankings = () => {
  const location = useLocation();

  const liveWeek = useSelector((state) => state.user.week);
  const liveYear = useSelector((state) => state.user.season);
  const userLeagues = useSelector((state) => state.user.leagues);
  const swid = useSelector((state) => state.user.swid);

  const [playerData, setPlayerData] = useState(null);
  const [slotId, setSlotId] = useState("0,2,23,4,6");
  const [scoring, setScoring] = useState("PPR");
  const [week, setWeek] = useState(liveWeek + 1);
  const [totals, setTotals] = useState("true");
  const [offset, setOffset] = useState(0);
  const [showTiers, setShowTiers] = useState(false);
  const [rosterData, setRosterData] = useState(null);
  const [showUserRosterOnly, setShowUserRosterOnly] = useState(true);
  const [highlightUserRoster, setHighlightUserRoster] = useState(false);
  const [leagueId, setLeagueId] = useState(null);
  const [teamId, setTeamId] = useState(null);

  const checkPath = () => {
    const pathSegments = location.pathname.replace(/^\/+|\/+$/g, "").split("/");

    if (pathSegments[1] === "rankings" || pathSegments.length === 3) {
      setShowUserRosterOnly(false);
      setHighlightUserRoster(false);
      setLeagueId(null);
      setTeamId(null);
      return false;
    } else {
      setShowUserRosterOnly(true);
      setHighlightUserRoster(true);
      setLeagueId(pathSegments[1]);
      setTeamId(pathSegments[2]);
      return true;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (checkPath() && leagueId) {
        const league = userLeagues.find(
          (league) => league.groupId === parseInt(leagueId)
        );
        const espn_s2 = league?.espn_s2;

        const rosterData = await fetchRosterData(
          leagueId,
          swid,
          espn_s2,
          teamId
        );
        setRosterData(rosterData);
      }
    };

    fetchData();
  }, [location.pathname, leagueId, teamId, swid, userLeagues]);

  const fetchPlayerData = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/rankings?slotId=${slotId}&scoring=${scoring}&week=${week}&totals=${totals}&offset=${offset}`
      );
      const data = await response.json();
      setPlayerData(data);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };
  useEffect(() => {
    fetchPlayerData();
  }, [slotId, scoring, week, totals, offset]);

  if (!playerData) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <div className="flex flex-row gap-2">
            <Select onValueChange={(e) => setSlotId(e)} value={slotId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"0,2,23,4,6"}>
                    All Offensive Players
                  </SelectItem>
                  {Object.entries(mapPositions).map(([key, value]) => {
                    return ![21, 20].includes(Number(key)) ? (
                      <SelectItem key={key} value={key}>
                        {value.length > 15 ? `${value.slice(0, 15)}...` : value}
                      </SelectItem>
                    ) : null;
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={(e) => setScoring(e)} value={scoring}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Scoring" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"PPR"}>PPR</SelectItem>
                  <SelectItem value={"STANDARD"}>Standard Non-PPR</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(e) => {
                if (liveWeek + 1 == e) {
                  setTotals("true");
                } else {
                  setTotals("false");
                }
                setWeek(e);
              }}
              value={week}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Scoring" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={liveWeek + 1}>2024 Stats</SelectItem>
                  {Array.from({ length: liveWeek }, (_, index) => (
                    <SelectItem key={liveWeek - index} value={liveWeek - index}>
                      Week {liveWeek - index}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={showTiers}
                onClick={() => setShowTiers(!showTiers)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show Tiers
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={highlightUserRoster}
                onClick={() => setHighlightUserRoster(!highlightUserRoster)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                My Team
              </label>
            </div>
          </div>
          <RankingsTable
            totals={totals}
            data={playerData}
            position={slotId}
            showTiers={showTiers}
            rosterData={rosterData}
            highlightUserRoster={highlightUserRoster}
          />
        </CardHeader>
      </CardContent>
    </Card>
  );
};

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { Button } from "../ui/button";
import { addSuffix } from "../../../src/constants/conversions";

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../Loading/Loading";
import Standings from "./Standings";
import TopPerformers from "./TopPerformers";
import { useDispatch, useSelector } from "react-redux";
import { updateEspnS2, updateSwid } from "../../../src/features/user/userSlice";

export default function TeamOverview({
  footerContent,
  id,
  teamId,
  showStandings = false,
  showTopPerformers = false,
}) {
  const location = useLocation();
  const dispatch = useDispatch();

  const espn_s2 = useSelector(
    (state) =>
      state.user.leagues.find((league) => league.groupId == parseInt(id))
        ?.espn_s2
  );
  const swid = useSelector((state) => state.user.swid);

  const [rosterData, setRosterData] = useState(null);
  const [teams, setTeams] = useState(null);
  const [newTeamId, setNewTeamId] = useState(teamId);

  const [tempEspn_s2, setTempEspn_s2] = useState(espn_s2);
  const [tempSwid, setTempSwid] = useState(swid);
  const [week, setWeek] = useState(0);
  const [privateLeague, setPrivateLeague] = useState(false);

  useEffect(() => {
    const fetchRosterData = async () => {
      try {
        let response;
        if (swid && espn_s2) {
          response = await fetch(
            `http://127.0.0.1:8000/league/?swid=${swid}&espn_s2=${espn_s2}&url=https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/2024/segments/0/leagues/${id}?rosterForTeamId=${teamId}%26view=mTeam%26view=mRoster`
          );
        } else {
          response = await fetch(
            `http://127.0.0.1:8000/league/?url=https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/2024/segments/0/leagues/${id}?rosterForTeamId=${teamId}%26view=mTeam%26view=mRoster`
          );
        }

        if (response.status === 500) {
          setPrivateLeague(true);
        }

        const data = await response.json();
        const teamWithRoster = data.teams.find((team) => team.roster);
        const idx = data.teams.indexOf(teamWithRoster);
        setWeek(data.scoringPeriodId);
        setNewTeamId(idx);

        setRosterData(data.teams[idx]);
        setTeams(data.teams);
      } catch (error) {
        setRosterData(undefined);
      }
    };

    fetchRosterData();
  }, [location.pathname, id, teamId, swid, espn_s2]);

  if (location.pathname.endsWith("/dashboard") && swid) {
    return (
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3">
          <CardTitle>Select A League</CardTitle>
          <CardDescription className=" leading-relaxed">
            Select a league to view detailed stats, player rankings, and
            performance updates.
          </CardDescription>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    );
  }

  if (!rosterData && (!swid || !espn_s2) && privateLeague) {
    return (
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3">
          <CardTitle>
            <i class="fa-solid fa-lock pr-2"></i>This is a Private League
          </CardTitle>
          <CardDescription className="max-w-lg leading-relaxed">
            This is a private league. Please enter your espn_s2 and SWID, which
            can be found in your cookies within the ESPN app.
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Espn_s2</Label>
                <Input
                  id="espnid"
                  value={tempEspn_s2}
                  className="col-span-3"
                  onChange={(e) => {
                    setTempEspn_s2(e.target.value);
                  }}
                />
                <Label htmlFor="name">SWID</Label>
                <Input
                  id="swid"
                  value={tempSwid}
                  className="col-span-3"
                  onChange={(e) => setTempSwid(e.target.value)}
                />
                <Button
                  type="submit"
                  onClick={() => {
                    dispatch(
                      updateEspnS2({ espn_s2: tempEspn_s2, espnId: id })
                    );
                    dispatch(updateSwid(tempSwid));
                  }}
                >
                  Save changes
                </Button>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    );
  }

  if (!rosterData) {
    return (
      <div className="min-h-screen mx-auto">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-4">
          <CardTitle>
            <div className="flex flex-row space-x-4 items-center">
              <div className="w-[50px] h-[50px] relative">
                <img src={rosterData.logo} className="absolute"></img>
              </div>
              <div>
                <h2 className="text-[24px] font-semibold">{rosterData.name}</h2>
                <h2 className="text-[16px] font-medium text-grey">
                  {rosterData.record.overall.wins}-
                  {rosterData.record.overall.losses}-
                  {rosterData.record.overall.ties},{" "}
                  {addSuffix(rosterData.playoffSeed)}
                </h2>
              </div>
            </div>
          </CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed"></CardDescription>
        </CardHeader>
        <CardFooter>{footerContent}</CardFooter>
      </Card>

      <div
        className={
          showStandings || showTopPerformers
            ? "grid auto-rows-min gap-4 md:grid-cols-2 h-[450px]"
            : ""
        }
      >
        {showStandings && (
          <Standings
            teams={teams}
            teamId={teamId}
            className="overflow-x-auto h-[450px]"
          />
        )}
        {showTopPerformers && (
          <TopPerformers team={teams[newTeamId]} week={week} />
        )}
      </div>
    </div>
  );
}

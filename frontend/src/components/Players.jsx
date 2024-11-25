import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import React, { useState, useEffect, useMemo, useCallback } from "react";

import {
  teams,
  mapPositions,
  mapDefaultPositions,
} from "../constants/conversions";
import { PlayerStats } from "./PlayerStats";
import Loading from "./Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "./ui/checkbox";
import { addTradeSelections, selectPlayer } from "../features/user/userSlice";

export default function Players({ id, teamId, teamSelected, compare }) {
  const dispatch = useDispatch();
  const [rosterData, setRosterData] = useState(null);
  const [week, setWeek] = useState(0);
  const espn_s2 = useSelector(
    (state) =>
      state.user.leagues.find((league) => league.groupId == parseInt(id))
        .espn_s2
  );
  const swid = useSelector((state) => state.user.swid);
  const [checks, setChecks] = useState([]);

  const projectedStatsCache = useMemo(() => ({}), []);
  const weekStatsCache = useMemo(() => ({}), []);

  const projectedWeekStats = useCallback(
    (player) => {
      if (projectedStatsCache[player.espnId]) {
        return projectedStatsCache[player.espnId];
      }
      const result = player.stats.find(
        (stat) => stat.scoringPeriodId === player.week && stat.proTeamId === 0
      );
      projectedStatsCache[player.espnId] = result;
      return result;
    },
    [projectedStatsCache]
  );

  const weekStats = useCallback(
    (player) => {
      if (weekStatsCache[player.espnId]) {
        return weekStatsCache[player.espnId];
      }
      const result = player.stats.find(
        (stat) => stat.scoringPeriodId === player.week && stat.proTeamId !== 0
      );
      weekStatsCache[player.espnId] = result;
      return result;
    },
    [weekStatsCache]
  );

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
        setWeek(data.scoringPeriodId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, swid, espn_s2]);

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
            `https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/2024/segments/0/leagues/${id}?rosterForTeamId=${teamId}&view=mTeam&view=mRoster`
          );
        }

        const data = await response.json();
        setRosterData(data.teams.find((team) => team.roster));
        setChecks(new Array(rosterData?.roster?.entries.length).fill(false));
        if (teamSelected != undefined) {
          dispatch(
            addTradeSelections({
              teamSelected: teamSelected,
              team: data.teams[teamId - 1],
            })
          );
        }
      } catch (error) {
        console.error("Error fetching roster data:", error);
      }
    };

    fetchRosterData();
  }, [teamId, id, swid, espn_s2]);

  if (!rosterData || !week) {
    return <Loading></Loading>;
  }

  const playerData = [...(rosterData?.roster?.entries || [])]
    .sort((a, b) => {
      const positionOrder = {
        QB: 1,
        RB: 2,
        WR: 3,
        TE: 4,
        FLEX: 5,
        "D/ST": 6,
        K: 7,
        Bench: 8,
        IR: 9,
      };

      const positionA = mapPositions[a.lineupSlotId];
      const positionB = mapPositions[b.lineupSlotId];

      return positionOrder[positionA] - positionOrder[positionB];
    })
    .map((player, i) => ({
      name: player.playerPoolEntry.player.fullName,
      espnId: player.playerPoolEntry.player.id,
      maybeTeam: teams[player.playerPoolEntry.player.proTeamId],
      teamId: player.playerPoolEntry.player.proTeamId,
      position: mapPositions[player.lineupSlotId],
      defaultPosition:
        mapDefaultPositions[player.playerPoolEntry.player.defaultPositionId],
      stats: player.playerPoolEntry.player.stats,
      week: week,
      lineupSlotId: player.lineupSlotId,
      injuryStatus: player.playerPoolEntry.player.injuryStatus,
      firstName: player.playerPoolEntry.player.firstName,
      lastName: player.playerPoolEntry.player.lastName,
    }));

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {compare && <TableHead></TableHead>}
            <TableHead className="w-[100px]">POS</TableHead>
            <TableHead>PLAYER</TableHead>
            {!compare && <TableHead className="text-right">PROJ</TableHead>}
            {!compare && <TableHead className="text-right">SCORE</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {playerData.map((player, i) => (
            <TableRow key={i}>
              {compare && (
                <TableCell>
                  <Checkbox
                    checked={checks[i]}
                    onCheckedChange={() => {
                      setChecks((prevChecks) => {
                        const newChecks = [...prevChecks];
                        newChecks[i] = !newChecks[i];
                        return newChecks;
                      });
                      dispatch(
                        selectPlayer({
                          player: player,
                          teamSelected: teamSelected,
                        })
                      );
                    }}
                  />
                </TableCell>
              )}
              <TableCell
                className={`${
                  mapPositions[player.lineupSlotId] == "Bench" ||
                  mapPositions[player.lineupSlotId] == "IR"
                    ? "text-gray-500"
                    : ""
                } font-semibold`}
              >
                {mapPositions[player.lineupSlotId]}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center gap-3">
                  <div className="mask w-14 h-14 flex items-center">
                    {player.espnId >= 0 ? (
                      <img
                        src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.espnId}.png&w=350&h=254`}
                        alt={player.name}
                      />
                    ) : (
                      <img
                        src={`https://a.espncdn.com/i/teamlogos/nfl/500/${player.maybeTeam}.png`}
                        alt={player.maybeTeam}
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold cursor-pointer hover:underline">
                      <PlayerStats player={player} key={player.espnId} />
                    </div>
                    <div className="text-sm opacity-50 text-left">
                      {player.maybeTeam}
                    </div>
                  </div>
                </div>
              </TableCell>
              {!compare && (
                <TableCell className="text-right">
                  {projectedWeekStats(player)
                    ? projectedWeekStats(player).appliedTotal.toFixed(2)
                    : "-"}
                </TableCell>
              )}
              {!compare && (
                <TableCell className="text-right">
                  {weekStats(player)
                    ? weekStats(player).appliedTotal.toFixed(2)
                    : "-"}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

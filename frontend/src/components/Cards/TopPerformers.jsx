import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import React, { useCallback, useMemo } from "react";
import {
  teamColors,
  mapDefaultPositions,
  teams,
} from "../../constants/conversions";
import { PlayerStats } from "../PlayerStats";

export default function TopPerformers({ team, className, week }) {
  const weekStatsCache = useMemo(() => ({}), []);
  const weekStats = useCallback(
    (player) => {
      if (weekStatsCache[player.id]) {
        return weekStatsCache[player.id];
      }
      const result = player.stats?.find(
        (stat) => stat.scoringPeriodId === week && stat.proTeamId !== 0
      ) || { appliedTotal: 0 };
      weekStatsCache[player.id] = result;
      return result;
    },
    [weekStatsCache]
  );

  return (
    <Card className={` ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle>Weekly Top Performers</CardTitle>
        <CardDescription className=" text-balance leading-relaxed ">
          <div className="space-y-4 py-4">
            {team?.roster?.entries
              .slice()
              .sort(
                (a, b) =>
                  weekStats(b.playerPoolEntry.player)?.appliedTotal.toFixed(2) -
                  weekStats(a.playerPoolEntry.player)?.appliedTotal.toFixed(2)
              )
              .slice(0, 3)
              .map((player) => (
                <Card className="flex flex-row overflow-x-hidden w-full">
                  <div className="h-[101px] w-[140px] w-[30%]">
                    {player.playerId >= 0 ? (
                      <div className="relative">
                        <img
                          src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.playerId}.png&w=140&h=101`}
                          alt={player.playerPoolEntry.player.fullName}
                          className="absolute top-0 z-10"
                        />
                        <div
                          className="h-[101px] w-[140px] absolute top-0 z-0 transform skew-x-[-30deg]"
                          style={{
                            backgroundImage: `linear-gradient(to top, ${
                              teamColors[
                                player.playerPoolEntry.player.proTeamId
                              ]
                            }b5,  ${
                              teamColors[
                                player.playerPoolEntry.player.proTeamId
                              ]
                            }30, #00000000)`,
                          }}
                        ></div>
                      </div>
                    ) : (
                      <img
                        src={`https://a.espncdn.com/i/teamlogos/nfl/500/${
                          teams[player.playerPoolEntry.player.proTeamId]
                        }.png`}
                        alt={teams[player.playerPoolEntry.player.proTeamId]}
                        className="h-[101px] mx-auto"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between w-[70%] pr-4">
                    <div className="flex flex-col justify-center">
                      <div className="font-semibold text-[16px]">
                        <PlayerStats
                          player={{
                            espnId: player.playerPoolEntry.id,
                            name: player.playerPoolEntry.player.fullName,
                            injuryStatus:
                              player.playerPoolEntry.player.injuryStatus,
                            teamId: player.playerPoolEntry.player.proTeamId,
                            maybeTeam:
                              teams[player.playerPoolEntry.player.proTeamId],
                            defaultPosition:
                              mapDefaultPositions[
                                player.playerPoolEntry.player.defaultPositionId
                              ],
                          }}
                        />
                      </div>
                      <div className="text-[14px]">
                        Team: {teams[player.playerPoolEntry.player.proTeamId]}
                      </div>
                      <div className="text-[14px]">
                        Pos:{" "}
                        {
                          mapDefaultPositions[
                            player.playerPoolEntry.player.defaultPositionId
                          ]
                        }
                      </div>
                    </div>
                    <div className="text-right text-[18px] font-bold">
                      {weekStats(
                        player.playerPoolEntry.player
                      )?.appliedTotal.toFixed(2)}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

import React, { useState, useEffect } from "react";
import RosteredPlayers from "./RosteredPlayers";
import {
  teams,
  mapPositions,
  addSuffix,
  mapDefaultPositions,
} from "../constants/conversions";
import { useParams, useLocation } from "react-router-dom";
import PlayerStats from "./PlayerStats";

const Players = ({
  teamId,
  week,
  compare,
  playerSelector,
  team,
  userSelector,
  playerReset,
}) => {
  const { id } = useParams();
  const location = useLocation();
  const [rosterData, setRosterData] = useState(null);
  const [viewStats, setViewStats] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const fetchRosterData = async () => {
      try {
        const response = await fetch(
          `https://fantasy.espn.com/apis/v3/games/ffl/seasons/2023/segments/0/leagues/${id}?rosterForTeamId=${teamId}&view=mTeam&view=mRoster`
        );
        const data = await response.json();
        setRosterData(data.teams[teamId - 1]);

        if (userSelector) {
          userSelector(data.teams[teamId - 1], team);
        }
        if (playerReset) {
          playerReset(team);
        }
      } catch (error) {
        console.error("Error fetching roster data:", error);
      }
    };

    // Only fetch data if teamId is provided
    if (teamId) {
      fetchRosterData();
    }
  }, [teamId, location.pathname]);

  if (!rosterData) {
    return <div>Loading roster data...</div>;
  }

  const handleStats = () => {
    setViewStats(!viewStats);
  };

  const handleSelectedStats = (player) => {
    handleStats();
    setSelectedPlayer(player);
  };

  // Render the roster data as needed
  return (
    <div className="text-white">
      {viewStats ? (
        <PlayerStats player={selectedPlayer} handlePopUp={handleStats} />
      ) : null}
      <div className="bg-primary p-8">
        <div className="flex flex-row space-x-4 items-center">
          <div className="w-[75px] h-[75px] relative">
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
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              {compare ? <th>TRADE</th> : null}
              <th>POS</th>
              <th>PLAYER</th>
              <th>PROJ</th>
              <th>SCORE</th>
              {!compare ? <th>TEAM</th> : null}
            </tr>
          </thead>
          <tbody>
            {rosterData.roster.entries
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
              .map((player, i) => (
                <RosteredPlayers
                  key={i}
                  player={{
                    name: player.playerPoolEntry.player.fullName,
                    espnId: player.playerPoolEntry.player.id,
                    maybeTeam: teams[player.playerPoolEntry.player.proTeamId],
                    teamId: player.playerPoolEntry.player.proTeamId,
                    position: mapPositions[player.lineupSlotId],
                    defaultPosition:
                      mapDefaultPositions[
                        player.playerPoolEntry.player.defaultPositionId
                      ],
                    stats: player.playerPoolEntry.player.stats,
                    week: week,
                    lineupSlotId: player.lineupSlotId,
                    injuryStatus: player.playerPoolEntry.player.injuryStatus,
                    firstName: player.playerPoolEntry.player.firstName,
                    lastName: player.playerPoolEntry.player.lastName,
                  }}
                  compare={compare}
                  playerSelector={playerSelector}
                  team={team}
                  handleSelectedStats={handleSelectedStats}
                ></RosteredPlayers>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Players;

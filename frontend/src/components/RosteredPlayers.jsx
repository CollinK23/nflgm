import React, { useEffect, useState } from "react";
import { mapPositions, injuries } from "../constants/conversions";
import PlayerStats from "./PlayerStats";

const RosteredPlayers = ({
  player,
  compare,
  playerSelector,
  team,
  handleSelectedStats,
}) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
  }, [player.espnId]);

  const handlePlayerSelection = () => {
    setChecked(!checked);
    playerSelector(player.espnId.toString(), team, player);
  };

  const projectedWeekStats = player.stats.find(
    (stat) => stat.scoringPeriodId === player.week && stat.proTeamId === 0
  );

  const weekStats = player.stats.find(
    (stat) => stat.scoringPeriodId === player.week && stat.proTeamId != 0
  );

  return (
    <tr>
      {compare ? (
        <th>
          <label>
            <input
              type="checkbox"
              className="checkbox"
              checked={checked}
              onClick={handlePlayerSelection}
            />
          </label>
        </th>
      ) : null}

      <td
        className={
          mapPositions[player.lineupSlotId] == "Bench" ||
          mapPositions[player.lineupSlotId] == "IR"
            ? "text-grey"
            : "text-white"
        }
      >
        {mapPositions[player.lineupSlotId]}
      </td>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask w-12 h-12">
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
          </div>
          <div>
            <div
              className="font-bold"
              onClick={() => handleSelectedStats(player)}
            >
              {player.name}{" "}
              <span className="text-red">{injuries[player.injuryStatus]}</span>
            </div>
            <div className="text-sm opacity-50">{player.maybeTeam}</div>
          </div>
        </div>
      </td>
      <td>
        {projectedWeekStats ? projectedWeekStats.appliedTotal.toFixed(1) : "-"}
      </td>
      <td>{weekStats ? weekStats.appliedTotal.toFixed(1) : "-"}</td>
      {!compare ? (
        <td>
          <img
            src={`https://a.espncdn.com/i/teamlogos/nfl/500/${player.maybeTeam}.png`}
            alt={player.name}
            className="w-12 h-12"
          />
        </td>
      ) : null}
    </tr>
  );
};

export default RosteredPlayers;

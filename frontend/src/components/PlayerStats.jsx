import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import React, { useState } from "react";
import { injuries, teams, teamColors } from "../constants/conversions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { Card } from "./ui/card";

export function PlayerStats({ player }) {
  const [playerData, setPlayerData] = useState(null);

  const fetchPlayerData = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/stats/${player.espnId}`
      );
      const data = await response.json();

      setPlayerData(data);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          onClick={fetchPlayerData}
          className="hover:underline cursor-pointer"
        >
          {player.name}
          {injuries[player.injuryStatus] && (
            <span className="text-[#ff0000]">
              {` ${injuries[player.injuryStatus]}`}
            </span>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] sm:max-h-[700px]">
        <DialogHeader>
          <DialogTitle>View Stats</DialogTitle>
        </DialogHeader>
        {/* turn this into component right here v */}
        <Card className="flex flex-row overflow-x-hidden">
          <div className="h-[203px] w-[280px]">
            {player.espnId >= 0 ? (
              <div className="relative">
                <img
                  src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.espnId}.png&w=280&h=203`}
                  alt={player.name}
                  className="absolute top-0 z-10"
                />
                <div
                  className="h-[203px] w-[280px] absolute top-0 z-0 transform skew-x-[-30deg]"
                  style={{
                    backgroundImage: `linear-gradient(to top, ${
                      teamColors[player.teamId]
                    }b5,  ${teamColors[player.teamId]}30, #00000000)`,
                  }}
                ></div>
              </div>
            ) : (
              <img
                src={`https://a.espncdn.com/i/teamlogos/nfl/500/${player.maybeTeam}.png`}
                alt={player.maybeTeam}
              />
            )}
          </div>
          <div className="flex flex-col p-8">
            <div className="font-semibold text-[20px]">{player.name}</div>
            <div>Team: {player.maybeTeam}</div>
            <div>Pos: {player.defaultPosition}</div>
          </div>
        </Card>
        {playerData && (
          <Card className="overflow-x-auto max-h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Opp</TableHead>
                  <TableHead>Score</TableHead>
                  {playerData.labels.map((stat, i) => (
                    <TableHead key={i}>{stat}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {playerData.games.map((game, i) => (
                  <TableRow key={i}>
                    <TableCell></TableCell>
                    <TableCell>
                      {`${game[1].atVs} ${
                        game[1].opponentId !== null && teams[game[1].opponentId]
                          ? teams[game[1].opponentId]
                          : ""
                      }`}
                    </TableCell>
                    <TableCell
                      className={`${
                        game[1].gameResult == "W"
                          ? "text-[#008800]"
                          : game[1].gameResult == "L"
                          ? "text-[#ff0000]"
                          : ""
                      } whitespace-nowrap text-[14px]`}
                    >
                      {game[1].gameResult} <span>{game[1].score}</span>
                    </TableCell>
                    {game[1].stats
                      ? game[1].stats.map((stat, j) => <th>{stat}</th>)
                      : null}
                    <TableCell></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}

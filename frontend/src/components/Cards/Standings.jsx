import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import React from "react";

export default function Standings({ teams, teamId, className }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>League Standings</CardTitle>
        <CardDescription className="text-balance leading-relaxed">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">#</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Record</TableHead>
                <TableHead>PF</TableHead>
                <TableHead>PA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams
                .slice()
                .sort((a, b) => a.playoffSeed - b.playoffSeed)
                .map((team) => (
                  <TableRow
                    key={team.id}
                    className={team.id == teamId ? "bg-muted/40" : ""}
                  >
                    <TableCell>{team.playoffSeed}</TableCell>
                    <TableCell className="font-medium">
                      {team.name.length < 15
                        ? team.name
                        : team.name.slice(0, 10) + "..."}
                    </TableCell>
                    <TableCell>
                      {team.record.overall.wins}-{team.record.overall.losses}-
                      {team.record.overall.ties}
                    </TableCell>
                    <TableCell>
                      {team.record.overall.pointsFor.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {team.record.overall.pointsAgainst.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

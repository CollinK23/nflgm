import { PlayerStats } from "../components/PlayerStats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { mapDefaultPositions, teams } from "../constants/conversions";

const ValuablePlayersMap = {
  0: 24,
  2: 48,
  4: 48,
  6: 24,
  16: 24,
  17: 24,
  "0,2,23,4,6": 100,
  23: 100,
};

function calculateTierMap(numbers) {
  if (numbers.length === 0) return {};

  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const variance =
    numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) /
    numbers.length;
  const standardDeviation = Math.sqrt(variance);

  const tiers = {
    S: mean + 2 * standardDeviation,
    A: mean + standardDeviation,
    B: mean,
    C: mean - standardDeviation,
    D: mean - 2 * standardDeviation,
  };

  const tierMap = numbers.map((value) => {
    if (value >= tiers.S) return { value, tier: "S" };
    if (value >= tiers.A) return { value, tier: "A" };
    if (value >= tiers.B) return { value, tier: "B" };
    if (value >= tiers.C) return { value, tier: "C" };
    if (value >= tiers.D) return { value, tier: "D" };
    return { value, tier: "F" };
  });

  return tierMap;
}

export const fetchRosterData = async (leagueId, swid, espn_s2, teamId) => {
  try {
    const url =
      swid && espn_s2
        ? `http://127.0.0.1:8000/league/?swid=${swid}&espn_s2=${espn_s2}&url=https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/2024/segments/0/leagues/${leagueId}?rosterForTeamId=${teamId}%26view=mTeam%26view=mRoster`
        : `http://127.0.0.1:8000/league/?url=https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/2024/segments/0/leagues/${leagueId}?rosterForTeamId=${teamId}%26view=mTeam%26view=mRoster`;

    const response = await fetch(url);
    const data = await response.json();

    const teamWithRoster = data.teams.find((team) => team.roster);
    const idx = data.teams.indexOf(teamWithRoster);

    return data.teams[idx].roster.entries.map(
      (player) => player.playerPoolEntry.player.id
    );
  } catch (error) {
    console.error("Error fetching roster data:", error);
    return null;
  }
};

export function RankingsTable({
  totals,
  data,
  position,
  showTiers,
  rosterData,
  highlightUserRoster,
}) {
  const statIndices = [3, 4, 20, 23, 24, 25, 41, 42, 43, 58];
  let tierMap = [];

  if (showTiers) {
    const TopAvailablePlayers = data?.players
      ?.filter((_, idx) => idx < ValuablePlayersMap[position])
      .map((player) => {
        let playerStats =
          totals === "true"
            ? player.player.stats.find((stat) => stat.id == "002024")
            : player.player.stats.find((stat) => stat.statSourceId == 0);
        return playerStats?.appliedTotal;
      });

    tierMap = calculateTierMap(TopAvailablePlayers);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="">
          <TableHead rowSpan={2} className="border-y border-r text-center">
            #No
          </TableHead>
          <TableHead rowSpan={2} className="border-y border-r text-center">
            Player
          </TableHead>
          <TableHead colSpan={4} className="border text-center">
            Passing
          </TableHead>
          <TableHead colSpan={3} className="border text-center">
            Rushing
          </TableHead>
          <TableHead colSpan={4} className="border text-center">
            Receiving
          </TableHead>
          {/* <TableHead colSpan={3} className="border text-center">
            Misc
          </TableHead> */}
          <TableHead
            colSpan={totals == "true" ? 2 : 1}
            className="border-y text-center"
          >
            Total
          </TableHead>
        </TableRow>
        <TableRow>
          {/* Passing */}
          <TableHead>C/A</TableHead>
          <TableHead>YDS</TableHead>
          <TableHead>TD</TableHead>
          <TableHead className="border-r">INT</TableHead>
          {/* Rushing */}
          <TableHead>CAR</TableHead>
          <TableHead>YDS</TableHead>
          <TableHead className="border-r">TD</TableHead>
          {/* Receiving */}
          <TableHead>REC</TableHead>
          <TableHead>YDS</TableHead>
          <TableHead>TD</TableHead>
          <TableHead className="border-r">TGTS</TableHead>
          {/* Misc */}
          {/* <TableHead>2PC</TableHead>
          <TableHead>FUML</TableHead>
          <TableHead className="border-r">TD</TableHead> */}
          {/* Total */}
          <TableHead>FPTS</TableHead>
          {totals == "true" ? <TableHead>AVG</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.players?.map((player, idx) => {
          let playerStats =
            totals == "true"
              ? player.player.stats.find((stat) => stat.id == "002024")
              : player.player.stats.find((stat) => stat.statSourceId == 0);
          return (
            <>
              {showTiers &&
              idx < ValuablePlayersMap[position] &&
              (idx == 0 || tierMap[idx - 1].tier !== tierMap[idx].tier) ? (
                <TableRow
                  className="bg-muted/40 w-full"
                  key={tierMap[idx].tier}
                >
                  <TableCell
                    colSpan={totals == "true" ? 15 : 14}
                    className="text-center font-bold"
                  >
                    {tierMap[idx].tier} Tier
                  </TableCell>
                </TableRow>
              ) : null}
              {showTiers && idx == ValuablePlayersMap[position] ? (
                <TableRow className="bg-muted/40 w-full" key={"F"}>
                  <TableCell
                    colSpan={totals == "true" ? 15 : 14}
                    className="text-center font-bold"
                  >
                    F Tier
                  </TableCell>
                </TableRow>
              ) : null}
              <TableRow
                key={player.id}
                className={
                  rosterData &&
                  rosterData?.includes(player.id) &&
                  highlightUserRoster
                    ? "bg-chart1"
                    : ""
                }
              >
                <TableCell className="border-r text-center">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-medium border-r flex flex-row items-center space-x-4">
                  <img
                    src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.id}.png&w=350&h=254`}
                    alt={player.player.fullName}
                    className="w-[50px]"
                  />
                  <PlayerStats
                    player={{
                      espnId: player.id,
                      name: player.player.fullName,
                      injuryStatus: player.player.injuryStatus,
                      teamId: player.player.proTeamId,
                      maybeTeam: teams[player.player.proTeamId],
                      defaultPosition:
                        mapDefaultPositions[player.player.defaultPositionId],
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium text-[12px]">
                  {`${playerStats?.stats[1] || 0}/${
                    playerStats?.stats[0] || 0
                  }`}
                </TableCell>
                {statIndices.map((index, idx) => (
                  <TableCell
                    key={index}
                    className={`font-medium text-[12px] ${
                      [20, 25, 58].includes(index) ? "border-r" : ""
                    }`}
                  >
                    {playerStats?.stats[index] || 0}
                  </TableCell>
                ))}
                <TableCell className="font-medium text-[12px]">
                  {playerStats?.appliedTotal.toFixed(2) || 0}
                </TableCell>
                {totals == "true" ? (
                  <TableCell className="font-medium text-[12px]">
                    {playerStats?.appliedAverage.toFixed(2) || 0}
                  </TableCell>
                ) : null}
              </TableRow>
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}

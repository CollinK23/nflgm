import { positionStatMap } from "../../constants/conversions";

const fetchSinglePlayerData = async (player) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/stats/${player?.espnId}?sleeperId=${player?.sleeperId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching player data:", error);
  }
};

const populateCompareData = (player1, player2, position) => {
  const compareData = {};
  const statKeys = Object.keys(positionStatMap[position]);

  statKeys.forEach((key) => {
    compareData[key] = Array.from({ length: 24 }, (_, weekIndex) => ({
      date: weekIndex + 1,
      desktop: null,
      mobile: null,
    }));
  });

  player1.games.forEach((game) => {
    if (game[0] !== "2024 Regular Season") {
      const week = game[1].week;
      statKeys.forEach((key) => {
        const statIndex = positionStatMap[position][key];
        const player1Stat = !isNaN(parseFloat(game[1].stats[statIndex]))
          ? parseFloat(game[1].stats[statIndex])
          : null;

        compareData[key][week - 1] = {
          date: week,
          desktop: player1Stat,
          mobile: compareData[key][week - 1]?.mobile || null,
        };
      });
    }
  });

  player2.games.forEach((game) => {
    if (game[0] !== "2024 Regular Season") {
      const week = game[1].week;
      statKeys.forEach((key) => {
        const statIndex = positionStatMap[position][key];
        const player2Stat = !isNaN(parseFloat(game[1].stats[statIndex]))
          ? parseFloat(game[1].stats[statIndex])
          : null;

        compareData[key][week - 1] = {
          date: week,
          desktop: compareData[key][week - 1]?.desktop || null,
          mobile: player2Stat,
        };
      });
    }
  });

  statKeys.forEach((key) => {
    while (compareData[key].length > 0) {
      const lastEntry = compareData[key][compareData[key].length - 1];

      if (lastEntry.desktop === null && lastEntry.mobile === null) {
        compareData[key].pop();
      } else {
        break;
      }
    }
  });

  return compareData;
};

const handleCompareStats = async (
  value0,
  value1,
  playerData,
  leaderData,
  position
) => {
  let player1, player2;

  if (value0 !== "") {
    player1 = await fetchSinglePlayerData(
      playerData.find((player) => player[value0])?.[value0]
    );
  }

  if (value1 !== "") {
    player2 = await fetchSinglePlayerData(
      playerData.find((player) => player[value1])?.[value1]
    );
  }

  const newValues = {};
  let compareData = {};
  if (player1 && player2) {
    compareData["weeklyData"] = [];
    for (let i = 0; i < player1.fantasy.length; i++) {
      if (player1.fantasy[i] && player2.fantasy[i]) {
        compareData["weeklyData"].push({
          date: player1.fantasy[i].date,
          desktop: player1.fantasy[i].pts_ppr,
          mobile: player2.fantasy[i].pts_ppr,
        });
      } else {
        if (player1.fantasy[i]) {
          compareData["weeklyData"].push({
            date: player1.fantasy[i].date,
            desktop: player1.fantasy[i].pts_ppr,
            mobile: null,
          });
        }
        if (player2.fantasy[i]) {
          compareData["weeklyData"].push({
            date: player2.fantasy[i].date,
            desktop: null,
            mobile: player2.fantasy[i].pts_ppr,
          });
        }
      }
    }

    compareData = {
      ...compareData,
      ...populateCompareData(player1, player2, position, compareData),
    };

    const player1Data = player1.games.find(
      (game) => game[1].atVs === "Regular Season"
    );
    const player2Data = player2.games.find(
      (game) => game[1].atVs === "Regular Season"
    );

    for (const key in leaderData) {
      if (key in positionStatMap[position]) {
        const playeraStat = parseFloat(
          player1Data[1].stats[positionStatMap[position][key]].replace(
            /[^0-9.-]/g,
            ""
          )
        );
        const playerbStat = parseFloat(
          player2Data[1].stats[positionStatMap[position][key]].replace(
            /[^0-9.-]/g,
            ""
          )
        );

        if (!isNaN(playeraStat) && !isNaN(playerbStat)) {
          const leagueLeader = parseFloat(
            leaderData[key].replace(/[^0-9.-]/g, "")
          );

          const keyPrefix = key.split(".")[0];

          if (!(keyPrefix in newValues)) {
            newValues[keyPrefix] = [];
          }

          newValues[keyPrefix].push({
            stat: player1.labels[positionStatMap[position][key]],
            playera: Math.max(
              Math.floor((playeraStat / leagueLeader) * 100),
              0
            ),
            playerb: Math.max(
              Math.floor((playerbStat / leagueLeader) * 100),
              0
            ),
          });
        }
      }
    }
  }

  return [compareData, newValues];
};

export default handleCompareStats;

export const mapPositions = {
  0: "QB",
  2: "RB",
  4: "WR",
  6: "TE",
  20: "Bench",
  23: "FLEX",
  16: "D/ST",
  17: "K",
  21: "IR",
};

export const mapDefaultPositions = {
  1: "QB",
  2: "RB",
  3: "WR",
  4: "TE",
  5: "K",
  16: "D/ST",
};

export const teams = [
  "FA",
  "ATL",
  "BUF",
  "CHI",
  "CIN",
  "CLE",
  "DAL",
  "DEN",
  "DET",
  "GB",
  "TEN",
  "IND",
  "KC",
  "LV",
  "LAR",
  "MIA",
  "MIN",
  "NE",
  "NO",
  "NYG",
  "NYJ",
  "PHI",
  "ARI",
  "PIT",
  "LAC",
  "SF",
  "SEA",
  "TB",
  "WAS",
  "CAR",
  "JAX",
  "",
  "",
  "BAL",
  "HOU",
];

export const teamColors = [
  "#ffffff",
  "#A71930",
  "#00338D",
  "#DD4814",
  "#FB4F14",
  "#FF3C00",
  "#041E42",
  "#FB4F14",
  "#0076B6",
  "#203731",
  "#4B92DB",
  "#002C5F",
  "#E31837",
  "#A5ACAF",
  "#003594",
  "#008E97",
  "#4F2683",
  "#002244",
  "#D3BC8D",
  "#0b2265",
  "#203731",
  "#004C54",
  "#97233F",
  "#FFB81C",
  "#0072CE",
  "#AA0000",
  "#002244",
  "#D50A0A",
  "#773141",
  "#0085CA",
  "#006778",
  "",
  "",
  "#241773",
  "#A71930",
];

export const injuries = {
  INJURY_RESERVE: "IR",
  QUESTIONABLE: "Q",
  DOUBTFUL: "D",
  OUT: "O",
  SUSPENDED: "SSPD",
};

export function addSuffix(number) {
  if (number >= 11 && number <= 13) {
    return number + "th";
  }

  const lastDigit = number % 10;
  switch (lastDigit) {
    case 1:
      return number + "st";
    case 2:
      return number + "nd";
    case 3:
      return number + "rd";
    default:
      return number + "th";
  }
}

export const positionStatMap = {
  RB: {
    "receiving.receptions": 5,
    "receiving.receivingTargets": 6,
    "receiving.receivingYards": 7,
    "receiving.yardsPerReception": 8,
    "receiving.receivingTouchdowns": 9,
    "rushing.rushingAttempts": 0,
    "rushing.rushingYards": 1,
    "rushing.yardsPerRushAttempt": 2,
    "rushing.rushingTouchdowns": 3,
  },
  WR: {
    "receiving.receptions": 0,
    "receiving.receivingTargets": 1,
    "receiving.receivingYards": 2,
    "receiving.yardsPerReception": 3,
    "receiving.receivingTouchdowns": 4,
    "rushing.rushingAttempts": 6,
    "rushing.rushingYards": 7,
    "rushing.yardsPerRushAttempt": 8,
    "rushing.rushingTouchdowns": 10,
  },
  TE: {
    "receiving.receptions": 0,
    "receiving.receivingTargets": 1,
    "receiving.receivingYards": 2,
    "receiving.yardsPerReception": 3,
    "receiving.receivingTouchdowns": 4,
  },
  QB: {
    "passing.completionPct": 3,
    "passing.passingYards": 2,
    "passing.interceptions": 6,
    "passing.passingTouchdowns": 5,
    "rushing.rushingAttempts": 11,
    "rushing.rushingYards": 12,
    "rushing.yardsPerRushAttempt": 13,
    "rushing.rushingTouchdowns": 14,
  },
};

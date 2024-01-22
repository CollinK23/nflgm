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

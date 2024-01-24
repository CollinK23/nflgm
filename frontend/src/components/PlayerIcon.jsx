import React from "react";

const PlayerIcon = ({ player }) => {
  return (
    <div className="flex flex-row bg-primary px-4  w-[200px] rounded-md items-center space-x-2">
      <div className="text-[12px]">{player.tradeData.player.position}</div>
      {player.tradeData.redraftValue / 200 >= 10 ? (
        <div className="w-[50px] py-2 ">
          <img
            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.tradeData.player.espnId}.png&w=100&h=75`}
            alt={player.tradeData.player.name}
          />
        </div>
      ) : null}

      <div className="">
        {player.espnData.firstName[0]}.{" "}
        {player.espnData.lastName.length <= 7
          ? player.espnData.lastName
          : player.espnData.lastName.slice(0, 5) + "..."}
      </div>
    </div>
  );
};

export default PlayerIcon;

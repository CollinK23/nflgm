import React from "react";
import PlayerIcon from "./PlayerIcon";

const StackedBarGraph = ({
  outgoing,
  incoming,
  outgoingTotal,
  incomingTotal,
}) => {
  const defaultVal = 200;

  return (
    <div className="stacked-bar-graph text-white flex justify-center">
      <div className="flex flex-row space-x-4">
        <div className="flex flex-col space-y-2">
          {outgoing.map((player) => (
            <div
              key={player.espnData.espnId}
              className="bar-wrapper flex flex-row items-center space-x-4"
            >
              <PlayerIcon player={player} />
              <div
                className={`w-[60px] ${
                  outgoingTotal >= incomingTotal ? "bg-blue" : "bg-darkGrey"
                } rounded-md text-center flex items-center justify-center`}
                style={{
                  height: `${
                    Math.max(player.tradeData.redraftValue, defaultVal) / 25 +
                    8 * (incoming.length - 1)
                  }px`,
                }}
              >
                {(
                  Math.max(player.tradeData.redraftValue, defaultVal) / 200
                ).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-2 items-bottom">
          {incoming.map((player) => (
            <div
              key={player.espnData.espnId}
              className="flex flex-row items-center space-x-4"
            >
              <div className="bar-wrapper flex flex-row">
                <div
                  className={`w-[60px] ${
                    outgoingTotal <= incomingTotal ? "bg-blue" : "bg-darkGrey"
                  } rounded-md flex items-center justify-center`}
                  style={{
                    height: `${
                      Math.max(player.tradeData.redraftValue, defaultVal) / 25 +
                      8 * (outgoing.length - 1)
                    }px`,
                  }}
                >
                  {(
                    Math.max(player.tradeData.redraftValue, defaultVal) / 200
                  ).toFixed(2)}
                </div>
              </div>
              <PlayerIcon player={player} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StackedBarGraph;

import React, { useState } from "react";
import StackedBarChart from "../StackedBarChart";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

import { Card, CardHeader, CardTitle } from "../ui/card";

const TradeCompare = () => {
  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const defaultVal = 200;

  const team0 = useSelector((state) => state.user?.trade?.team0) || null;
  const team1 = useSelector((state) => state.user?.trade?.team1) || null;

  const fetchPlayerData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/compare");
      const data = await response.json();

      const matchingPlayersData1 = [];
      const matchingPlayersData2 = [];

      for (const espnId of Object.keys(team0.players)) {
        const entry = data.players[espnId];

        if (entry) {
          matchingPlayersData1.push({
            tradeData: entry,
            espnData: team0.players[espnId],
          });
        }
      }
      for (const espnId of Object.keys(team1.players)) {
        const entry = data.players[espnId];

        if (entry) {
          matchingPlayersData2.push({
            tradeData: entry,
            espnData: team1.players[espnId],
          });
        }
      }

      setOutgoing(matchingPlayersData1);
      setIncoming(matchingPlayersData2);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };

  const calculateTotalRedraftValue = (players) => {
    let totalVal = 0;

    for (let i = 0; i < players.length; i++) {
      if (
        players[i] !== undefined &&
        players[i].tradeData.redraftValue > defaultVal
      ) {
        totalVal += players[i].tradeData.redraftValue;
      } else {
        totalVal += defaultVal;
      }
    }

    return totalVal;
  };

  const outgoingTotal = calculateTotalRedraftValue(outgoing) / 200;
  const incomingTotal = calculateTotalRedraftValue(incoming) / 200;

  if (!team0 || !team1) {
    return <div>Hello</div>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={fetchPlayerData}>Compare</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] sm:max-h-[600px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Compare</DialogTitle>
        </DialogHeader>
        {outgoing.length && incoming.length ? (
          <div>
            <div className="flex flex-row justify-center gap-2 pb-2">
              <Card className="w-full">
                <CardHeader className="gap-2">
                  <CardTitle>Outgoing Value</CardTitle>
                  <div className="flex flex-row justify-between items-center">
                    <div className="w-[50px] h-[50px] relative">
                      <img src={team0.data.logo} className="absolute"></img>
                    </div>
                    <div
                      className={`font-bold text-4xl ${
                        outgoingTotal >= incomingTotal ? "text-primary" : ""
                      }`}
                    >
                      {outgoingTotal.toFixed(2)}
                    </div>
                  </div>
                </CardHeader>
              </Card>
              <Card className="w-full">
                <CardHeader className="gap-2">
                  <CardTitle className="text-right">Incoming Value</CardTitle>
                  <div className="flex flex-row justify-between items-center">
                    <div
                      className={`font-bold text-4xl ${
                        incomingTotal >= outgoingTotal ? "text-primary" : ""
                      }`}
                    >
                      {incomingTotal.toFixed(2)}
                    </div>
                    <div className="w-[50px] h-[50px] relative">
                      <img src={team1.data?.logo} className="absolute"></img>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <StackedBarChart
              outgoing={outgoing}
              incoming={incoming}
              outgoingTotal={outgoingTotal}
              incomingTotal={incomingTotal}
            />
          </div>
        ) : (
          <div>Calculating</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TradeCompare;

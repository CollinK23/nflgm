import React, { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";

import handleCompareStats from "../hooks/CompareStats";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ComparePlayerCards, RadarChartCard, LineGraph } from "./charts.jsx";

const PlayerCompare = () => {
  const [playerData, setPlayerData] = useState(null);
  const [leaderData, setLeaderData] = useState(null);
  const [open0, setOpen0] = React.useState(false);
  const [value0, setValue0] = React.useState("");
  const [open1, setOpen1] = React.useState(false);
  const [value1, setValue1] = React.useState("");
  const [chartData, setChartData] = useState(null);
  const [position, setPosition] = useState("WR");
  const [lineChartData, setLineChartData] = useState(null);
  const [espnId1, setEspnId1] = useState(null);
  const [espnId2, setEspnId2] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/players/${position}`
        );
        const data = await response.json();
        setPlayerData(data.players);
        setLeaderData(data.leaders);
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchPlayerData();
  }, [position]);

  const handleSelectChange = (value) => {
    setPosition(value);
  };

  const chartConfig = {
    playera: {
      label: value0,
      color: "hsl(var(--chart-1))",
    },
    playerb: {
      label: value1,
      color: "hsl(var(--chart-2))",
    },
  };

  if (!playerData) {
    return <div>Loading</div>;
  }
  return (
    <Card>
      <CardContent>
        <CardHeader>
          <div className="flex flex-row gap-2">
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="WR">WR</SelectItem>
                  <SelectItem value="RB">RB</SelectItem>
                  <SelectItem value="TE">TE</SelectItem>
                  <SelectItem value="QB">QB</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Popover open={open0} onOpenChange={setOpen0}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open0}
                  className="w-[200px] justify-between"
                >
                  {value0
                    ? Object.keys(
                        playerData.find(
                          (player) => Object.keys(player)[0] === value0
                        ) || {}
                      )[0] || "Select Player..."
                    : "Select Player..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search Player..." />
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {playerData?.map((player) => {
                        const playerName = Object.keys(player)[0];
                        return (
                          <CommandItem
                            key={playerName}
                            value={playerName}
                            onSelect={(currentValue) => {
                              setValue0(
                                currentValue === value0 ? "" : currentValue
                              );
                              setOpen0(false);
                              setEspnId1(player[playerName].espnId);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value0 === playerName
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {playerName}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Popover open={open1} onOpenChange={setOpen1}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open1}
                  className="w-[200px] justify-between"
                >
                  {value1
                    ? Object.keys(
                        playerData.find(
                          (player) => Object.keys(player)[0] === value1
                        ) || {}
                      )[0] || "Select Player..."
                    : "Select Player..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search Player..." />
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {playerData?.map((player) => {
                        const playerName = Object.keys(player)[0];
                        return (
                          <CommandItem
                            key={playerName}
                            value={playerName}
                            onSelect={(currentValue) => {
                              setValue1(
                                currentValue === value1 ? "" : currentValue
                              );

                              setOpen1(false);
                              setEspnId2(player[playerName].espnId);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value1 === playerName
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {playerName}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              onClick={async () => {
                try {
                  const [compareData, newValues] = await handleCompareStats(
                    value0,
                    value1,
                    playerData,
                    leaderData,
                    position
                  );

                  setLineChartData(compareData);
                  setChartData(newValues);
                } catch (error) {
                  console.error("Error comparing stats:", error);
                }
              }}
            >
              Compare
            </Button>
          </div>
          {chartData && (
            <ComparePlayerCards
              espnId1={espnId1}
              espnId2={espnId2}
              value0={value0}
              value1={value1}
              position={position}
            />
          )}
          <div className="flex flex-col custom:flex-row gap-2">
            {chartData && (
              <RadarChartCard
                positon={position}
                chartConfig={chartConfig}
                chartData={chartData}
              />
            )}
            {lineChartData ? (
              <LineGraph
                chartData={lineChartData}
                player1={value0}
                player2={value1}
              ></LineGraph>
            ) : null}
          </div>
        </CardHeader>
      </CardContent>
    </Card>
  );
};

export default PlayerCompare;

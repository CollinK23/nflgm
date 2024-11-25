import React, { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function ComparePlayerCards({
  espnId1,
  espnId2,
  value0,
  value1,
  position,
}) {
  return (
    <div className="flex flex-row justify-center gap-2 pb-2">
      <Card className="flex flex-row overflow-x-hidden w-full">
        <div className="h-[203px] w-[280px]">
          <div className="relative">
            <img
              src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${espnId1}.png&w=280&h=203`}
              alt={espnId1}
              className="absolute top-0 z-10"
            />
            <div
              className="h-[203px] w-[280px] absolute top-0 z-0 transform skew-x-[-30deg]"
              style={{
                backgroundImage: `linear-gradient(to top, ${"#0070FF"}b5,  ${"#0070FF"}30, #00000000)`,
              }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col p-8">
          <div className="font-semibold text-[20px]">{value0}</div>
          <div>Team: Hello</div>
          <div>Pos: {position}</div>
        </div>
      </Card>

      <Card className="flex flex-row overflow-x-hidden w-full">
        <div className="h-[203px] w-[280px]">
          <div className="relative">
            <img
              src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${espnId2}.png&w=280&h=203`}
              alt={espnId2}
              className="absolute top-0 z-10"
            />
            <div
              className="h-[203px] w-[280px] absolute top-0 z-0 transform skew-x-[-30deg]"
              style={{
                backgroundImage: `linear-gradient(to top, ${"#f8542a"}b5,  ${"#f8542a"}30, #00000000)`,
              }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col p-8">
          <div className="font-semibold text-[20px]">{value1}</div>
          <div>Team: Hello</div>
          <div>Pos: {position}</div>
        </div>
      </Card>
    </div>
  );
}

export const RadarData = ({ chartConfig, chartData, position }) => {
  if (!chartData) {
    return <div>Select Players</div>;
  }

  let categories = ["QB", "RB"].includes(position)
    ? Object.keys(chartData).reverse()
    : Object.keys(chartData);

  return (
    <div className="flex flex-row justify-center py-4">
      {categories.map((key, index) => (
        <div>
          <ChartContainer
            config={chartConfig}
            className=" aspect-square h-[250px]"
          >
            <RadarChart key={index} data={chartData[key]}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <PolarAngleAxis dataKey="stat" />
              <PolarGrid radialLines={false} />
              <Radar
                dataKey="playera"
                fill="var(--color-playera)"
                fillOpacity={0.4}
                stroke="var(--color-playera)"
                strokeWidth={2}
                hide={false}
              />
              <Radar
                dataKey="playerb"
                fill="var(--color-playerb)"
                fillOpacity={0.4}
                stroke="var(--color-playerb)"
                strokeWidth={2}
              />
              <ChartLegend className="mt-8" content={<ChartLegendContent />} />
            </RadarChart>
          </ChartContainer>
          <div className="text-center text-[16px]">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </div>
        </div>
      ))}
    </div>
  );
};

export const RadarChartCard = ({ position, chartConfig, chartData }) => {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart</CardTitle>
        <CardDescription>League-wide {position} percentiles</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <RadarData
          chartConfig={chartConfig}
          chartData={chartData}
          position={position}
        />
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          2024 Regular Season
        </div>
      </CardFooter>
    </Card>
  );
};

export const LineGraph = ({ chartData, player1, player2 }) => {
  const chartConfig = {
    desktop: {
      label: player1,
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: player2,
      color: "hsl(var(--chart-2))",
    },
  };

  const [stat, setStat] = useState("weeklyData");

  const handleSelectChange = (value) => {
    setStat(value);
  };

  return (
    <Card>
      <CardHeader className="items-center flex flex-row justify-between">
        <div>
          <CardTitle>
            {stat.includes(".")
              ? stat
                  .split(".")[1]
                  .replace(/([a-z])([A-Z])/g, "$1 $2")
                  .replace(/\b\w/g, (char) => char.toUpperCase())
              : "Points Per Week"}{" "}
            Comparison
          </CardTitle>
          <CardDescription>Week 1 - Present</CardDescription>
        </div>
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a stat" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Stats</SelectLabel>
              {Object.keys(chartData).map((key) => (
                <SelectItem key={key} value={key}>
                  {key.includes(".")
                    ? key
                        .split(".")[1]
                        .replace(/([a-z])([A-Z])/g, "$1 $2")
                        .replace(/\b\w/g, (char) => char.toUpperCase())
                    : "Points Per Week"}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData[stat]}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (typeof value === "number") {
                  return value;
                }

                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={6}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="linear"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            ></Line>
            <Line
              dataKey="mobile"
              type="linear"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-mobile)",
              }}
              activeDot={{
                r: 6,
              }}
            ></Line>
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-center items-center">
        <div className="flex w-full items-center gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Scoring Type: PPR
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

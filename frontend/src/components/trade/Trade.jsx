import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TradeCompare from "./TradeCompare";
import Loading from "../Loading/Loading";
import { Roster } from "..";

const Trade = () => {
  const { id } = useParams();
  const [rosterData, setRosterData] = useState(null);
  const [analyze, setAnalyze] = useState(false);

  const handlePopUp = () => {
    setAnalyze(!analyze);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/2024/segments/0/leagues/${id}?viewmMatchup`
        );
        const data = await response.json();
        setRosterData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!rosterData) {
    return (
      <div className="min-h-screen py-24">
        <Loading />
      </div>
    );
  }
  return (
    <div className="min-h-screen mx-auto py-24">
      {analyze ? <TradeCompare /> : null}

      <button
        className="blue__btn text-white my-8"
        type="submit"
        onClick={handlePopUp}
      >
        Analyze Trade
      </button>

      <div className="flex flex-row">
        <Roster id={id} team={teamId} compare={true} selectedTeam={0} />
        <Roster id={id} team={teamId} compare={true} selectedTeam={1} />
      </div>
    </div>
  );
};

export default Trade;

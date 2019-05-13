import React from "react";
import { Link } from "react-router-dom";

import { sortBy, reverse } from "lodash";

import "./Leaderboard.css";

var dateOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

const Leaderboard = ({ scores, onQuizzStart }) => {
  const augmentedScores = reverse(sortBy(scores, "score"))
    .slice(0, 10)
    .map(s => {
      const date = new Date(s.date);
      console.log({ date });
      const day = date.toLocaleDateString("en-US", dateOptions);
      return {
        ...s,
        day,
      };
    });
  console.log({ augmentedScores });
  return (
    <div className="Leaderboard">
      <div className="Leaderboard_header">Scores - Top 10</div>
      {augmentedScores.length === 0 && "No quizz completed yet"}
      {augmentedScores.length > 0 &&
        augmentedScores.map(s => (
          <div key={s.date} className="Leaderboard_score">
            <div className="Leaderboard_score_date">{s.day}</div>
            <div className="Leaderboard_score_score">{s.score}</div>
          </div>
        ))}
      <Link to="/game">
        <div className="button Leaderboard_button" role="button">
          Play new Quizz
        </div>
      </Link>
    </div>
  );
};

export default Leaderboard;

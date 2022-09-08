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

const Leaderboard = ({ scores }) => {
  const augmentedScores = reverse(sortBy(scores, "value"))
    .slice(0, 10)
    .map((s) => {
      const date = new Date(s.date);
      const day = date.toLocaleDateString("en-US", dateOptions).replace(" at ", "  -  ");
      return {
        ...s,
        day,
      };
    });
  return (
    <div className="Leaderboard">
      <div className="Leaderboard_content">
        <div className="Leaderboard_header">Scores - Top 10</div>
        {augmentedScores.length === 0 && "No quiz completed yet"}
        {augmentedScores.length > 0 &&
          augmentedScores.map((s) => (
            <div key={s.date} className="Leaderboard_score">
              <div className="Leaderboard_score_date">{s.day}</div>
              <div className="Leaderboard_score_value">{s.value}</div>
            </div>
          ))}
      </div>
      <Link to="/quiz">
        <div className="button Leaderboard_button" role="button">
          Play new Quiz
        </div>
      </Link>
    </div>
  );
};

export default Leaderboard;

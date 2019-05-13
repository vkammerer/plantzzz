import React from "react";
import Loader from "../Loader/Loader";

import "./Home.css";

const Home = ({ plants, error, onQuizzStart, handleViewLeaderboard }) => {
  return (
    <div className="Home">
      <div className="Home_intro">
        <p>
          <span>Plantzzz</span> helps you identify plants and test your knowledge about them.
        </p>
        <p>The faster you answer, the more points you get!</p>
      </div>
      {(plants.length === 0 || error) && <Loader error={error} />}
      {plants.length > 0 && !error && (
        <>
          <div className="button Home_button" role="button" onClick={onQuizzStart}>
            Play Quizz
          </div>
          <div className="button Home_button" role="button" onClick={handleViewLeaderboard}>
            View Scores
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

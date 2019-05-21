import React from "react";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = ({ plants, error }) => {
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
          <Link to="/quizz">
            <div className="button Home_button" role="button">
              Play Quizz
            </div>
          </Link>
          <Link to="/leaderboard">
            <div className="button Home_button" role="button">
              View Scores
            </div>
          </Link>
        </>
      )}
    </div>
  );
};

export default Home;

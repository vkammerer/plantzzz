import React from "react";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = ({ plants, error }) => {
  return (
    <div className="Home">
      <div className="Home_intro">
        <p className="Home_intro_description">
          Identify plants
          <br />
          and test your knowledge!
        </p>
        <p>
          The faster 🚀 you answer,
          <br />
          the more points 💪 you get.
        </p>
        <p className="Home_intro_currentSet">
          <span>LASC 206 - S2 - test 2</span>
        </p>
      </div>
      {(plants.length === 0 || error) && <Loader error={error} />}
      {plants.length > 0 && !error && (
        <div>
          <Link to="/quiz">
            <div className="button Home_button" role="button">
              Play Quiz
            </div>
          </Link>
          <Link to="/training">
            <div className="button Home_button" role="button">
              Train with all plants
            </div>
          </Link>
          <Link to="/leaderboard">
            <div className="button Home_button" role="button">
              View Scores
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;

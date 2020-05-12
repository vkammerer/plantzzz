import React from "react";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = ({ plants, error }) => {
  return (
    <div className="Home">
      <div className="Home_intro">
        <p className="Home_intro_description">
          <span>Plantzzz</span> helps you identify plants and test your knowledge about them.
        </p>
        <p>The faster you answer, the more points you get!</p>
        <p className="Home_intro_currentSet">
          Current set:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>LASC 211 - walks 3 & 4</span>
        </p>
      </div>
      {(plants.length === 0 || error) && <Loader error={error} />}
      {plants.length > 0 && !error && (
        <>
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
        </>
      )}
    </div>
  );
};

export default Home;

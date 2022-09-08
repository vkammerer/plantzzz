import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

import { getConfig } from "../../utils/data";
import "./Home.css";

const Home = ({ plants, error, test, onTest, isLoaded }) => {
  console.log(plants.length);
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
        <GamePicker onTest={onTest} />
      </div>
      {!!error && <Loader error={error} />}
      {!error && (
        <div className={plants.length > 0 && !!test ? "" : "Home_intro_loading"}>
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

const GamePicker = ({ onTest }) => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setConfig(null);
        const c = await getConfig();
        setConfig(c);
        onTest(c.defaultTest);
      } catch (error) {
        throw error;
      }
    })();
  }, [onTest]);

  return (
    <p className="Home_intro_picker">
      {!config ? (
        <>Loading config...</>
      ) : (
        <select
          defaultValue={config.defaultTest}
          onChange={async (c) => {
            const test = c.target.value;
            onTest(test);
          }}
        >
          {Object.entries(config.tests).map(([key, val]) => (
            <option value={key} key={key} disabled={!val.active}>
              {val.label}
            </option>
          ))}
        </select>
      )}
    </p>
  );
};

export default Home;

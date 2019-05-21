import React, { useState, useEffect, useRef } from "react";
import ReactGA from "react-ga";
import { Route, Redirect, withRouter } from "react-router-dom";

import { getQuizzPlants } from "../../utils/quizz";
import { getData } from "../../utils/data";
import { preloadPhoto, getScoreValue } from "../../utils/helpers";
import Header from "../Header/Header";
import Home from "../Home/Home";
import Quizz from "../Quizz/Quizz";
import Leaderboard from "../Leaderboard/Leaderboard";

import "./Game.css";

const PLANTS_COUNT = 10;

const getLocalScores = () => {
  const scoresStr = localStorage.getItem("plantzzzScores");
  if (scoresStr)
    return JSON.parse(scoresStr).map(s => ({
      date: s.date,
      /*
        The data structure of a `score` changed but
        the existing local client data is still read / supported.
        TODO remove suport after some time.
      */
      value: typeof s.score !== "undefined" ? s.score : s.value,
    }));
  return [];
};

const setLocalScores = scores => {
  localStorage.setItem("plantzzzScores", JSON.stringify(scores));
};

const Game = props => {
  const plants = useRef([]);
  const [error, setError] = useState(null);
  const [quizzPlants, setQuizzPlants] = useState([]);
  const [scores, setScores] = useState(getLocalScores());

  useEffect(() => {
    (async () => {
      try {
        plants.current = await getData();
        setQuizzPlants(
          getQuizzPlants({
            plants: plants.current,
            count: PLANTS_COUNT,
          }),
        );
      } catch (error) {
        setError(error);
        throw error;
      }
    })();
  }, []);

  useEffect(() => {
    if (!quizzPlants.length) return;
    preloadPhoto(quizzPlants[0]);
  }, [quizzPlants]);

  const onQuizzEnd = quizz => {
    const score = {
      date: Date.now(),
      value: getScoreValue(quizz),
    };
    ReactGA.event({
      category: "Quizz",
      action: "Score",
      value: score.value,
    });
    const newScores = [...scores, score];
    setLocalScores(newScores);
    setScores(newScores);
    props.history.push("/leaderboard");
    setQuizzPlants(
      getQuizzPlants({
        plants: plants.current,
        count: PLANTS_COUNT,
      }),
    );
  };

  return (
    <div className="Game">
      <Header />
      <Route
        exact
        path="/"
        render={routeProps => <Home {...routeProps} plants={quizzPlants} error={error} />}
      />
      <Route
        exact
        path="/quizz"
        render={routeProps =>
          quizzPlants.length > 0 ? (
            <Quizz {...routeProps} plants={quizzPlants} onQuizzEnd={onQuizzEnd} />
          ) : (
            <Redirect to={{ pathname: "/" }} />
          )
        }
      />
      <Route
        exact
        path="/leaderboard"
        render={routeProps => <Leaderboard {...routeProps} scores={scores} />}
      />
    </div>
  );
};

export default withRouter(Game);

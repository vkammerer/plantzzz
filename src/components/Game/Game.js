import React, { useState, useEffect, useRef } from "react";
import ReactGA from "react-ga";
import { Route, Redirect, withRouter } from "react-router-dom";

import { getQuizPlants } from "../../utils/quiz";
import { getData } from "../../utils/data";
import { preloadPhoto, getScoreValue } from "../../utils/helpers";
import Header from "../Header/Header";
import Home from "../Home/Home";
import Quiz from "../Quiz/Quiz";
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
  const [quizPlants, setQuizPlants] = useState([]);
  const [trainingPlants, setTrainingPlants] = useState([]);
  const [scores, setScores] = useState(getLocalScores());

  useEffect(() => {
    (async () => {
      try {
        plants.current = await getData();
        setTrainingPlants(
          getQuizPlants({
            plants: plants.current,
            count: plants.current.length,
          }),
        );
        setQuizPlants(
          getQuizPlants({
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
    if (!quizPlants.length) return;
    preloadPhoto(quizPlants[0]);
  }, [quizPlants]);

  useEffect(() => {
    if (!trainingPlants.length) return;
    preloadPhoto(trainingPlants[0]);
  }, [trainingPlants]);

  const onQuizEnd = quiz => {
    const score = {
      date: Date.now(),
      value: getScoreValue(quiz),
    };
    ReactGA.event({
      category: "Quiz",
      action: "Score",
      value: score.value,
    });
    const newScores = [...scores, score];
    setLocalScores(newScores);
    setScores(newScores);
    props.history.push("/leaderboard");
    setQuizPlants(
      getQuizPlants({
        plants: plants.current,
        count: PLANTS_COUNT,
      }),
    );
  };

  const onTrainingEnd = quiz => {
    const scoreValue = getScoreValue(quiz);
    ReactGA.event({
      category: "Training",
      action: "Score",
      value: (scoreValue * PLANTS_COUNT) / plants.current.length,
    });
    props.history.push("/");
    setTrainingPlants(
      getQuizPlants({
        plants: plants.current,
        count: plants.current.length,
      }),
    );
  };

  return (
    <div className="Game">
      <Header />
      <Route
        exact
        path="/"
        render={routeProps => <Home {...routeProps} plants={quizPlants} error={error} />}
      />
      <Route
        exact
        path="/quiz"
        render={routeProps =>
          quizPlants.length > 0 ? (
            <Quiz {...routeProps} plants={quizPlants} onQuizEnd={onQuizEnd} trackScore />
          ) : (
            <Redirect to={{ pathname: "/" }} />
          )
        }
      />
      <Route
        exact
        path="/training"
        render={routeProps =>
          trainingPlants.length > 0 ? (
            <Quiz {...routeProps} plants={trainingPlants} onQuizEnd={onTrainingEnd} />
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

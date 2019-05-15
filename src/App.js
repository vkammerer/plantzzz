import React, { Component } from "react";
import ReactGA from "react-ga";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { getData } from "./utils/data";
import Game from "./components/Game/Game";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";

import "./App.css";

const getLocalScores = () => {
  const scoresStr = localStorage.getItem("plantzzzScores");
  if (scoresStr) return JSON.parse(scoresStr);
  return [];
};

class App extends Component {
  state = {
    plants: [],
    currentScreen: "home",
    scores: getLocalScores(),
  };

  componentDidMount() {
    (async () => {
      try {
        const plants = await getData();
        this.setState({ plants });
      } catch (error) {
        this.setState({ error });
        throw error;
      }
    })();
  }

  onQuizzEnd = (score, cb) => {
    ReactGA.event({
      category: "Quizz",
      action: "Score",
      value: score.score,
    });
    const scores = [...this.state.scores, score];
    localStorage.setItem("plantzzzScores", JSON.stringify(scores));
    this.setState({ scores }, cb);
  };
  render() {
    return (
      <div className="App">
        <Header />
        <Router>
          <Route
            exact
            path="/"
            render={routeProps => (
              <Home {...routeProps} plants={this.state.plants} error={this.state.error} />
            )}
          />
          <Route
            exact
            path="/game"
            render={routeProps =>
              this.state.plants.length > 0 ? (
                <Game {...routeProps} plants={this.state.plants} onQuizzEnd={this.onQuizzEnd} />
              ) : (
                <Redirect to={{ pathname: "/" }} />
              )
            }
          />
          <Route
            exact
            path="/leaderboard"
            render={routeProps => <Leaderboard {...routeProps} scores={this.state.scores} />}
          />
        </Router>
      </div>
    );
  }
}

export default App;

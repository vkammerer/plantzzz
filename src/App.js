import React, { Component } from "react";

import { getData } from "./utils/data";
import Game from "./components/Game/Game";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Home from "./components/Home/Home";

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

  handleViewLeaderboard = () => {
    this.setState({
      currentScreen: "leaderboard",
    });
  };

  onQuizzStart = () => {
    this.setState({
      currentScreen: "quizz",
    });
  };
  onQuizzEnd = score => {
    const scores = [...this.state.scores, score];
    localStorage.setItem("plantzzzScores", JSON.stringify(scores));
    this.setState({
      scores,
      currentScreen: "leaderboard",
    });
  };
  render() {
    return (
      <div className="App">
        <header>
          <div className="appName">
            <span>P</span>
            <span>L</span>
            <span>A</span>NT<span>Z</span>
            <span>Z</span>
            <span>Z</span>
          </div>
          <div className="appDomain">.web.app</div>
        </header>
        {this.state.currentScreen === "home" && (
          <Home
            plants={this.state.plants}
            error={this.state.error}
            onQuizzStart={this.onQuizzStart}
            handleViewLeaderboard={this.handleViewLeaderboard}
          />
        )}
        {this.state.currentScreen === "quizz" && (
          <Game plants={this.state.plants} onQuizzEnd={this.onQuizzEnd} />
        )}
        {this.state.currentScreen === "leaderboard" && (
          <Leaderboard scores={this.state.scores} onQuizzStart={this.onQuizzStart} />
        )}
      </div>
    );
  }
}

export default App;

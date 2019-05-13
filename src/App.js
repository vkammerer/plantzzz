import React, { Component } from "react";

import { getData } from "./utils/data";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import Loader from "./components/Loader";

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
          <div className="Home">
            <div className="Home_intro">
              <p>
                <span>Plantzzz</span> helps you identify plants and test your knowledge about them.
              </p>
              <p>The faster you answer, the more points you get!</p>
            </div>
            {(this.state.plants.length === 0 || this.state.error) && (
              <Loader error={this.state.error} />
            )}
            {this.state.plants.length > 0 && !this.state.error && (
              <>
                <div className="button Home_button" role="button" onClick={this.onQuizzStart}>
                  Play Quizz
                </div>
                <div
                  className="button Home_button"
                  role="button"
                  onClick={this.handleViewLeaderboard}
                >
                  View Scores
                </div>
              </>
            )}
          </div>
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

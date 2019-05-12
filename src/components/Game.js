import React, { Component } from "react";
import { flatten, clone, cloneDeep } from "lodash";

import { getData } from "../utils/data";
import { getQuizz } from "../utils/quizz";
import Suggestion from "./Suggestion";
import Question from "./Question";
import Loader from "./Loader";
import Score from "./Score";

class Game extends Component {
  state = {
    error: null,
    plants: [],
    quizz: [],
    currentPlantI: 0,
    currentQuestionI: 0,
    isAskingQuestion: true,
    isShowingAnswer: false,
    scoreStart: 0,
    score: null,
  };

  componentDidMount() {
    (async () => {
      try {
        const plants = await getData();
        const quizz = getQuizz(plants);
        this.setState({ plants, quizz });
      } catch (error) {
        this.setState({ error });
        throw error;
      }
    })();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !prevState.quizz[prevState.currentPlantI] &&
      this.state.quizz[this.state.currentPlantI]
    ) {
      setTimeout(() => {
        this.setState({ isAskingQuestion: false });
      }, 1500);
    }
  }

  answer = (type, name) => {
    if (this.state.isShowingAnswer) return;
    const thisQuizz = clone(this.state.quizz);
    const currentPlant = cloneDeep(this.state.quizz[this.state.currentPlantI]);
    const currentQuestion = currentPlant.questions[this.state.currentQuestionI];
    currentQuestion.answer = {
      name,
      value: name === currentPlant[type] ? 1 : 0,
    };
    thisQuizz[this.state.currentPlantI] = currentPlant;
    this.setState({
      isShowingAnswer: true,
      quizz: thisQuizz,
      scoreStart: this.state.score || 0,
      score:
        flatten(thisQuizz.map(p => p.questions)).reduce(
          (acc, q) => acc + (q.answer ? q.answer.value : 0),
          0,
        ) * 100,
    });
    setTimeout(() => {
      this.setState({
        isAskingQuestion: true,
        isShowingAnswer: false,
        currentPlantI:
          this.state.currentQuestionI === 1
            ? this.state.currentPlantI + 1
            : this.state.currentPlantI,
        currentQuestionI: this.state.currentQuestionI === 1 ? 0 : 1,
      });
      setTimeout(() => {
        this.setState({
          isAskingQuestion: false,
        });
      }, 1500);
    }, 1000);
  };

  render() {
    const currentPlant = this.state.quizz[this.state.currentPlantI];
    const currentQuestion = !!currentPlant
      ? currentPlant.questions[this.state.currentQuestionI]
      : null;

    return (
      <div className="Game">
        {typeof this.state.score === "number" && (
          <Score scoreStart={this.state.scoreStart} score={this.state.score} />
        )}
        {!currentPlant && <Loader error={this.state.error} />}
        {!!currentPlant && (
          <div className="Game_plant">
            <div className="Game_plant_photo">
              <div className="Game_plant_photo_container">
                <img
                  key={currentPlant.image.file}
                  src={currentPlant.image.file}
                  alt={currentPlant.name}
                />
              </div>
            </div>
            {this.state.isAskingQuestion && !!currentQuestion && (
              <Question questionType={currentQuestion.type} />
            )}
            {!this.state.isAskingQuestion && (
              <div className="Game_plant_suggestions">
                {currentQuestion.suggestions.map(s => (
                  <Suggestion
                    key={s}
                    currentQuestion={currentQuestion}
                    suggestion={s}
                    answer={this.answer}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Game;

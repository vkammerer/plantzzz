import React, { Component } from "react";
import { clone, cloneDeep } from "lodash";

import { getQuizz } from "../../utils/quizz";
import { wait, getScore } from "../../utils/helpers";

import Suggestions from "../Suggestions/Suggestions";
import Question from "../Question/Question";
import Score from "../Score/Score";
import Photo from "../Photo/Photo";

import "./Game.css";

const QUESTIONS_COUNT = 10;
class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      quizz: getQuizz({
        plants: this.props.plants,
        count: QUESTIONS_COUNT,
      }),
      currentPlantI: 0,
      currentQuestionI: 0,
      isAskingQuestion: false,
      isShowingAnswer: false,
      isHidingSuggestions: true,
      scoreStart: 0,
      score: null,
      quizzStartTime: null,
    };
  }

  startQuestion = async () => {
    this.setState({
      isAskingQuestion: true,
    });
    await wait(2000);
    this.setState({
      quizzStartTime: Date.now(),
      isAskingQuestion: false,
      isHidingSuggestions: false,
    });
  };

  onPhotoLoaded = () => {
    this.preloadImage(this.state.currentPlantI);
    (async () => {
      await wait(500);
      this.startQuestion();
    })();
  };

  preloadImage = plantI => {
    const nextPlant = this.state.quizz[plantI + 1];
    if (!nextPlant) return;

    const nextPlantImage = new Image();
    nextPlantImage.src = `${process.env.PUBLIC_URL}/images/plants/${nextPlant.image.dir}/${
      nextPlant.image.fileName
    }`;
  };

  answer = async (type, name) => {
    if (this.state.isShowingAnswer) return;
    const timeToReply = Date.now() - this.state.quizzStartTime;
    const thisQuizz = clone(this.state.quizz);
    const currentPlant = cloneDeep(this.state.quizz[this.state.currentPlantI]);
    const currentQuestion = currentPlant.questions[this.state.currentQuestionI];
    const value =
      name === currentPlant[type] ? Math.max(Math.floor((10000 - timeToReply) / 200), 10) : -5;
    currentQuestion.answer = {
      name,
      value,
    };
    thisQuizz[this.state.currentPlantI] = currentPlant;
    this.setState({
      isShowingAnswer: true,
      quizz: thisQuizz,
      scoreStart: this.state.score || 0,
      score: getScore(thisQuizz),
    });
    await wait(1000);
    const changePlant = this.state.currentQuestionI === 1;
    if (changePlant && QUESTIONS_COUNT === this.state.currentPlantI + 1) {
      return this.props.onQuizzEnd({
        date: Date.now(),
        score: this.state.score,
      });
    }
    this.setState({
      isShowingAnswer: false,
      isHidingSuggestions: true,
      currentPlantI: changePlant ? this.state.currentPlantI + 1 : this.state.currentPlantI,
      currentQuestionI: changePlant ? 0 : 1,
    });
    if (!changePlant) this.startQuestion();
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
        {!!currentPlant && (
          <div className="Game_plant">
            <Photo currentPlant={currentPlant} onPhotoLoaded={this.onPhotoLoaded} />
            <div className="Game_plant_options">
              {this.state.isAskingQuestion && !!currentQuestion && (
                <Question questionType={currentQuestion.type} />
              )}
              {!this.state.isAskingQuestion && !this.state.isHidingSuggestions && (
                <Suggestions currentQuestion={currentQuestion} answer={this.answer} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Game;

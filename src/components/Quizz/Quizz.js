import React, { useState, useEffect, useRef } from "react";
import { clone, cloneDeep } from "lodash";

import { wait, preloadPhoto, getScoreValue } from "../../utils/helpers";

import Suggestions from "../Suggestions/Suggestions";
import Question from "../Question/Question";
import Score from "../Score/Score";
import Photo from "../Photo/Photo";

import "./Quizz.css";

const Quizz = props => {
  const _isMounted = useRef(false);
  const _suggestionsShowTime = useRef();
  const [_plants, setPlants] = useState(props.plants);
  const [_plantI, setPlantI] = useState(0);
  const [_questionI, setQuestionI] = useState(0);
  const [_optionsView, setOptionsView] = useState("");

  const showQuestion = async () => {
    setOptionsView("question");
    await wait(1650);
    _suggestionsShowTime.current = Date.now();
    setOptionsView("suggestions");
  };

  const handlePhotoLoaded = async () => {
    preloadPhoto(_plants[_plantI + 1]);
    await wait(200);
    showQuestion();
  };

  const handleNewQuestion = () => {
    if (_questionI > 0) showQuestion();
  };

  const handleQuizzUpdate = () => {
    if (!_isMounted.current) return;

    (async () => {
      const isLastPlant = _plantI === _plants.length - 1;
      const isPlantFinished = _questionI === 1;

      await wait(1000);
      setOptionsView("");

      if (isLastPlant && isPlantFinished) {
        props.onQuizzEnd(_plants);
        return;
      }
      if (isPlantFinished) {
        setPlantI(_plantI + 1);
        setQuestionI(0);
      } else {
        setQuestionI(1);
      }
    })();
  };

  const handleMount = () => {
    _isMounted.current = true;
    return () => (_isMounted.current = false);
  };

  useEffect(handleNewQuestion, [_questionI]);
  useEffect(handleQuizzUpdate, [_plants]);
  useEffect(handleMount, []);

  const handleUserAnswer = async name => {
    if (_plants[_plantI].userAnswer) return;

    const timeToReply = Date.now() - _suggestionsShowTime.current;
    const clonedPlant = cloneDeep(_plants[_plantI]);
    clonedPlant.questions[_questionI].userAnswer = name;
    clonedPlant.questions[_questionI].timeToReply = timeToReply;

    const clonedQuizz = clone(_plants);
    clonedQuizz[_plantI] = clonedPlant;
    setPlants(clonedQuizz);
  };

  const currentPlant = _plants[_plantI];
  const currentQuestion = !!currentPlant ? currentPlant.questions[_questionI] : null;
  const scoreValue = getScoreValue(_plants);

  return (
    <div className="Quizz">
      {typeof scoreValue === "number" && <Score scoreValue={scoreValue} />}
      {!!currentPlant && (
        <div className="Plant">
          <Photo
            currentPlantI={_plantI}
            currentPlant={currentPlant}
            onPhotoLoaded={handlePhotoLoaded}
            plantsCount={_plants.length}
          />
          <div className="Plant_Options">
            {_optionsView === "question" && <Question questionType={currentQuestion.type} />}
            {_optionsView === "suggestions" && (
              <Suggestions currentQuestion={currentQuestion} handleUserAnswer={handleUserAnswer} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quizz;

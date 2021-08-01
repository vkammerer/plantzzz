import React, { useState, useEffect, useRef } from "react";
import { clone, cloneDeep } from "lodash";

import { wait, preloadPhoto, getScoreValue } from "../../utils/helpers";

import Suggestions from "../Suggestions/Suggestions";
import Question from "../Question/Question";
import Score from "../Score/Score";
import Photo from "../Photo/Photo";

import "./Quiz.css";

const Quiz = (props) => {
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

  const plantsRef = useRef();
  const handleQuizUpdate = () => {
    if (plantsRef.current === _plants) return;
    plantsRef.current = _plants;
    if (!_isMounted.current) return;

    (async () => {
      const isLastPlant = _plantI === _plants.length - 1;
      const isPlantFinished = _questionI === 1;

      await wait(1000);
      setOptionsView("");

      if (isLastPlant && isPlantFinished) {
        props.onQuizEnd(_plants);
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
  useEffect(handleQuizUpdate, [_plantI, _plants, _questionI, props]);
  useEffect(handleMount, []);

  const handleUserAnswer = async (name) => {
    if (_plants[_plantI].userAnswer) return;

    const timeToReply = Date.now() - _suggestionsShowTime.current;
    const clonedPlant = cloneDeep(_plants[_plantI]);
    clonedPlant.questions[_questionI].userAnswer = name;
    clonedPlant.questions[_questionI].timeToReply = timeToReply;

    const clonedPlants = clone(_plants);
    clonedPlants[_plantI] = clonedPlant;
    setPlants(clonedPlants);
  };

  const plant = _plants[_plantI];
  const question = plant.questions[_questionI];
  const isBeforeFirstAnswer = _plantI === 0 && _questionI === 0 && !question.userAnswer;
  const scoreValue = getScoreValue(_plants);

  return (
    <div className="Quiz">
      {!isBeforeFirstAnswer && props.trackScore && <Score scoreValue={scoreValue} />}
      <div className="Plant">
        <Photo
          plantI={_plantI}
          plant={plant}
          handlePhotoLoaded={handlePhotoLoaded}
          plantsCount={_plants.length}
        />
        <div className="Plant_Options">
          {_optionsView === "question" && <Question questionType={question.type} />}
          {_optionsView === "suggestions" && (
            <Suggestions question={question} handleUserAnswer={handleUserAnswer} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

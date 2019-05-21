import React from "react";
import classnames from "classnames";

import "./Suggestions.css";

const Suggestion = ({ suggestion, handleUserAnswer, isSelected }) => {
  const thisClass = classnames("Suggestion", {
    Suggestion_selected: isSelected,
  });
  return (
    <div role="button" className={thisClass} onClick={() => handleUserAnswer(suggestion)}>
      {suggestion}
    </div>
  );
};

const Suggestions = ({ currentQuestion, handleUserAnswer }) => {
  const thisClass = classnames("Suggestions", {
    Suggestions_botanical: currentQuestion.type === "botanicalName",
    Suggestions_common: currentQuestion.type === "commonName",
    Suggestions_true:
      currentQuestion.userAnswer && currentQuestion.userAnswer === currentQuestion.correctAnswer,
    Suggestions_false:
      currentQuestion.userAnswer && currentQuestion.userAnswer !== currentQuestion.correctAnswer,
  });
  return (
    <div className={thisClass}>
      {currentQuestion.suggestions.map(s => (
        <Suggestion
          key={s}
          suggestion={s}
          handleUserAnswer={handleUserAnswer}
          isSelected={currentQuestion.userAnswer === s}
        />
      ))}
    </div>
  );
};

export default Suggestions;

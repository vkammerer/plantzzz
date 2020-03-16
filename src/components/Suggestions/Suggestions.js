import React from "react";
import classnames from "classnames";

import "./Suggestions.css";

const Suggestion = ({ suggestion, handleUserAnswer, isCorrect, isSelected }) => {
  const thisClass = classnames("Suggestion", {
    Suggestion_selected: isSelected,
    Suggestion_correct: isCorrect
  });
  return (
    <div role="button" className={thisClass} onClick={() => handleUserAnswer(suggestion)}>
      {suggestion}
    </div>
  );
};

const Suggestions = ({ question, handleUserAnswer }) => {
  const thisClass = classnames("Suggestions", {
    Suggestions_botanical: question.type === "botanicalName",
    Suggestions_common: question.type === "commonName",
    Suggestions_true: question.userAnswer && question.userAnswer === question.correctAnswer,
    Suggestions_false: question.userAnswer && question.userAnswer !== question.correctAnswer
  });
  return (
    <div className={thisClass}>
      {question.suggestions.map(s => (
        <Suggestion
          key={s}
          suggestion={s}
          handleUserAnswer={handleUserAnswer}
          isCorrect={question.correctAnswer === s}
          isSelected={question.userAnswer === s}
        />
      ))}
    </div>
  );
};

export default Suggestions;

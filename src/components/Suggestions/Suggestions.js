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

const Suggestions = ({ question, handleUserAnswer }) => {
  const thisClass = classnames("Suggestions", {
    Suggestions_botanical: question.type === "botanicalName",
    Suggestions_common: question.type === "commonName",
    Suggestions_true: question.userAnswer && question.userAnswer === question.correctAnswer,
    Suggestions_false: question.userAnswer && question.userAnswer !== question.correctAnswer,
  });
  return (
    <div className={thisClass}>
      {question.suggestions.map(s => (
        <Suggestion
          key={s}
          suggestion={s}
          handleUserAnswer={handleUserAnswer}
          isSelected={question.userAnswer === s}
        />
      ))}
    </div>
  );
};

export default Suggestions;

import React from "react";
import classnames from "classnames";

const Suggestion = ({ currentQuestion, suggestion, answer }) => {
  const thisClass = classnames("Game_plant_suggestion");
  return (
    <div
      role="button"
      className={thisClass}
      onClick={() => answer(currentQuestion.type, suggestion)}
    >
      {suggestion}
    </div>
  );
};

const Suggestions = ({ currentQuestion, answer }) => {
  const hasReplied = !!currentQuestion.answer;
  const thisClass = classnames("Game_plant_suggestions", {
    Game_plant_suggestions_botanical: currentQuestion.type === "botanicalName",
    Game_plant_suggestions_common: currentQuestion.type === "commonName",
    Game_plant_suggestions_true: hasReplied && currentQuestion.answer.value > 1,
    Game_plant_suggestions_false: hasReplied && currentQuestion.answer.value < 0,
  });
  return (
    <div className={thisClass}>
      {currentQuestion.suggestions.map(s => (
        <Suggestion key={s} currentQuestion={currentQuestion} suggestion={s} answer={answer} />
      ))}
    </div>
  );
};

export default Suggestions;

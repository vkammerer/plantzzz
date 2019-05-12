import React from "react";

const Question = ({ questionType }) => {
  return (
    <div className="Game_plant_question">
      <span>What's my</span>
      <span>
        {questionType === "botanicalName" ? "botanical name" : "common name"} ?
      </span>
    </div>
  );
};

export default Question;

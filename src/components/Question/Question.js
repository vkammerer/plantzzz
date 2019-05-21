import React from "react";
import "./Question.css";

const Question = ({ questionType }) => {
  return (
    <div className="Question">
      <span>What's my</span>
      <span>{questionType === "botanicalName" ? "botanical name" : "common name"} ?</span>
    </div>
  );
};

export default Question;

import React from "react";
import "./Loader.css";

const Loader = ({ error }) => {
  return (
    <div className="Game_message">
      {!error && "Loading Quizz"}
      {error &&
        `
Error loading quizz data:
${JSON.stringify(error)}
`}
    </div>
  );
};

export default Loader;

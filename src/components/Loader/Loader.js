import React from "react";
import "./Loader.css";

const Loader = ({ error }) => {
  return (
    <div className="Loader">
      {!error && "Loading Quiz"}
      {error &&
        `
Error loading quiz data:
${JSON.stringify(error)}
`}
    </div>
  );
};

export default Loader;

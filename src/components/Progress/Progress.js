import React from "react";
import "./Progress.css";

const Progress = props => {
  return (
    <div className="Progress" style={props.style}>
      {props.currentPlantI + 1}/{props.plantsCount}
    </div>
  );
};

export default Progress;

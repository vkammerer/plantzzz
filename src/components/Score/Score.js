import React, { useState, useEffect, useRef, memo } from "react";
import CountUp from "react-countup";
import classnames from "classnames";

import "./Score.css";

const Score = props => {
  const scoreValueRef = useRef(0);

  const [{ direction, scoreValueStart }, setState] = useState({
    direction: null,
    scoreValueStart: 0,
  });

  const handleScoreChange = scoreValue => {
    const direction = scoreValue > scoreValueRef.current ? "up" : "down";
    setState({ direction, scoreValueStart: scoreValueRef.current });
    scoreValueRef.current = scoreValue;
  };

  useEffect(() => handleScoreChange(props.scoreValue), [props.scoreValue]);

  const thisClass = classnames("Score", {
    Score_up: direction === "up",
    Score_down: direction === "down",
  });

  return (
    <div key={props.scoreValue} className={thisClass}>
      <CountUp start={scoreValueStart} end={props.scoreValue} duration={1} delay={0}>
        {({ countUpRef }) => <div ref={countUpRef} />}
      </CountUp>
    </div>
  );
};

export default memo(Score);

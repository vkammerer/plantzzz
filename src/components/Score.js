import React from "react";
import CountUp from "react-countup";

const Score = ({ scoreStart, score }) => {
  return (
    <CountUp start={scoreStart} end={score} duration={1} delay={0}>
      {({ countUpRef }) => <div className="Game_score" ref={countUpRef} />}
    </CountUp>
  );
};

export default Score;

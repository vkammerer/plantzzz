import React, { Component } from "react";
import CountUp from "react-countup";
import classnames from "classnames";

import "./Score.css";

class Score extends Component {
  state = { direction: null, animationTime: null };
  componentDidMount() {
    this.handleScoreChange(this.props.score);
  }
  componentDidUpdate(prevProps) {
    const delta = this.props.score - prevProps.score;
    if (delta !== 0) this.handleScoreChange(delta);
  }
  handleScoreChange = delta => {
    const animationTime = Date.now();
    if (0 < delta) this.setState({ direction: "up", animationTime });
    else if (0 > delta) this.setState({ direction: "down", animationTime });
  };
  render() {
    const thisClass = classnames("Game_score", {
      Game_score_up: this.state.direction === "up",
      Game_score_down: this.state.direction === "down",
    });
    return (
      <div key={this.state.animationTime} className={thisClass}>
        <CountUp start={this.props.scoreStart} end={this.props.score} duration={1} delay={0}>
          {({ countUpRef }) => <div ref={countUpRef} />}
        </CountUp>
      </div>
    );
  }
}

export default Score;

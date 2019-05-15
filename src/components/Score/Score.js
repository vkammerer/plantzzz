import React, { Component } from "react";
import CountUp from "react-countup";
import classnames from "classnames";
import { wait } from "../../utils/helpers";

import "./Score.css";

class Score extends Component {
  state = { direction: null, animationTime: null };
  componentDidMount() {
    if (0 < this.props.score) {
      this.kick("up");
    } else if (0 > this.props.score) {
      this.kick("down");
    }
  }
  kick = async direction => {
    this.setState({ direction, animationTime: Date.now() });
  };
  componentDidUpdate(prevProps) {
    if (prevProps.score < this.props.score) {
      this.kick("up");
    } else if (prevProps.score > this.props.score) {
      this.kick("down");
    }
  }
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

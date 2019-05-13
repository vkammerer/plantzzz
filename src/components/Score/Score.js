import React, { Component } from "react";
import CountUp from "react-countup";
import classnames from "classnames";

import "./Score.css";

class Score extends Component {
  state = { direction: null };
  componentDidMount() {
    if (0 < this.props.score) {
      this.setState({ direction: "up" });
    } else if (0 > this.props.score) {
      this.setState({ direction: "down" });
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.score < this.props.score) {
      this.setState({ direction: "up" });
    } else if (prevProps.score > this.props.score) {
      this.setState({ direction: "down" });
    }
  }
  render() {
    const thisClass = classnames("Game_score", {
      Game_score_up: this.state.direction === "up",
      Game_score_down: this.state.direction === "down",
    });
    return (
      <CountUp start={this.props.scoreStart} end={this.props.score} duration={1} delay={0}>
        {({ countUpRef }) => <div className={thisClass} ref={countUpRef} />}
      </CountUp>
    );
  }
}

export default Score;

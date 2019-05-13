import React, { Component } from "react";
import CountUp from "react-countup";
import classnames from "classnames";
import { wait } from "../../utils/helpers";

import "./Score.css";

class Score extends Component {
  state = { direction: null };
  componentDidMount() {
    this.mounted = true;
    if (0 < this.props.score) {
      this.setState({ direction: "up" });
      this.reset();
    } else if (0 > this.props.score) {
      this.setState({ direction: "down" });
      this.reset();
    }
  }
  reset = async () => {
    await wait(1200);
    if (this.mounted) {
      this.setState({ direction: null });
    }
  };
  componentDidUpdate(prevProps) {
    if (prevProps.score < this.props.score) {
      this.setState({ direction: "up" });
      this.reset();
    } else if (prevProps.score > this.props.score) {
      this.setState({ direction: "down" });
      this.reset();
    }
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  render() {
    const thisClass = classnames("Game_score", {
      Game_score_up: this.state.direction === "up",
      Game_score_down: this.state.direction === "down",
    });
    return (
      <div className={thisClass}>
        <CountUp start={this.props.scoreStart} end={this.props.score} duration={1} delay={0}>
          {({ countUpRef }) => <div ref={countUpRef} />}
        </CountUp>
      </div>
    );
  }
}

export default Score;

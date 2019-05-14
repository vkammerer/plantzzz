import React, { Component } from "react";
import "./Progress.css";

class Progress extends Component {
  state = {};
  render() {
    return (
      <div className="Game_Progress" style={this.props.style}>
        {this.props.currentPlantI + 1}/{this.props.plantsCount}
      </div>
    );
  }
}

export default Progress;

import React, { Component } from "react";
import classnames from "classnames";

import Progress from "../Progress/Progress";
import { wait } from "../../utils/helpers";
import "./Photo.css";

class Photo extends Component {
  state = { loaded: false, progressStyle: {} };
  componentDidUpdate(prevProps) {
    if (this.props.currentPlant.image.fileName !== prevProps.currentPlant.image.fileName) {
      this.setState({ loaded: false });
    }
  }
  onLoad = async () => {
    var imgRef = this.imgRef.getBoundingClientRect();
    var photoRef = this.photoRef.getBoundingClientRect();
    this.setState({
      progressStyle: {
        top: `${imgRef.top + 2 - photoRef.top}px`,
        right: `${photoRef.right - imgRef.right + 2}px`,
      },
      loaded: true,
    });
    await wait(550);
    this.props.onPhotoLoaded();
  };
  render() {
    const thisClass = classnames("Game_Photo_container", {
      Game_Photo_container_loaded: this.state.loaded,
    });
    const currentPlantImagePath = `${process.env.PUBLIC_URL}/images/plants/750${
      this.props.currentPlant.image.dir
    }/${this.props.currentPlant.image.fileName}`;
    return (
      <div className="Game_Photo">
        <div
          ref={r => (this.photoRef = r)}
          key={this.props.currentPlant.image.file}
          className={thisClass}
        >
          <img
            ref={r => (this.imgRef = r)}
            src={currentPlantImagePath}
            onLoad={this.onLoad}
            alt={this.props.currentPlant.botanicalName}
          />
          <Progress
            style={this.state.progressStyle}
            currentPlantI={this.props.currentPlantI}
            plantsCount={10}
          />
        </div>
      </div>
    );
  }
}

export default Photo;

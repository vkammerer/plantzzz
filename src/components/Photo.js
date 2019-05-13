import React, { Component } from "react";
import classnames from "classnames";

import { wait } from "../utils/helpers";

class Photo extends Component {
  state = { loaded: false };
  componentDidUpdate(prevProps) {
    if (this.props.currentPlant.image.fileName !== prevProps.currentPlant.image.fileName) {
      this.setState({ loaded: false });
    }
  }
  onLoad = async () => {
    await wait(100);
    this.props.onPhotoLoaded();
    this.setState({ loaded: true });
  };
  render() {
    const thisClass = classnames({
      Game_plant_photo_loaded: this.state.loaded,
    });
    const currentPlantImagePath = `${process.env.PUBLIC_URL}/images/plants/${
      this.props.currentPlant.image.dir
    }/${this.props.currentPlant.image.fileName}`;
    return (
      <div className="Game_plant_photo">
        <div key={this.props.currentPlant.image.file} className="Game_plant_photo_container">
          <img
            src={currentPlantImagePath}
            onLoad={this.onLoad}
            alt={this.props.currentPlant.botanicalName}
            className={thisClass}
          />
        </div>
      </div>
    );
  }
}

export default Photo;

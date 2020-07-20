import React, { useRef, useState, useEffect } from "react";
import classnames from "classnames";

import Progress from "../Progress/Progress";
import { wait, getPhotoPath } from "../../utils/helpers";
import "./Photo.css";

const Photo = (props) => {
  const photoEl = useRef(null);
  const imgEl = useRef(null);
  const currentPlantImageFileName = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [progressStyle, setProgressStyle] = useState({});

  const onLoad = async () => {
    const imgRect = imgEl.current.getBoundingClientRect();
    const photoRect = photoEl.current.getBoundingClientRect();
    setIsLoaded(true);
    setProgressStyle({
      top: `${imgRect.top + 2 - photoRect.top}px`,
      right: `${photoRect.right - imgRect.right + 2}px`,
    });
    await wait(550);
    props.handlePhotoLoaded();
  };

  useEffect(() => {
    if (currentPlantImageFileName.current !== null) setIsLoaded(false);
    currentPlantImageFileName.current = props.plant.image.fileName;
  }, [currentPlantImageFileName, props.plant.image.fileName]);

  const thisClass = classnames("Photo_container", {
    Photo_container_loaded: isLoaded,
  });
  const plantImagePath = getPhotoPath(props.plant.image);
  return (
    <div className="Photo">
      <div ref={photoEl} key={props.plant.image.file} className={thisClass}>
        <img ref={imgEl} src={plantImagePath} onLoad={onLoad} alt={props.plant.botanicalName} />
        <Progress style={progressStyle} plantI={props.plantI} plantsCount={props.plantsCount} />
      </div>
    </div>
  );
};

export default Photo;

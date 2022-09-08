import { debounce } from "lodash";

const getRem = (vw, vh) => {
  const distortion = getDistortion(vw, vh);
  if (distortion === 0) return vh * 0.7 * 4;
  return vw * 4 + distortion * 10;
};

const getDistortion = (vw, vh) => {
  const ratio = vw / vh;
  if (ratio > 0.7) return 0;
  return 0.7 - ratio;
};
export const initCorrectVh = () => {
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    const vw = window.innerWidth * 0.01;
    const rem = getRem(vw, vh);
    const distortion = getDistortion(vw, vh);
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    document.documentElement.style.setProperty("--distortion", `${distortion * 150}px`);
    document.documentElement.style.setProperty("--rem", `${rem}px`);
  };

  // We listen to the resize event
  window.addEventListener("resize", debounce(setVh, 100));
  setVh();
};

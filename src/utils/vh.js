import { debounce } from "lodash";

const getRem = (vw, vh) => {
  if (vw / vh > 0.7) return vh * 0.7 * 4;
  return vw * 4;
};

export const initCorrectVh = () => {
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    const vw = window.innerWidth * 0.01;
    const rem = getRem(vw, vh);
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    document.documentElement.style.setProperty("--rem", `${rem}px`);
  };

  // We listen to the resize event
  window.addEventListener("resize", debounce(setVh, 100));
  setVh();
};

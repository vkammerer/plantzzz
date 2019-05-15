const getRem = (vw, vh) => {
  if (vw / vh > 0.7) return vh * 3.8 * 0.7;
  if (vw / vh < 0.6) return vw * 4.5;
  return vw * 4.2;
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
  window.addEventListener("resize", setVh);
  setVh();
};

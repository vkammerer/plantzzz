export const initCorrectVh = () => {
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    const vw = window.innerWidth * 0.01;
    const rem = vw / vh < 0.7 ? vw * 4.5 : vh * 4.5 * 0.7;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    document.documentElement.style.setProperty("--rem", `${rem}px`);
  };

  // We listen to the resize event
  window.addEventListener("resize", setVh);
  setVh();
};

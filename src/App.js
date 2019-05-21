import React from "react";
import { BrowserRouter } from "react-router-dom";

import Game from "./components/Game/Game";

import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Game />
    </BrowserRouter>
  );
};

export default App;

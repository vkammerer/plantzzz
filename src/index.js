import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { initCorrectVh } from "./utils/vh";
import ReactGA from "react-ga";

if (window.location.hostname !== "localhost") {
  ReactGA.initialize("UA-140160255-1");
}

initCorrectVh();

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

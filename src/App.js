import React from 'react';
import Game from './components/Game';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <div className="appName">
          <span>P</span><span>L</span><span>A</span>NT<span>Z</span><span>Z</span><span>Z</span>
        </div>
        <div className="appDomain">
          .web.app
        </div>
      </header>
      <Game />
    </div>
  );
}

export default App;

import React, { Component } from 'react';
import './App.css';
import SnakeGame from './game'

class App extends Component {
  render() {
    return (
      <div className="App">
        <SnakeGame></SnakeGame>
      </div>
    );
  }
}

export default App;

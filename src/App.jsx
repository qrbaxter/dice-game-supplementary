import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import Game from './pages/Game';
import Instructions from './pages/Instructions';

export default function App() {
  return (
    <div>
      <nav>
        <Link className="game" to="/">
          Game
        </Link>
        <Link className="instructions" to="/instructions">
          Instructions
        </Link>
      </nav>

      <Switch>
        <Route exact path="/">
          <Game />
        </Route>
        <Route exact path="/instructions">
          <Instructions />
        </Route>
      </Switch>
    </div>
  );
}

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './home';
import Mode from './mode';
import Song from './song';
import Game from './game';
import Replay from './replay';

const Routes = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home}></Route> /* First page that user see */
	  <Route path='/mode' component={Mode}></Route>
	  <Route path='/song-:id' component={Song}></Route>
	  <Route path='/m:id' component={Game}></Route>
	  <Route path='/r' component={Replay}></Route>
	  <Route render={() => <Redirect to={{pathname: "/"}} />} />
    </Switch>
  );
}

export default Routes;
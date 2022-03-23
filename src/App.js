import React from 'react';
import logo from './logo.svg';
import Routes from './routes';
import { withRouter } from "react-router-dom";

class App extends React.Component {
	render (){
		return (
			<div className="App">
				<Routes />
			</div>
		);
	}
}

export default withRouter(App);

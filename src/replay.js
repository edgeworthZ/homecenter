import React from 'react';
import ReactDOM from 'react-dom';
import  { Redirect } from 'react-router-dom'
import './Game.css';

class Replay extends React.Component {
	
	constructor(props) {
		super(props);
	 }

	componentDidMount() {
		window.addEventListener('load', this.handleLoad);
	}
	
	render (){
		return (
		  <Redirect to={"/" +window.$game} />
		)
	}
}

export default Replay;

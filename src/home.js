import React from 'react';
import ReactDOM from 'react-dom';
import './Game.css';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.handleLoad = this.handleLoad.bind(this);
		
		// This binding is necessary to make `this` work in the callback
		this.handleClick = this.handleClick.bind(this);
		
		
		this.state = {
			render: false //Set render state to false
		}
	 }
	 
	 handleClick(){
		this.props.history.push('/mode');
	 }
	
	componentDidMount() {
		window.addEventListener('load', this.handleLoad);
	}
	
	componentWillUnmount() { 
	   window.removeEventListener('load', this.handleLoad)  
	}
	
	handleLoad() {
		console.log("YEAH!");
	}
	
	render (){
		return (
		  <div className="Home">
			<div className="home">
				<button className="h-button"><img className="home-button" src="/img/button0.png" alt="my image" onClick={this.handleClick} /></button>
			</div>
		   </div>
		)
	}
}

export default Home;

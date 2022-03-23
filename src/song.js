import React from 'react';
import ReactDOM from 'react-dom';
import './Game.css';

class Song extends React.Component {
	constructor(props) {
		super(props);
		this.handleLoad = this.handleLoad.bind(this);
		this.play = this.play.bind(this);
		this.state = {
			render: false //Set render state to false
		}
	 }
	
	componentDidMount() {
		window.addEventListener('load', this.handleLoad);
	}
	
	componentWillUnmount() { 
	   for (var i = 1; i < 99999; i++)
			window.clearInterval(i);
	   window.removeEventListener('load', this.handleLoad)  
	}
	
	play(){
		this.props.history.push('/m'+this.props.match.params.id+'0');
	 }
	
	handleLoad() {
		console.log("YEAH! Song!");
	}
	
	render (){
		return (
		  <div className="Song">
			<main>
				<div className="mode-bg">
					<img src="/img/s00.png" />
					
					<div className="mode__buttons">
						<img className="mode-button" src="/img/si00.jpg" alt="my image" onClick={this.play} />
				    </div>
				</div>
				
			</main>
		   </div>
		)
	}
}

export default Song;

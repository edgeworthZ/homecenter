import React from 'react';
import ReactDOM from 'react-dom';
import './Game.css';

class Mode extends React.Component {
	constructor(props) {
		super(props);
		this.handleLoad = this.handleLoad.bind(this);
		this.modeA = this.modeA.bind(this);
		this.modeB = this.modeB.bind(this);
		this.modeC = this.modeC.bind(this);
		this.back = this.back.bind(this);
		this.state = {
			render: false //Set render state to false
		}
	 }
	
	componentDidMount() {
		window.addEventListener('load', this.handleLoad);
	}
	
	componentWillUnmount() { 
	   window.removeEventListener('load', this.handleLoad)  
	}
	
	modeA(){
		this.props.history.push('/song-a');
	 }
	 
	 modeB(){
		this.props.history.push('/song-b');
	 }
	 
	 modeC(){
		this.props.history.push('/song-c');
	 }
	
	handleLoad() {
		console.log("YEAH! Mode!");
	}
	
	 back(){
		//this.props.history.goBack();
		this.props.history.push('/');
	 }
	
	render (){
		return (
		  <div className="Mode">
			<main>
				<img className="back__button" src="/img/buttonB.png" alt="my image" onClick={this.back} />
				
				<div className="mode-bg">
					<img src="/img/m00.png" />
					
					<div className="mode__buttons">
						<img className="mode-button" src="/img/m01.png" alt="my image" onClick={this.modeA} />
						<img className="mode-button" src="/img/m02.png" alt="my image" onClick={this.modeB} />
						<img className="mode-button" src="/img/m03.png" alt="my image" onClick={this.modeC} />
				    </div>
				</div>
				
			</main>
		   </div>
		)
	}
}

export default Mode;

import React from 'react';
import ReactDOM from 'react-dom';
import './Game.css';

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.handleLoad = this.handleLoad.bind(this);
		this.handleButton1 = this.handleButton1.bind(this);
		this.handleButton2 = this.handleButton2.bind(this);
		this.handleButton3 = this.handleButton3.bind(this);
		this.state = {
			render: false //Set render state to false
		}
		this.scr = null;
	 }
	 
	 handleButton1(){
		this.props.history.push('/song-'+window.location.pathname.split('/').pop()[1]);
	 }
	 
	 handleButton2(){
		this.props.history.push('/mode');
	 }
	 
	 handleButton3(){
		window.location.reload(false);
	 }
	
	componentDidMount() {
		window.addEventListener('load', this.handleLoad);
		
		const script = document.createElement("script");
		script.src = "/js/script.js";
		script.async = true;

		document.body.appendChild(script);
		
		this.scr = script;
	}
	
	componentWillUnmount() { 
	   window.removeEventListener('load', this.handleLoad);
	   document.body.removeChild(this.scr);
	}
	
	handleLoad() {
		console.log("YEAH! Game!");
	}
	
	render (){
		return (
		  <div className="Game">
			<div id="target"></div>

			<audio className="song" crossOrigin="anonymous" src="media/music.mp3"></audio>

			<main>
			  <div className="game">
				 <div className="live__score">
				  <div className="live__score__text">Score: 0</div>
				</div>
				
				<div className="background__gif">
				
				</div>
			  
				<div className="hit">
				  <div className="hit__combo"></div>
				  <div className="hit__accuracy"></div>
				</div>
			  
				 <div className="lyric">
				  <div className="lyric__upper__text">I want to be your friend.</div>
				  <div className="lyric__lower__text">Because you're here with me.</div>
				</div>

				<div className="track-container"></div>

				<div className="key-container">
				  <div className="key key--s key--blue">
					<div className="keypress keypress--blue"></div>
					<span>L</span>
				  </div>
				  <div className="key key--l key--blue">
					<div className="keypress keypress--blue"></div>
					<span>R</span>
				  </div>
				</div>
			  </div>

			  <div className="menu">
				<div className="menu__song">
				  <h2>Your Name OST - Kataware Doki</h2>
				  <div>
					<p>Original song composed by <span>Yojiro Noda</span></p>
				  </div>
				</div>
				
		
					<div className="game__img">
						<img className="game-img" src="/img/si00.jpg" alt="my image" onClick={this.play} />
				    </div>
		
				<div className="menu__config">
				  <div className="menu_start">
					<h2>Left</h2>
					<h2>Sensor</h2>
					<div className="connect cl">
						<p>Connected!</p>
					</div>
					<div className="btn btn--primary game-start-button cbl" id="connectButtonL" >Connect</div>
				  </div>
				  <div className="menu_start">
					<h2>Right</h2>
					<h2>Sensor</h2>
					<div className="connect cr">
						<p>Connected!</p>
					</div>
					<div className="btn btn--primary game-start-button cbr" id="connectButtonR" >Connect</div>
				  </div>
				</div>

				<div className="menu__config">
				  <div className="config__speed">
					<h2>Speed</h2>
					<div>
					  <a className="btn btn--small btn--selected" href="#">1x</a>
					  <a className="btn btn--small" href="#">2x</a>
					  <a className="btn btn--small" href="#">3x</a>
					</div>
				  </div>
				  
				   <div className="menu_start">
					<h2>Start</h2>
					<div className="btn btn--primary btn--start game-start-button" >Start</div>
				  </div>
				</div>

				
			  </div>

			  <div className="summary">
				<div className="summary__timer"></div>
				<div className="summary__result">
				  <h2 className="result__heading">You did great!!!</h2>
				  <div className="result__accuracy perfect">
					<p className="accuracy__heading">Perfect</p>
					<span>:</span>
					<p className="accuracy__count perfect__count"></p>
				  </div>
				  <div className="result__accuracy good">
					<p className="accuracy__heading">Good</p>
					<span>:</span>
					<p className="accuracy__count good__count"></p>
				  </div>
				  <div className="result__accuracy bad">
					<p className="accuracy__heading">Bad</p>
					<span>:</span>
					<p className="accuracy__count bad__count"></p>
				  </div>
				  <div className="result__accuracy miss">
					<p className="accuracy__heading">Miss</p>
					<span>:</span>
					<p className="accuracy__count miss__count"></p>
				  </div>
				  <div className="result__accuracy combo">
					<p className="accuracy__heading">Max Combo</p>
					<span>:</span>
					<p className="accuracy__count combo__count"></p>
				  </div>
				  <div className="result__accuracy score">
					<p className="accuracy__heading">Score</p>
					<span>:</span>
					<p className="accuracy__count score__count"></p>
				  </div>
				  
				  <div className="summary__buttons">
					<img className="summary-button" src="/img/button20.png" alt="my image" onClick={this.handleButton1} />
					<img className="summary-button" src="/img/button21.png" alt="my image" onClick={this.handleButton2} />
					<img className="summary-button" src="/img/button22.png" alt="my image" onClick={this.handleButton3} />
				  </div>
				  
				</div>
				
			  </div>
			</main>
		   </div>
		)
	}
}

export default Game;

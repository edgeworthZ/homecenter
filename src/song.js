import React, { useState } from 'react';
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

	
	
	render() {

		let content = [];
		
		let selectall = (<>
			<button className='songfi'>
				<h1 className='songall'>ALL</h1>
			</button>
			
			<button className='songfi2'>
				<h1 className='songth'>THAI</h1>
			</button>
			
			<button className='songfi3'>
				<h1 className='songeng'>ENGLISH</h1>
			</button>
			
			<button className='songfi4'>
				<h1 className='songjp'>JAPAN</h1>
			</button>
			
			<button className='songfi5'>
				<h1 className='songkr'>KOREA</h1>
			</button>
			
			<div className='song_bg'>
				<div className='song_rol'>
					<img className='picofsong' src="/img/si00.jpg"></img>
					<h1 className='songname'>YOUR NAME OST - KATAWARE DOKI</h1>
					<h2 className='singername'>Yojiro Noda</h2>
					<div className="song__buttons">
						<img className="mode-button" src="/img/button_start.png" alt="my image" onClick={this.play} />
					</div>
				</div>
			</div>
		</>);

		let selectth = (<>
			<button className='songfi11'>
				<h1 className='songall2'>ALL</h1>
			</button>

			<button className='songfi22'>
				<h1 className='songth2'>THAI</h1>
			</button>

			<button className='songfi3'>
				<h1 className='songeng'>ENGLISH</h1>
			</button>

			<button className='songfi4'>
				<h1 className='songjp'>JAPAN</h1>
			</button>

			<button className='songfi5'>
				<h1 className='songkr'>KOREA</h1>
			</button>

			<div className='song_bg'>
				{ content }
			</div>
		</>);

		let selecteng = (<>
			<button className='songfi11'>
				<h1 className='songall2'>ALL</h1>
			</button>

			<button className='songfi2'>
				<h1 className='songth'>THAI</h1>
			</button>

			<button className='songfi33'>
				<h1 className='songeng2'>ENGLISH</h1>
			</button>

			<button className='songfi4'>
				<h1 className='songjp'>JAPAN</h1>
			</button>

			<button className='songfi5'>
				<h1 className='songkr'>KOREA</h1>
			</button>

			<div className='song_bg'>
				{ content }
			</div>
		</>);

		let selectjp = (<>
			<button className='songfi11'>
				<h1 className='songall2'>ALL</h1>
			</button>

			<button className='songfi2'>
				<h1 className='songth'>THAI</h1>
			</button>

			<button className='songfi3'>
				<h1 className='songeng'>ENGLISH</h1>
			</button>

			<button className='songfi44'>
				<h1 className='songjp2'>JAPAN</h1>
			</button>

			<button className='songfi5'>
				<h1 className='songkr'>KOREA</h1>
			</button>

			<div className='song_bg'>
				{ content }
			</div>
		</>);

		let selectkr = (<>
			<button className='songfi11'>
				<h1 className='songall2'>ALL</h1>
			</button>

			<button className='songfi2'>
				<h1 className='songth'>THAI</h1>
			</button>

			<button className='songfi3'>
				<h1 className='songeng'>ENGLISH</h1>
			</button>

			<button className='songfi4'>
				<h1 className='songjp'>JAPAN</h1>
			</button>

			<button className='songfi55'>
				<h1 className='songkr2'>KOREA</h1>
			</button>

			<div className='song_bg'>
				{ content }
			</div>
		</>)

		const types = [selectall, selectth, selecteng, selectjp, selectkr];

		return (
		  	<div className="Song">
				<main>
					<div className="mode-bg">
						<img src="/img/s00.png" />
					
						{ selectth }
						
					</div>
				</main>
		   </div>
		)
	}
}

export default Song;

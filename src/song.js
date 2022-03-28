import React, { Component } from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import './Game.css';
import { useHistory } from "react-router-dom";

function Songcompo(props) {
	let history = useHistory();

	/*console.log(props);*/
	const [state, setState] = useState(1);
	const action = (index) => {
		setState(index)
	}
	
	const play = (id) => {
		//alert(id);
		//this.props.history.push('/m'+window.location.pathname.slice(-1));
		//window.location.href = '/m'+window.location.pathname.slice(-1)+id;
		 history.push({
           pathname: '/m'+window.location.pathname.slice(-1)+id
       });
	}

	return (
		<div className="Song">
			<main>
				<div className="mode-bg">
					<img src="/img/s00.png" />
									<div className="box">
					<div className="tabs">
						<div onClick={() => action(1)} className={`${state === 1 ? 'tab active-tab' : 'tab'}`}>
						<div class="vertical-center">
							<p>ALL</p>
						</div>
						</div>
						<div className={`${state === 2 ? 'tab active-tab' : 'tab'}`} onClick={() => action(2)}>
						<div class="vertical-center">
							<p>THAI</p>
						</div>
						</div>
						<div className={`${state === 3 ? 'tab active-tab' : 'tab'}`} onClick={() => action(3)}>
							<div class="vertical-center">
							<p>FOREIGN</p>
						</div>
						</div>
					</div>

					<div className="contents">
						<div className={`${state === 1 ? 'content active-content' : 'content'}`}>
							<div className='song_bg'>
								<div className='song_rol'>
									<div className="song_pic_container">
										<img className='picofsong' src="/img/si0.jpg"></img>
									</div>
									<h1 className='songname'>YOUR NAME OST - KATAWARE DOKI</h1>
									<h2 className='singername'>Yojiro Noda</h2>
									<div className="song__buttons" onClick={() => play(0)}>
										<img className="mode-button aaa" src="/img/buttonStart.png" alt="my image" />
									</div>
								</div>
								
								<div className='song_rol'>
									<div className="song_pic_container">
										<img className='picofsong' src="/img/si1.jpg"></img>
									</div>
									<h1 className='songname'>Demon Slayer OP2 - Zankyou Sanka</h1>
									<h2 className='singername'>Aimer</h2>
									<div className="song__buttons" onClick={() => play(1)}>
										<img className="mode-button aaa" src="/img/buttonStart.png" alt="my image" />
									</div>
								</div>
							</div>
						</div>

						<div className={`${state === 2 ? 'content active-content' : 'content'}`}>
							<div className='song_bg'>

							</div>
						</div>

						<div className={`${state === 3 ? 'content active-content' : 'content'}`}>
							<div className='song_bg'>
								<div className='song_rol'>
									<div className="song_pic_container">
										<img className='picofsong' src="/img/si0.jpg"></img>
									</div>
									<h1 className='songname'>YOUR NAME OST - KATAWARE DOKI</h1>
									<h2 className='singername'>Yojiro Noda</h2>
									<div className="song__buttons" onClick={() => play(0)}>
										<img className="mode-button" src="/img/buttonStart.png" alt="my image" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				</div>
			</main>
		</div>
	);
}


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
		this.props.history.push('/m' + this.props.match.params.id + '0');
		console.log(this.play);
	}
	
	handleLoad() {
		console.log("YEAH! Song!");
	} 

	render() {

		/*
		let content = [];
		
		let selectall = (<>
			<button className='tablinks' onClick="openCity(event, 'all')" id="defaultOpen">
				<button className='songfi'>
					<h1 className='songall'>ALL</h1>
				</button></button>

			<button className='tablinks' onClick="openCity(event, 'th')">
				<button className='songfi2'>
					<h1 className='songth'>THAI</h1>
				</button></button>

			<button className='songfi3'>
				<h1 className='songeng'>ENGLISH</h1>
			</button>

			<div id="all" class="tabcontent">
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
			</div>
			<div id="th" class="tabcontent">
				<div className='song_bg'>
				</div>
			</div>
		</>);*/

		return (
			<Songcompo/>
		)
	}
}

export default Song;

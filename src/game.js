import React from 'react';
import ReactDOM from 'react-dom';
import  { Redirect } from 'react-router-dom'
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
	 
	 handleButton3(e){
		//this.props.history.push('/mode');
		//this.props.history.push('/'+window.location.pathname.split('/').pop());
		//window.location.reload(false);
		//window.location.href = window.location.pathname;
		this.props.history.push('/r');
	 }
	
	componentDidMount() {
		window.addEventListener('load', this.handleLoad);
		
		var myKeys = {};
		var s;
		var l;
		var song;
		var songId = window.location.pathname.split('/').pop().slice(2);
		window.$game = window.location.pathname.split('/').pop();
		window.$mode = window.location.pathname.split('/').pop()[1]; 

		var left;
		var right;

		var dataPath = "data/data.json";
		var statusPath = "data/debug_status.json";
		var messagePath = "http://localhost:3000";

		fetch(dataPath,{
			method: "GET",
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "*",
				"Access-Control-Allow-Credentials": true,
				"Content-Type": "application/json"
			},
		})
			.then(response => response.json())
			.then((data) => {
				//console.log(data);
				//s = data[songId].s;
				//l = data[songId].l;
				myKeys['s'] = data[songId].s;
				myKeys['l'] = data[songId].l;
				song = data[songId].song;
				initializeGame();
			}).catch((error) => {
				console.log(error);
				//this.setState({ redirect: "/landing" });
			});
		  
		function GetHardwareStatus(){
			fetch(statusPath,{
			method: "GET",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "*",
					"Access-Control-Allow-Credentials": true,
					"Content-Type": "application/json"
				},
			})
				.then(response => response.json())
				.then((data) => {
					//console.log(data);
					if(data.isPlaying && !window.$isPlaying){
						document.querySelector('.play__button').style.display = 'none';
						document.querySelector('.pause__button').style.display = 'block';
						Play();
					}else if(!data.isPlaying && window.$isPlaying){
						document.querySelector('.play__button').style.display = 'block';
						document.querySelector('.pause__button').style.display = 'none';
						Pause();
					}

					if(data.isStopping){ // go to home page
						window.location.href = "home";
					}
				}).catch((error) => {
					console.log(error);
					//this.setState({ redirect: "/landing" });
				});
			
			
			return false;
		}

		function SendScore(score){
			var message = {};
			message['score'] = score;
			
			fetch(messagePath,{
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "*",
					"Access-Control-Allow-Credentials": true,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(message),
			})
				.then(response =>  {
					console.log(response);
				})
				.catch((error) => {
					console.log('add Error!');
					//this.setState({ redirect: "/landing" });
				});
		}

		setInterval(function () {
		   GetHardwareStatus();
		   //console.log(top.serial);
		  }, 200);
		  
		/*var mydata = JSON.parse(data);
		alert(mydata[0].song.duration);
		alert(mydata[1].song.duration);*/

		var isHolding = {
		  s: false,
		  l: false
		};

		var hits = { perfect: 0, good: 0, bad: 0, miss: 0 };
		var multiplier = {
		  perfect: 1,
		  good: 0.8,
		  bad: 0.5,
		  miss: 0,
		  combo40: 1.05,
		  combo80: 1.10
		};
		
		window.$isPlaying = false;
		var speed = 0;
		var combo = 0;
		var maxCombo = 0;
		var score = 0;
		var animation = 'moveDown';
		var startTime;
		var pauseStarted;
		var pausedDuration = 0;
		var trackContainer;
		//var tracks;
		//var keypress;
		var comboText;
		var liveScore = document.querySelector('.live__score__text');

		var timers = [];


		var Timer = function(callback, delay) {
			var timerId, start, remaining = delay;

			this.pause = function() {
				window.clearTimeout(timerId);
				timerId = null;
				remaining -= Date.now() - start;
			};

			this.resume = function() {
				if (timerId) {

					return;
				}

				start = Date.now();
				timerId = window.setTimeout(callback, remaining);
			};

			this.resume();
		};

		var initializeLyrics = function () {
			var lyricUpperElement = document.querySelector('.lyric__upper__text');
			var lyricLowerElement = document.querySelector('.lyric__lower__text');
			
			song.lyrics.forEach(function (lyric) {
				
				var timer1 = new Timer(function() {
					lyricUpperElement.style.opacity = 0;
					lyricLowerElement.style.opacity = 0;
				}, lyric.delay * 1000);

				var timer2 = new Timer(function() {
					lyricUpperElement.textContent  = lyric.upperText;
					lyricLowerElement.textContent  = lyric.lowerText;
					lyricUpperElement.style.opacity = 1;
					lyricLowerElement.style.opacity = 1;
				}, (lyric.delay * 1000) + 1000);
				
				timers.push(timer1);
				timers.push(timer2);
			});
		}

		var initializeNotes = function () {
		  var noteElement;
		  var trackElement;

		  while (trackContainer.hasChildNodes()) {
			trackContainer.removeChild(trackContainer.lastChild);
		  }

		  song.sheet.forEach(function (key, index) {
			trackElement = document.createElement('div');
			trackElement.classList.add('track');
			
			//console.log(window[key].notes);

			myKeys[key].notes.forEach(function (note) {
			  noteElement = document.createElement('div');
			  noteElement.classList.add('note');
			  noteElement.classList.add('note--' + index);
			  noteElement.style.backgroundColor = myKeys[key].color;
			  noteElement.style.animationName = animation;
			  noteElement.style.animationTimingFunction = 'linear';
			  noteElement.style.animationDuration = note.duration - speed + 's';
			  noteElement.style.animationDelay = note.delay + speed + 's';
			  noteElement.style.animationPlayState = 'paused';
			  trackElement.appendChild(noteElement);
			});

			trackContainer.appendChild(trackElement);
			window.$tracks = document.querySelectorAll('.track');
		  });
		};

		var setupSpeed = function () {
		  var buttons = document.querySelectorAll('.btn--small');

		  buttons.forEach(function (button) {
			button.addEventListener('click', function () {
			  if (this.innerHTML === '1x') {
				buttons[0].className = 'btn btn--small btn--selected';
				buttons[1].className = 'btn btn--small';
				buttons[2].className = 'btn btn--small';
				speed = parseInt(this.innerHTML) - 1;
			  } else if (this.innerHTML === '2x') {
				buttons[0].className = 'btn btn--small';
				buttons[1].className = 'btn btn--small btn--selected';
				buttons[2].className = 'btn btn--small';
				speed = parseInt(this.innerHTML) - 1;
			  } else if (this.innerHTML === '3x') {
				buttons[0].className = 'btn btn--small';
				buttons[1].className = 'btn btn--small';
				buttons[2].className = 'btn btn--small btn--selected';
				speed = parseInt(this.innerHTML) - 1;
			  }

			  initializeNotes();
			});
		  });
		};

		var setupChallenge = function () {
		  /*var enabled = false;
		  var challenge = document.querySelector('.config__challenge');
		  challenge.addEventListener('click', function (event) {
			if (enabled) {
			  event.target.className = 'btn btn--small';
			  enabled = false;
			} else {
			  event.target.className = 'btn btn--small btn--selected';
			  enabled = true;
			  updateAnimation();
			}
		  });*/
		};

		var updateAnimation = function () {
		  animation = 'moveDownFade';
		  initializeNotes();
		};

		var startTimer;

		var setupStartButton = function () {
		  var startButton = document.querySelector('.btn--start');
		  startButton.addEventListener('click', function () {
			window.$isPlaying = true;
			startTime = Date.now();

			startTimer = prTimer(song.duration+1, "timer", function() { 
			  showResult();
			  comboText.style.transition = 'all 1s';
			  comboText.style.opacity = 0; });
			
			document.querySelector('.menu').style.opacity = 0;
			document.querySelector('.game').style.opacity = 1;
			document.querySelector('.play__button').style.opacity = 1;
			document.querySelector('.pause__button').style.opacity = 1;
			document.querySelector('.song').play();
			document.querySelector('.menu').style.zIndex = -100;
			/*var audio = new Audio("media/music.mp3");
			audio.play();*/
			document.querySelectorAll('.note').forEach(function (note) {
			  note.style.animationPlayState = 'running';
			});
		  });
		};

		var display = document.querySelector('.summary__timer');

		function prTimer(seconds, container, oncomplete) {
			display.style.display = 'block';
			display.style.opacity = 1;
			
			var startTime, timer, obj, ms = seconds*1000,
			obj = {};
			obj.resume = function() {
				startTime = new Date().getTime();
				timer = setInterval(obj.step,250); // adjust this number to affect granularity
									// lower numbers are more accurate, but more CPU-expensive
			};
			obj.pause = function() {
				ms = obj.step();
				clearInterval(timer);
			};
			obj.step = function() {
				var now = Math.max(0,ms-(new Date().getTime()-startTime)),
					m = Math.floor(now/60000), s = Math.floor(now/1000)%60;
				s = (s < 10 ? "0" : "")+s;
				display.innerHTML = m+":"+s;
				if( now == 0) {
					clearInterval(timer);
					obj.resume = function() {};
					if( oncomplete) oncomplete();
				}
				return now;
			};
			obj.resume();
			return obj;
		}

		/*var startTimer = function (duration) {
		  var display = document.querySelector('.summary__timer');
		  var timer = duration;
		  var minutes;
		  var seconds;

		  display.style.display = 'block';
		  display.style.opacity = 1;

		  var songDurationInterval = setInterval(function () {
			minutes = Math.floor(timer / 60);
			seconds = timer % 60;
			minutes = minutes < 10 ? '0' + minutes : minutes;
			seconds = seconds < 10 ? '0' + seconds : seconds;
			display.innerHTML = minutes + ':' + seconds;

			if (--timer < 0) {
			  clearInterval(songDurationInterval);
			  showResult();
			  comboText.style.transition = 'all 1s';
			  comboText.style.opacity = 0;
			}
		  }, 1000);
		};*/

		var showResult = function () {
		  SendScore(score);
		  document.querySelector('.perfect__count').innerHTML = hits.perfect;
		  document.querySelector('.good__count').innerHTML = hits.good;
		  document.querySelector('.bad__count').innerHTML = hits.bad;
		  document.querySelector('.miss__count').innerHTML = hits.miss;
		  document.querySelector('.combo__count').innerHTML = maxCombo;
		  document.querySelector('.score__count').innerHTML = score;
		  document.querySelector('.game').style.opacity = 0;
		  document.querySelector('.summary__timer').style.opacity = 0;
		  document.querySelector('.play__button').style.opacity = 0;
		  document.querySelector('.pause__button').style.opacity = 0;
		  document.querySelector('.summary__result').style.opacity = 1;
		  document.querySelector('.summary').style.zIndex = 1;
		};

		var setupNoteMiss = function () {
		  trackContainer.addEventListener('animationend', function (event) {
			var index = event.target.classList.item(1)[6];

			displayAccuracy('miss');
			updateHits('miss');
			updateCombo('miss');
			updateMaxCombo();
			removeNoteFromTrack(event.target.parentNode, event.target);
			updateNext(index);
		  });
		};

		window.onhashchange = function() {
		 //blah blah blah
		 console.log(4);
		}

		window.addEventListener('popstate', function(event) {
			//alert(4);
			console.log('RemoveKeys!');
			document.removeEventListener('keydown', keydownHandler);
			document.removeEventListener('keyup', keyupHandler);
		}, false);

		/**
		 * Allows keys to be only pressed one time. Prevents keydown event
		 * from being handled multiple times while held down.
		 */
		 
		var keydownHandler = function (event) {
			//console.log('Down');
			var keyIndex = getKeyIndex(event.key);

			if (Object.keys(isHolding).indexOf(event.key) !== -1
			  && !isHolding[event.key]) {
			  isHolding[event.key] = true;
			   window.$keypress[keyIndex].style.display = 'block';

			  if (window.$isPlaying && window.$tracks[keyIndex].firstChild) {
				window.$judge(keyIndex);
			  }
			}
		}

		var keyupHandler = function (event){
			//console.log('up');
			if (Object.keys(isHolding).indexOf(event.key) !== -1) {
			  var keyIndex = getKeyIndex(event.key);
			  isHolding[event.key] = false;
			   window.$keypress[keyIndex].style.display = 'none';
			}
		}
		 
		var setupKeys = function () {
		  console.log('SetupKeys!');
		  document.querySelector('.key-container').style.opacity = 1;
		  document.addEventListener('keydown', keydownHandler);
		  document.addEventListener('keyup', keyupHandler);
		};
		
		function Pause(){
			window.$isPlaying = false;
			
			document.querySelector('.song').pause();
			//timer.pause();
			pauseStarted = Date.now();
			
			startTimer.pause();
			
			timers.forEach(function (timer) {
				timer.pause();
			});
			
			document.querySelectorAll('.note').forEach(function (note) {
			  note.style.animationPlayState = 'paused';
			});
		}
		
		function Play(){
			window.$isPlaying = true;

			document.querySelector('.song').play();
			//timer.resume();
			pausedDuration += Date.now()- pauseStarted;
			
			startTimer.resume();
			
			timers.forEach(function (timer) {
				timer.resume();
			});
			
			document.querySelectorAll('.note').forEach(function (note) {
			  note.style.animationPlayState = 'running';
			});
		}

		var getKeyIndex = function (key) {
			//console.log(key);
			
		  if (key === 's') {
			return 0;
		  } else if (key === 'l') {
			return 1;
		  }
		  
		  if ( key === 'g' && window.$isPlaying) {
			Pause();
		  }else if ( key === 'h' && !window.$isPlaying) {
			Play();
		  }
		};

		window.$judge = function (index) {
		  var timeInSecond = (Date.now() - startTime - pausedDuration) / 1000;
		  var refSong = myKeys[song.sheet[index]];
		  var nextNoteIndex = myKeys[song.sheet[index]].next;
		  var nextNote = myKeys[song.sheet[index]].notes[nextNoteIndex];
		  var perfectTime = nextNote.duration + nextNote.delay;
		  var accuracy = Math.abs(timeInSecond - perfectTime);
		  var hitJudgement;
			//alert(nextNote.duration);
		  /**
		   * As long as the note has travelled less than 3/4 of the height of
		   * the track, any key press on this track will be ignored.
		   */
		  if (accuracy > (nextNote.duration - speed) / 4) {
			return;
		  }

		  hitJudgement = getHitJudgement(accuracy);
		  displayAccuracy(hitJudgement);
		  showHitEffect(index);
		  updateHits(hitJudgement);
		  updateCombo(hitJudgement);
		  updateMaxCombo();
		  calculateScore(hitJudgement);
		  removeNoteFromTrack(window.$tracks[index], window.$tracks[index].firstChild);
		  updateNext(index);
		};

		var getHitJudgement = function (accuracy) {
		  if (accuracy < 0.1) {
			return 'perfect';
		  } else if (accuracy < 0.25) {
			return 'good';
		  } else if (accuracy < 0.3) {
			return 'bad';
		  } else {
			return 'miss';
		  }
		};

		var displayAccuracy = function (accuracy) {
		  var accuracyText = document.createElement('div');
		  document.querySelector('.hit__accuracy').remove();
		  accuracyText.classList.add('hit__accuracy');
		  accuracyText.classList.add('hit__accuracy--' + accuracy);
		  accuracyText.innerHTML = accuracy;
		  document.querySelector('.hit').appendChild(accuracyText);
		};

		var showHitEffect = function (index) {
		  var key = document.querySelectorAll('.key')[index];
		  var hitEffect = document.createElement('div');
		  hitEffect.classList.add('key__hit');
		  key.appendChild(hitEffect);
		};

		var updateHits = function (judgement) {
		  hits[judgement]++;
		};

		var updateCombo = function (judgement) {
		  if (judgement === 'bad' || judgement === 'miss') {
			combo = 0;
			comboText.innerHTML = '';
		  } else {
			comboText.innerHTML = ++combo + ' Combo';
		  }
		};

		var updateMaxCombo = function () {
		  maxCombo = maxCombo > combo ? maxCombo : combo;
		};

		var calculateScore = function (judgement) {
		  if (combo >= 80) {
			score += 1000 * multiplier[judgement] * multiplier.combo80;
		  } else if (combo >= 40) {
			score += 1000 * multiplier[judgement] * multiplier.combo40;
		  } else {
			score += 1000 * multiplier[judgement];
		  }
		  
		  liveScore.innerHTML = 'Score: '+ score;
		};

		var removeNoteFromTrack = function (parent, child) {
		  parent.removeChild(child);
		};

		var updateNext = function (index) {
			myKeys[song.sheet[index]].next++;
		};

		/*window.onload = function () {*/
		function initializeGame(){
		  trackContainer = document.querySelector('.track-container');
		  window.$keypress = document.querySelectorAll('.keypress');
		  comboText = document.querySelector('.hit__combo');
		  
		  var uParam = window.location.pathname.split('/').pop();
		  //console.log(uParam);

		  if(uParam[1] == 'a'){ // sing
			document.querySelector('.config__speed').style.display = 'none';
			document.querySelector('.menu_start_s').style.opacity = 1;
			initializeLyrics();
			setupStartButton();
		  }else if(uParam[1] == 'b'){ // sing & dance
		    document.querySelector('.config__speed').style.opacity = 1;
			document.querySelector('.menu_start_s').style.opacity = 1;
			initializeLyrics();
			initializeNotes();
			setupSpeed();
			setupStartButton();
			setupKeys();
			setupNoteMiss();
		  }else{ // 
			document.querySelector('.game').style.maxWidth = '50%';
			document.querySelector('.config__speed').style.opacity = 1;
			document.querySelector('.menu_start_s').style.opacity = 1;
			initializeNotes();
			setupSpeed();
			setupStartButton();
			setupKeys();
			setupNoteMiss();
		  }
		}
		/*}*/
		
		/*document.querySelector('.play__button').addEventListener('click', () => {
		  //console.log(888);
		  document.querySelector('.play__button').style.display = 'none';
		  document.querySelector('.pause__button').style.display = 'block';
		  Play();
		});
		
		document.querySelector('.pause__button').addEventListener('click', () => {
		  //console.log(888);
		  document.querySelector('.play__button').style.display = 'block';
		  document.querySelector('.pause__button').style.display = 'none';
		  Pause();
		});*/

		/* back && next navigation */
		if(window.$left){
			document.querySelector('.cbl').style.display = 'none';
			document.querySelector('.cl').style.display = 'block';
		}
		if(window.$right){
			document.querySelector('.cbr').style.display = 'none';
			document.querySelector('.cr').style.display = 'block';
		}

		document.getElementById('connectButtonL').addEventListener('click', () => {
		  console.log(888);
		  if (navigator.serial) {
			connectSerialL();
		  } else {
			alert('Web Serial API not supported.');
		  }
		});

		document.getElementById('connectButtonR').addEventListener('click', () => {
			  console.log(444);
		  if (navigator.serial) {
			connectSerialR();
		  } else {
			alert('Web Serial API not supported.');
		  }
		});
		
		async function connectSerialR() {
		  //const log = document.getElementById('target');
			
		  try {
			console.log(44);
			const port = await navigator.serial.requestPort();
			await port.open({ baudRate: 115200  });
			console.log(55);
			const decoder = new window.TextDecoderStream();
			
			port.readable.pipeTo(decoder.writable);

			const inputStream = decoder.readable;
			const reader = inputStream.getReader();
			
			document.querySelector('.cbr').style.display = 'none';
			document.querySelector('.cr').style.display = 'block';

			while (true) {
			  const { value, done } = await reader.read();
			  if (value) {
				//log.textContent += value + '\n';
				console.log('Right: '+value);
				if(value === '1'){
					window.$right = true;
					window.$keypress[1].style.display = 'block';
					if (window.$isPlaying && window.$tracks[1].firstChild && ( window.$mode === "b" || window.$mode === "c") ) {
						window.$judge(1);
					  }
				}else{
					window.$keypress[1].style.display = 'none';
				}
			  }
			  if (done) {
				console.log('[readLoop] DONE', done);
				reader.releaseLock();
				break;
			  }
			}
		  
		  } catch (error) {
			console.log(error);
		  }
		}

		async function connectSerialL() {
		  //const log = document.getElementById('target');
			
		  try {
			const port = await navigator.serial.requestPort();
			await port.open({ baudRate: 115200  });
			
			const decoder = new window.TextDecoderStream();
			
			port.readable.pipeTo(decoder.writable);

			const inputStream = decoder.readable;
			const reader = inputStream.getReader();
			
			document.querySelector('.cbl').style.display = 'none';
			document.querySelector('.cl').style.display = 'block';

			while (true) {
			  const { value, done } = await reader.read();
			  if (value) {
				//log.textContent += value + '\n';
				console.log('Left: '+value);
				if(value === '1'){
					window.$left = true;
					 window.$keypress[0].style.display = 'block';
					if (window.$isPlaying && window.$tracks[0].firstChild && ( window.$mode === "b" || window.$mode === "c") ) {
						window.$judge(0);
					  }
				}else{
					 window.$keypress[0].style.display = 'none';
				}
			  }
			  if (done) {
				console.log('[readLoop] DONE', done);
				reader.releaseLock();
				break;
			  }
			}
		  
		  } catch (error) {
			console.log(error);
		  }
		}

		/* setInterval(function () {
		   console.log(left);
		  }, 1000);*/
	}
	
	componentWillUnmount() { 
	   window.removeEventListener('load', this.handleLoad);
	   window.$isPlaying = false;
	   //document.body.removeChild(this.scr);
	}
	
	handleLoad() {
		//console.log("YEAH! Game!");
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
					<div className="speed__box">
					  <div className="btn btn--small btn--selected">1x</div>
					  <div className="btn btn--small">2x</div>
					  <div className="btn btn--small">3x</div>
					</div>
				  </div>
				  
				   <div className="menu_start menu_start_s">
					<h2>Start</h2>
					<div className="btn btn--primary btn--start game-start-button" >Start</div>
				  </div>
				</div>

				
			  </div>

			  <img className="play__button" src="/img/buttonP.png" />
			  <img className="pause__button" src="/img/buttonS.png" />
			  
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

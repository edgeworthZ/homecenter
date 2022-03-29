import React from 'react';
import ReactDOM from 'react-dom';
import  { Redirect } from 'react-router-dom'
import './Game.css';
import { withRouter } from 'react-router-dom';

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.handleLoad = this.handleLoad.bind(this);
		this.handleButton1 = this.handleButton1.bind(this);
		this.handleButton2 = this.handleButton2.bind(this);
		this.handleButton3 = this.handleButton3.bind(this);
		this.back = this.back.bind(this);
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
	 
	  back(){
		//this.props.history.goBack();
		this.props.history.push('/song-'+window.location.pathname.split('/').pop()[1]);
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
		
		window.$gameStart = false;
		
		//var allowIntervalFunc = true;
		var video = document.getElementById("myVideo");
		video.play();

		var left;
		var right;

		var dataPath = "data/data.json";
		/*var statusPath = "http://localhost:55555/status";
		var scorePath = "http://localhost:55555/score";
		var stopPath = "http://localhost:55555/status/stop";
		var playPath = "http://localhost:55555/status/play";
		var pausePath = "http://localhost:55555/status/pause";
		var finishPath = "http://localhost:55555/status/finish";*/
		
		var statusPath = "https://homecenter-backend.herokuapp.com/status";
		var songNamePath = "https://homecenter-backend.herokuapp.com/status/songname";
		var scorePath = "https://homecenter-backend.herokuapp.com/score";
		var stopPath = "https://homecenter-backend.herokuapp.com/status/stop";
		var playPath = "https://homecenter-backend.herokuapp.com/status/play";
		var pausePath = "https://homecenter-backend.herokuapp.com/status/pause";
		var finishPath = "https://homecenter-backend.herokuapp.com/status/finish";

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
				var themeColor = data[songId].s.color;
				SendSongName(data[songId].song.name);
				document.querySelector('.song__name').innerHTML = data[songId].song.name;
				document.querySelector('.song__owner').innerHTML = data[songId].song.owner;
				document.documentElement.style.setProperty('--key-blue', themeColor);
				document.documentElement.style.setProperty('--keypress-blue', 'linear-gradient(to top,'+themeColor.replace('1)','.6)')+','+themeColor.replace('1)','0)')+')');
				document.querySelector('.game-img').src = "img/si"+songId+".jpg";
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
					'Host': 'https://*.airtableblocks.com',
					"Content-Type": "application/json"
				},
			})
				.then(response => response.json())
				.then((datas) => {
					var data = datas[0];
					//console.log(data);
					//console.log(data.isPlaying);
					//if(!window.$gameStart || !allowIntervalFunc) return;
					if(!window.$gameStart) return;
					//console.log(77);
					if(data.isPlaying === 1 && !window.$isPlaying ){	
						//document.querySelector('.play__button').style.display = 'none';
						//document.querySelector('.pause__button').style.display = 'block';
						Play();
					}else if(data.isPlaying === 0 && window.$isPlaying){
						//document.querySelector('.play__button').style.display = 'block';
						//document.querySelector('.pause__button').style.display = 'none';
						Pause();
					}
					
					//console.log(data.isStopping);

					if(data.isStopping === 1){ // go to home page
						// switch to not stop
						TriggerBackendStop();;
						window.location.href = "home";
					}
				}).catch((error) => {
					console.log(error);
					//this.setState({ redirect: "/landing" });
				});
			
			
			return false;
		}
		
		function TriggerBackendStop(){
			fetch(stopPath,{
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "*",
					"Access-Control-Allow-Credentials": true,
					"Content-Type": "application/json"
				}
			})
				.then(response =>  {
					console.log(response);
				})
				.catch((error) => {
					console.log('add Error!');
					//this.setState({ redirect: "/landing" });
				});
		}
		
		function TriggerBackendPlay(){
			fetch(playPath,{
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "*",
					"Access-Control-Allow-Credentials": true,
					"Content-Type": "application/json"
				}
			})
				.then(response =>  {
					console.log(response);
				})
				.catch((error) => {
					console.log('add Error!');
					//this.setState({ redirect: "/landing" });
				});
		}
		
		function TriggerBackendPause(){
			fetch(pausePath,{
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "*",
					"Access-Control-Allow-Credentials": true,
					"Content-Type": "application/json"
				}
			})
				.then(response =>  {
					console.log(response);		
				})
				.catch((error) => {
					console.log('add Error!');
					//this.setState({ redirect: "/landing" });
				});
		}

		function SendScore(score){
			var message = {};
			message['Score'] = score;
			
			fetch(scorePath,{
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "*",
					"Access-Control-Allow-Credentials": true,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(message),
			})
				.then(response => response.json())
				.then((data) => {
					//console.log(data.Mention);
					var congrat = document.querySelector('.result__heading');
					congrat.innerHTML = data.Mention;
					
				}).catch((error) => {
					console.log(error);
					//this.setState({ redirect: "/landing" });
				});
		}
		
		function SendFinish(val){
			var message = {};
			message['isFinished'] = val;
			
			fetch(finishPath,{
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "*",
					"Access-Control-Allow-Credentials": true,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(message),
			})
				.then(response => response.json())
				.then((data) => {
					console.log(data);
					//var congrat = document.querySelector('.result__heading');
					//congrat.innerHTML = data.Mention;
					
				}).catch((error) => {
					console.log(error);
					//this.setState({ redirect: "/landing" });
				});
		}
		
		function SendSongName(name){
			var message = {};
			message['SongName'] = name;
			
			fetch(songNamePath,{
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "*",
					"Access-Control-Allow-Credentials": true,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(message),
			})
				.then(response => response.json())
				.then((data) => {
					console.log(data);
					//var congrat = document.querySelector('.result__heading');
					//congrat.innerHTML = data.Mention;
					
				}).catch((error) => {
					console.log(error);
					//this.setState({ redirect: "/landing" });
				});
		}
		
		SendFinish(0);
		
		window.$statusInterval = setInterval(function () {
		   //if(allowIntervalFunc)
			GetHardwareStatus();
		   //console.log(top.serial);
		  }, 100);
		  
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
		window.$touch = '2';
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
				}, (lyric.delay * 1000) + 500);
				
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
			  if (this.innerHTML === 'Lv1') {
				buttons[0].className = 'btn btn--small btn--selected';
				buttons[1].className = 'btn btn--small';
				buttons[2].className = 'btn btn--small';
				speed = 0;
				video.playbackRate = 1.0;
				document.querySelector('#myVideo').style.filter = 'hue-rotate(180deg)';
			  } else if (this.innerHTML === 'Lv2') {
				buttons[0].className = 'btn btn--small';
				buttons[1].className = 'btn btn--small btn--selected';
				buttons[2].className = 'btn btn--small';
				speed = 0.3;
				video.playbackRate = 2.0;
			  } else if (this.innerHTML === 'Lv3') {
				buttons[0].className = 'btn btn--small';
				buttons[1].className = 'btn btn--small';
				buttons[2].className = 'btn btn--small btn--selected';
				speed = 0.5;
				video.playbackRate = 4.0;
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
			document.querySelector('.summary__status').style.opacity = 1;
			window.$isPlaying = true;
			
			var uParam = window.location.pathname.split('/').pop();
			  //console.log(uParam);
			if(uParam[1] == 'a' || uParam[1] == 'b'){
				initializeLyrics();
			}
			TriggerBackendPlay();
			startTime = Date.now();

			startTimer = prTimer(song.duration+1, "timer", function() { 
			  showResult();
			  comboText.style.transition = 'all 1s';
			  comboText.style.opacity = 0; });
			
			document.querySelector('.menu').style.opacity = 0;
			document.querySelector('.game').style.opacity = 1;
			//document.querySelector('.play__button').style.opacity = 1;
			//document.querySelector('.pause__button').style.opacity = 1;
			document.querySelector('.song').src = "media/"+window.location.pathname.split('/').pop()[2]+".mp3";
			document.querySelector('.song').play();
			document.querySelector('.menu').style.zIndex = -100;
			window.$gameStart = true;
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
					if( oncomplete && window.$isPlaying) oncomplete();
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
		  window.$gameStart = false;
		  SendFinish(1);
		  video.playbackRate = 1.0;
		  SendScore(score);
		  document.querySelector('.perfect__count').innerHTML = hits.perfect;
		  document.querySelector('.good__count').innerHTML = hits.good;
		  document.querySelector('.bad__count').innerHTML = hits.bad;
		  document.querySelector('.miss__count').innerHTML = hits.miss;
		  document.querySelector('.combo__count').innerHTML = maxCombo;
		  document.querySelector('.score__count').innerHTML = score;
		  document.querySelector('.game').style.opacity = 0;
		  document.querySelector('.summary__timer').style.opacity = 0;
		  document.querySelector('.summary__status').style.opacity = 0;
		  //document.querySelector('.play__button').style.opacity = 0;
		  //document.querySelector('.pause__button').style.opacity = 0;
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
			document.querySelector('.summary__status').innerHTML = "Paused...";
			
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
			document.querySelector('.summary__status').innerHTML = "Now Playing...";

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
		  
		  /*if ( key === 'g' && window.$isPlaying) {
			Pause();
		  }else if ( key === 'h' && !window.$isPlaying) {
			Play();
		  }*/
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
			window.$touch = '1';
			return 'perfect';
		  } else if (accuracy < 0.25) {
			window.$touch = '1';
			return 'good';
		  } else if (accuracy < 0.3) {
			window.$touch = '1';
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
			window.$touch = '0';
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
		    document.querySelector('.controller').style.display = 'none';
			document.querySelector('.config__speed').style.display = 'none';
			document.querySelector('.menu_start_s').style.opacity = 1;		
			setupStartButton();
		  }else if(uParam[1] == 'b'){ // sing & dance
		    document.querySelector('.config__speed').style.opacity = 1;
			document.querySelector('.menu_start_s').style.opacity = 1;
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
		  allowIntervalFunc = false;
		  document.querySelector('.play__button').style.display = 'none';
		  document.querySelector('.pause__button').style.display = 'block';
		  Play();		  
		  TriggerBackendPlay();
		  setTimeout(function () {allowIntervalFunc = true;}, 1000);
		});
		
		document.querySelector('.pause__button').addEventListener('click', () => {
		  //console.log(888);
		  allowIntervalFunc = false;
		  document.querySelector('.play__button').style.display = 'block';
		  document.querySelector('.pause__button').style.display = 'none';
		  Pause();
		  TriggerBackendPause();
		  setTimeout(function () {allowIntervalFunc = true;}, 1000);
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
		  //console.log(888);
		  if (navigator.serial) {
			connectSerialL();
		  } else {
			alert('Web Serial API not supported.');
		  }
		});

		document.getElementById('connectButtonR').addEventListener('click', () => {
			  //console.log(444);
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
			await port.open({ baudRate: 9600  });
			console.log(55);
			
			/*const writer = port.writable.getWriter();
			const data = new Uint8Array([104, 101, 108, 108, 111]); // hello*/
			
			const textEncoder = new window.TextEncoderStream();
			const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
			const writer = textEncoder.writable.getWriter();
			
			
			const decoder = new window.TextDecoderStream();
			

			port.readable.pipeTo(decoder.writable);

			const inputStream = decoder.readable;
			const reader = inputStream.getReader();
			
			document.querySelector('.cbr').style.display = 'none';
			document.querySelector('.cr').style.display = 'block';

			while (true) {
				//await writer.write(data);
				if(window.$touch === '1' || window.$touch === '0'){
					await writer.write(window.$touch);
					window.$touch = '2';
				}else{
					// user doesn't touch
					await writer.write('2');
				}
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
				writer.releaseLock();
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
			await port.open({ baudRate: 9600  });
			
			const textEncoder = new window.TextEncoderStream();
			const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
			const writer = textEncoder.writable.getWriter();
			
			const decoder = new window.TextDecoderStream();
			
			port.readable.pipeTo(decoder.writable);

			const inputStream = decoder.readable;
			const reader = inputStream.getReader();
			
			document.querySelector('.cbl').style.display = 'none';
			document.querySelector('.cl').style.display = 'block';

			while (true) {
				//await writer.write(data);
				if(window.$touch === '1' || window.$touch === '0'){
					await writer.write(window.$touch);
					window.$touch = '2';
				}else{
					// user doesn't touch
					await writer.write('2');
				}
				
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
	   window.$gameStart = false;
	   clearInterval(window.$statusInterval);
	   //document.body.removeChild(this.scr);
	}
	
	handleLoad() {
		//console.log("YEAH! Game!");
	}
	
	render (){
		return (
		  <div className="Game">
			<div id="target"></div>
			
			<video autoplay muted loop id="myVideo">
			  <source src="media/cyber.mp4" type="video/mp4" />
			</video>

			<audio className="song" crossOrigin="anonymous" src="media/0.mp3"></audio>

			<main>
			  <img className="back__button" src="/img/buttonC.png" alt="my image" onClick={this.back} />
	
			
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
				  <h2 className="song__name">Your Name OST - Kataware Doki</h2>
				  <div>
					<p className="song__owner">Original song composed by <span>Yojiro Noda</span></p>
				  </div>
				</div>
				
		
					<div className="game__img">
						<img className="game-img" src="/img/si00.jpg" alt="my image" onClick={this.play} />
				    </div>
		
				<div className="menu__config">
				  <div className="menu_start controller">
					<h2>Left</h2>
					<h2>Sensor</h2>
					<div className="connect cl">
						<p>Connected!</p>
					</div>
					<div className="btn btn--primary game-start-button cbl" id="connectButtonL" >Connect</div>
				  </div>
				  <div className="menu_start controller">
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
					<h2>DIFFICULTY</h2>
					<div className="speed__box">
					  <div className="btn btn--small btn--selected">Lv1</div>
					  <div className="btn btn--small">Lv2</div>
					  <div className="btn btn--small">Lv3</div>
					</div>
				  </div>
				  
				   <div className="menu_start menu_start_s">
					<h2>SESSION</h2>
					<div className="btn btn--primary btn--start game-start-button" >Start</div>
				  </div>
				</div>

				
			  </div>
			  
			  <div className="summary">
				 <div className="summary__status">Now Playing...</div>
				<div className="summary__timer"></div>
				<div className="summary__result">
				  <h2 className="result__heading">...</h2>
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

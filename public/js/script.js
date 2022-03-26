var s;
var l;
var song;
var songId = window.location.pathname.split('/').pop().slice(2);

var left;
var right;

var isSwitchPlaying;
var isSwitchStopping;

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
		s = data[songId].s;
		l = data[songId].l;
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
			isSwitchPlaying = data.isPlaying;
			isSwitchStopping = data.isStopping;
			
			if(isSwitchStopping){ // go to home page
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
   console.log(top.serial);
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
var isPlaying = false;
var speed = 0;
var combo = 0;
var maxCombo = 0;
var score = 0;
var animation = 'moveDown';
var startTime;
var pauseStarted;
var pausedDuration = 0;
var trackContainer;
var tracks;
var keypress;
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

    window[key].notes.forEach(function (note) {
      noteElement = document.createElement('div');
      noteElement.classList.add('note');
      noteElement.classList.add('note--' + index);
      noteElement.style.backgroundColor = window[key].color;
      noteElement.style.animationName = animation;
      noteElement.style.animationTimingFunction = 'linear';
      noteElement.style.animationDuration = note.duration - speed + 's';
      noteElement.style.animationDelay = note.delay + speed + 's';
      noteElement.style.animationPlayState = 'paused';
      trackElement.appendChild(noteElement);
    });

    trackContainer.appendChild(trackElement);
    tracks = document.querySelectorAll('.track');
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
    isPlaying = true;
    startTime = Date.now();

    startTimer = prTimer(song.duration+1, "timer", function() { 
	  showResult();
      comboText.style.transition = 'all 1s';
      comboText.style.opacity = 0; });
	
    document.querySelector('.menu').style.opacity = 0;
	document.querySelector('.game').style.opacity = 1;
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
      keypress[keyIndex].style.display = 'block';

      if (isPlaying && tracks[keyIndex].firstChild) {
        judge(keyIndex);
      }
    }
}

var keyupHandler = function (event){
	//console.log('up');
    if (Object.keys(isHolding).indexOf(event.key) !== -1) {
      var keyIndex = getKeyIndex(event.key);
      isHolding[event.key] = false;
      keypress[keyIndex].style.display = 'none';
    }
}
 
var setupKeys = function () {
  console.log('SetupKeys!');
  document.querySelector('.key-container').style.opacity = 1;
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);
};

var getKeyIndex = function (key) {
    //console.log(key);
	
  if (key === 's') {
    return 0;
  } else if (key === 'l') {
    return 1;
  }
  
  if ( (key === 'g' || !isSwitchPlaying) && isPlaying) {
	isPlaying = false;
	
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
  }else if ( (key === 'h' || isSwitchPlaying) && !isPlaying) {
	isPlaying = true;
	
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
};

var judge = function (index) {
  var timeInSecond = (Date.now() - startTime - pausedDuration) / 1000;
  var refSong = window[song.sheet[index]];
  var nextNoteIndex = window[song.sheet[index]].next;
  var nextNote = window[song.sheet[index]].notes[nextNoteIndex];
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
  removeNoteFromTrack(tracks[index], tracks[index].firstChild);
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
  window[song.sheet[index]].next++;
};

/*window.onload = function () {*/
function initializeGame(){
  trackContainer = document.querySelector('.track-container');
  keypress = document.querySelectorAll('.keypress');
  comboText = document.querySelector('.hit__combo');
  
  var uParam = window.location.pathname.split('/').pop();
  //console.log(uParam);

  if(uParam[1] == 'a'){ // sing
	initializeLyrics();
	setupStartButton();
  }else if(uParam[1] == 'b'){ // sing & dance
    document.querySelector('.config__speed').style.display = 'block';
	initializeLyrics();
	initializeNotes();
	setupSpeed();
	setupStartButton();
	setupKeys();
	setupNoteMiss();
  }else{ // 
	document.querySelector('.game').style.maxWidth = '50%';
	document.querySelector('.config__speed').style.display = 'block';
	initializeNotes();
	setupSpeed();
	setupStartButton();
	setupKeys();
	setupNoteMiss();
  }
}
/*}*/

/* back && next navigation */
if(left){
	document.querySelector('.cbl').style.display = 'none';
	document.querySelector('.cl').style.display = 'block';
}
if(right){
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
    const decoder = new TextDecoderStream();
    
    port.readable.pipeTo(decoder.writable);

    const inputStream = decoder.readable;
    const reader = inputStream.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (value) {
		document.querySelector('.cbr').style.display = 'none';
		document.querySelector('.cr').style.display = 'block';
		
        //log.textContent += value + '\n';
		console.log('Right: '+value);
		if(value === '1'){
			right = true;
			if (isPlaying && tracks[1].firstChild && window.location.pathname.split('/').pop()[0] === 'm') {
				judge(1);
			  }
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
    
    const decoder = new TextDecoderStream();
    
    port.readable.pipeTo(decoder.writable);

    const inputStream = decoder.readable;
    const reader = inputStream.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (value) {
		document.querySelector('.cbl').style.display = 'none';
		document.querySelector('.cl').style.display = 'block';
		  
        //log.textContent += value + '\n';
		console.log('Left: '+value);
		if(value === '1'){
			left = true;
			if (isPlaying && tracks[0].firstChild && window.location.pathname.split('/').pop()[0] === 'm') {
				judge(0);
			  }
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
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

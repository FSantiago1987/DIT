// Init SpeechSynth API
const synth = window.speechSynthesis;

//DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const body = document.querySelector('body');

// Speak
const speak = () => {
    // Add background animation
    /*body.style.background = '#141414 url("../assets/images/wave.gif")';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';*/


    // Check if speaking
    if (synth.speaking) {
      console.error('Already speaking...');
      return;
    }
    if (textInput.value !== '') {
  
      // Get speak text
      const speakText = new SpeechSynthesisUtterance(textInput.value);
  
      // Speak end
      speakText.onend = e => {
        console.log('Done speaking...');
        //body.style.background = 'url("../assets/images/background2.jpg")';
      };
  
      // Speak error
      speakText.onerror = e => {
        console.error('Something went wrong');
      };
  
      synth.speak(speakText);
    }
  };
  
  // EVENT LISTENERS
  
  // Text form submit
  textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
  });
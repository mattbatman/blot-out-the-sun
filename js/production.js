// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/*

appConfig.js contains JavaScript modified or written by Matt Batman
appConfig.js contains variables and methods used by app.js (the driver program)

*/



// GLOBAL VARIABLE DECLARATIONS



//DOM REFERENCE VARIABLES
var htmlBody = document.getElementById('body-id'); //full page
var htmlGameBorder = document.getElementById('main-game-box'); //div containg game
var htmlHeader = document.getElementById('main-header-text'); //header text on page
var htmlParagraph = document.getElementById('main-paragraph-text'); //paragraph text on page
var htmlButton = document.getElementById('user-confirm-button'); //button frequently used to pause page until user clicks to continue
var cssCircle = document.getElementById('floating-circle-div'); //reference to CSS circle used as a moon or sun in the animation/gameplay
var htmlEarth = document.getElementById('earth');
//END DOM REFERENCE VARIABLES

/*
function refreshPage() {
  document.location.reload(true);
}
*/



//GAME OBJECTS
var moon = new Circle('0%', null, 92, 175, true, false, 0);
var sun = new Circle('0%', null, 92, 99, false, true, 0);
//END GAME OBJECTS



//TEXT CONTENT VARIABLES
var textToDisplay = {
  headerText: ['Blot Out the Sun', 'You Are A...', 'Behold!'],
  paragraphText: ['Prepare for the sun to rise!',
  'You have chosen to be a race notorious for romantically engaging high school companions despite having a mental age that is centuries old. Your undead life is comfortable (albeit dramatic). However, the sun is about to rise and burn you alive. Strike it down to continue preying on young humans.',
'You are the beastly werewolf. You are a member of the choir of your werewolf church, and practice has gone too long. The sun is about to rise. Protect your pack. Strike down the sun.',
"You are an archer in Xerxes the Great's Persian army. Some pesky Spartans are resisting your advances. Prepare your arrow and blot out the sun.",
'Your score: ',
"Such skill! You've restored the night times. But beware -- the sun always rises.",
''],
  confirmButtonText: ['ENTER', 'APPLY SUNSCREEN', 'START', 'CONTINUE', 'PLAY AGAIN'],
  countdownText: ['3', '2', '1', 'Go!'],
  resultText: ['Darkness Shall Reign', 'Game Over']
};
var radioFormMarkup = '<fieldset id="radioRaceSelection">' +
                      '<input type="radio" name="radio-choice" id="radio-choice-1" tabindex="1" value="Vampire"><label for="radio-choice-1">Vampire</label>' +
                      '<br>' +
                      '<input type="radio" name="radio-choice" id="radio-choice-2" tabindex="2" value="Werewolf"><label for="radio-choice-2">Werewolf</label>' +
                      '<br>' +
                      '<input type="radio" name="radio-choice" id="radio-choice-3" tabindex="3" value="Persian Archer"><label for="radio-choice-3">Persian Archer</label>' +
                      '</fieldset>';
//END TEXT CONTENT VARIABLES



//TRACKER VARIABLES
var selectedSpecies = 0; //tracks which species the user selected from the radio form
var confirmButtonClickCounter = 0; //tracks the number of times the confirm button has been clicked
var score = 0; //tracks the user's score
//END TRACKER VARIABLES



//CIRCULAR PATH VARIABLES
var centerX = window.innerWidth/2;
var centerY = window.innerHeight * 0.333;
//var duration = 4; // seconds
var radiusX = htmlGameBorder.clientWidth/2 - (cssCircle.offsetWidth/2); // pixels
var radiusY = window.innerHeight/3; //pixels
//var stretchFactor = 1.1;
var progress, x, y;
//END CIRCULAR PATH VARIABLES


//CIRCLE OBJECT
function Circle(distanceTraveled, startTime, endPosition, duration, animationRunning, forGame, score) {
  //PROPERTIES
  this.distanceTraveled = distanceTraveled;
  this.startTime = startTime;
  this.endPosition = endPosition;
  this.duration = duration; // in milliseconds
  this.animationRunning = animationRunning;
  this.forGame = forGame;
  this.score = score;

  //METHODS

  //reset() sets all properties back to the expected initial state
  this.reset = function() {
    this.distanceTraveled = '0%'; // initialize distanceTraveled to 0
    this.startTime = null;
    this.endPosition = 92; // in percent
    this.duration = this.duration * 0.666;
    this.animationRunning = true;
    this.forGame = true;
    cssCircle.style.visibility = 'initial';
    cssCircle.style.left = distanceTraveled;

  };//end reset()

  this.lost = function() {
    htmlHeader.textContent = textToDisplay.resultText[1];
    htmlParagraph.textContent = "You blotted the sun " + this.score + " times before failing your fellow creatures of the dark. You meditate on their screams as you all slowly burn to death.";
    if (window.innerWidth < 400) {
      htmlEarth.style.height = '0%';
    } else {
      htmlEarth.style.height = '13%';
    }
//    htmlButton.style.visibility = 'initial';
//    htmlButton.setAttribute('class', 'day-button');
//    htmlButton.textContent = textToDisplay.confirmButtonText[4];
//    htmlButton.addEventListener('click', refreshPage, false);
  };

  //renderAnimationLinear() begins moving the css circle across screen
  this.renderAnimationLinear = function(time) {
    if (time === undefined) {
      time = new Date().getTime();
    }
    if (this.startTime === null) {
      this.startTime = time;
    }

    this.distanceTraveled = ((time - this.startTime) / this.duration * this.endPosition);

    if (this.distanceTraveled > this.endPosition) {
      cssCircle.style.visibility = 'hidden';
      this.animationRunning = false;
    }
    cssCircle.style.left = this.distanceTraveled + '%';
  };//end renderAnimationLinear()

  /*
  circular animation taken from http://www.the-art-of-web.com/javascript/animate-curved-path/
  and:
  // Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.

/http://jsfiddle.net/AbdiasSoftware/F8x4p/
  */

  this.renderAnimationCircular = function(time) {

    if (time === undefined) {
      time = new Date().getTime();
    }
    if (this.startTime === null) {
      this.startTime = time;
    }

    progress = (time - this.startTime) / this.duration / 1000; // percent

    x = Math.sin( (progress * 2 * Math.PI) - (2 * Math.PI / 4) ); // x = ƒ(t)
    y = Math.cos( (progress * 2 * Math.PI) - (2 * Math.PI / 4) ); // y = ƒ(t)

    cssCircle.style.left = (centerX + (radiusX * x)) + "px";
    cssCircle.style.bottom = (centerY + (radiusY * y)) + "px";

    if (progress >= 0.5) {
      this.animationRunning = false;
      cssCircle.style.visibility = 'hidden';
      if (forGame) {
        this.lost();
      }
    }

  };


}//END CIRCLE OBJECT



//MISCELLANEOUS FUNCTIONS



//animateAndWatch() calls renderAnimation() and adds an event listener to the circle
function animateSun(){
  //watch sun circle for click when visible
  cssCircle.addEventListener('click', sunCircleClicked, false); //end initial page advancment via confirmation button
  sun.renderAnimationCircular();
  if (sun.animationRunning) {
    requestAnimationFrame(animateSun, cssCircle);
  }
}//use to call renderAnimation()



//function sunCircleClicked
function sunCircleClicked() {
  sun.score++;
  sun.animationRunning = false;
  htmlEarth.removeAttribute('class');
  htmlHeader.textContent = textToDisplay.resultText[0];
  htmlParagraph.textContent = "Such skill! You've restored the night " + sun.score + " times. But beware - the sun always rises. It's peaking now. It seems stronger somehow...";
  cssCircle.style.visibility = 'hidden';
  htmlButton.style.visibility = 'initial';
  htmlBody.setAttribute('class', 'night-body-settings');
  htmlButton.textContent = textToDisplay.confirmButtonText[3];
  htmlButton.addEventListener('click', startCountdown, false);
}
//end function sunCircleClicked



//COUNTDOWN FUNCTION AND VARIABLES
var countdownInterval = 1000; // in milliseconds
var countdownCallTracker = 0; // tracks the number of times countdown() has been called by setInterval()
var countdownIntervalCycle;

function startCountdown() {
  countdownCallTracker = 0;
  //hide the confirm button
  htmlButton.style.visibility = 'hidden';
  //change the background color
  htmlBody.setAttribute('class', 'day-body-settings');
  //make paragraph text blank -- the last element of the paragraphText display needs to stay '' for this to work
  htmlParagraph.textContent = textToDisplay.paragraphText[textToDisplay.paragraphText.length - 1];
  //call countdown()
  countdown();
  countdownIntervalCycle = setInterval(countdown, countdownInterval);
}

function countdown() {
  switch (countdownCallTracker) {
    case 0:
      htmlEarth.setAttribute('class', 'ground');
      htmlHeader.textContent = textToDisplay.countdownText[countdownCallTracker];
      break;
    case 1:
      htmlHeader.textContent = textToDisplay.countdownText[countdownCallTracker];
      break;
    case 2:
      htmlHeader.textContent = textToDisplay.countdownText[countdownCallTracker];
      break;
    case 3:
      htmlHeader.textContent = textToDisplay.countdownText[countdownCallTracker];
      break;
    default:
      htmlHeader.textContent = '';
      sun.reset();
      clearInterval(countdownIntervalCycle);
      animateSun();
    }

    countdownCallTracker++;

}
//END COUNTDOWN FUNCTION AND VARIABLES



//function to determine selected species
function determineSpecies() {
  if (document.getElementById("radio-choice-1").checked === true) {
    selectedSpecies = 0;
  } else if (document.getElementById("radio-choice-2").checked === true) {
    selectedSpecies = 1;
  } else if (document.getElementById("radio-choice-3").checked === true) {
    selectedSpecies = 2;
  } else {
    selectedSpecies = 3;
  }
}
//end function to determine selected species



//function to display story of selected species
function speciesStory() {
  switch (selectedSpecies) {
    case 0:
      htmlParagraph.textContent = textToDisplay.paragraphText[1];
      break;
    case 1:
      htmlParagraph.textContent = textToDisplay.paragraphText[2];
      break;
    case 2:
      htmlParagraph.textContent = textToDisplay.paragraphText[3];
      break;
    default:
      htmlParagraph.textContent = "Something's wrong. It says you're a pikachu?";
  }
}
//end function to display story of selected species

/*

app.js contains JavaScript modified or written by Matt Batman.
app.js contains pageAdvancement(), which is meant to be "the driver program" of the game

*/

//function pageAdvancement()
function pageAdvancement() {

  if (confirmButtonClickCounter === 0) {
    cssCircle.style.visibility = 'hidden'; //hide the moon circle
    moon.animationRunning = false;
    htmlHeader.textContent = textToDisplay.headerText[1];//advance header text displayed on screen
    htmlParagraph.innerHTML = radioFormMarkup; //display the radio form to choose a species
    htmlButton.textContent = textToDisplay.confirmButtonText[1];//advance header text displayed on screen
    confirmButtonClickCounter++; //increment click counter
  } else if (confirmButtonClickCounter === 1) {
    //keep the moon circle hidden
    cssCircle.style.visibility = 'hidden';
  //switch cssCircle class from moon to sun
  cssCircle.removeAttribute('class');
  cssCircle.setAttribute('class', 'sun');
  //check which radio button was selected
  determineSpecies();

  if (selectedSpecies < 3) {
  //advance header text displayed on screen
  htmlHeader.textContent = textToDisplay.headerText[2];

  //display story in paragraph div based on selectedSpecies
  speciesStory();

  //advance button text displayed on screen
  htmlButton.textContent = textToDisplay.confirmButtonText[2];

  //increment click counter
  confirmButtonClickCounter++;
}//end selected species if validation
} else if (confirmButtonClickCounter === 2) {
  //keep the moon circle hidden

  cssCircle.style.visibility = 'hidden';

  startCountdown();
  confirmButtonClickCounter++;
} else if (confirmButtonClickCounter >= 3) {
  //do nothing
}
}//end pageAdvancement()



// EVENT HANDLERS



//animate moon when page loads
document.addEventListener('DOMContentLoaded',
function() {
  (function moonAnimation(){
    moon.renderAnimationCircular();
    if (moon.animationRunning) {
      requestAnimationFrame(moonAnimation, cssCircle);
    }
  })();
},
false);
/*
window.addEventListener('load',
function() {
  (function moonAnimation(){
    moon.renderAnimationCircular();
    if (moon.animationRunning) {
      requestAnimationFrame(moonAnimation, cssCircle);
    }
  })();
},
false);
*/
//advance page when user confirmation button is clicked
htmlButton.addEventListener('click', pageAdvancement, false);




// END EVENT HANDLERS
